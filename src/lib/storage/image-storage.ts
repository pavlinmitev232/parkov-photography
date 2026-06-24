import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type ImageStorageTarget = "portfolio" | "site-assets";

type TargetConfig = {
  bucket: string;
  localDirectory: string;
  localUrlPrefix: string;
  maxSize: number;
};

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

const targetConfig: Record<ImageStorageTarget, TargetConfig> = {
  portfolio: {
    bucket: process.env.SUPABASE_PORTFOLIO_BUCKET || "portfolio",
    localDirectory: path.dirname(
      fileURLToPath(
        new URL(
          "../../../public/uploads/portfolio/.gitkeep",
          import.meta.url,
        ),
      ),
    ),
    localUrlPrefix: "/uploads/portfolio/",
    maxSize: 8 * 1024 * 1024,
  },
  "site-assets": {
    bucket: process.env.SUPABASE_SITE_ASSETS_BUCKET || "site-assets",
    localDirectory: path.dirname(
      fileURLToPath(
        new URL("../../../public/uploads/site/.gitkeep", import.meta.url),
      ),
    ),
    localUrlPrefix: "/uploads/site/",
    maxSize: 10 * 1024 * 1024,
  },
};

let supabaseClient: SupabaseClient | null | undefined;

export class ImageStorageError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function getSupabaseClient() {
  if (supabaseClient !== undefined) {
    return supabaseClient;
  }

  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  supabaseClient =
    url && secretKey
      ? createClient(url, secretKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        })
      : null;

  return supabaseClient;
}

function validateImage(file: File, target: ImageStorageTarget) {
  const extension = allowedTypes.get(file.type);

  if (!extension) {
    throw new ImageStorageError("Unsupported image type", 400);
  }

  if (file.size > targetConfig[target].maxSize) {
    throw new ImageStorageError("Image is too large", 400);
  }

  return extension;
}

export async function storeImage(file: File, target: ImageStorageTarget) {
  const extension = validateImage(file, target);
  const config = targetConfig[target];
  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const client = getSupabaseClient();

  if (!client) {
    await mkdir(config.localDirectory, { recursive: true });
    await writeFile(path.join(config.localDirectory, fileName), bytes);
    return `${config.localUrlPrefix}${fileName}`;
  }

  const { error } = await client.storage
    .from(config.bucket)
    .upload(fileName, bytes, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Supabase image upload failed.", {
      bucket: config.bucket,
      error,
    });
    throw new ImageStorageError("Image upload failed", 502);
  }

  return client.storage.from(config.bucket).getPublicUrl(fileName).data.publicUrl;
}

export async function deleteManagedImage(
  imageUrl: string,
  target: ImageStorageTarget,
) {
  const config = targetConfig[target];

  if (imageUrl.startsWith(config.localUrlPrefix)) {
    const fileName = path.basename(imageUrl);
    await unlink(path.join(config.localDirectory, fileName)).catch(() => undefined);
    return;
  }

  const client = getSupabaseClient();
  const supabaseUrl = process.env.SUPABASE_URL;

  if (!client || !supabaseUrl) {
    return;
  }

  const publicPrefix = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${config.bucket}/`;

  if (!imageUrl.startsWith(publicPrefix)) {
    return;
  }

  const objectPath = decodeURIComponent(imageUrl.slice(publicPrefix.length));
  const { error } = await client.storage.from(config.bucket).remove([objectPath]);

  if (error) {
    console.error("Supabase image deletion failed.", {
      bucket: config.bucket,
      objectPath,
      error,
    });
  }
}
