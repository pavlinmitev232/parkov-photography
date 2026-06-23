import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminPath } from "@/lib/admin-path";

const cookieName = "parkov_owner_session";
const sessionDurationMs = 1000 * 60 * 60 * 8;

type OwnerSessionPayload = {
  email: string;
  expiresAt: number;
};

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is required for owner sessions.");
  }

  return secret;
}

function signPayload(encodedPayload: string) {
  return createHmac("sha256", getSecret()).update(encodedPayload).digest("base64url");
}

export function createOwnerSessionToken(email: string) {
  const payload: OwnerSessionPayload = {
    email,
    expiresAt: Date.now() + sessionDurationMs,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyOwnerSessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload);
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as OwnerSessionPayload;

    if (!payload.email || payload.expiresAt < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function setOwnerSessionCookie(email: string) {
  const cookieStore = await cookies();

  cookieStore.set(cookieName, createOwnerSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionDurationMs / 1000,
  });
}

export async function clearOwnerSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getOwnerSession() {
  const cookieStore = await cookies();
  return verifyOwnerSessionToken(cookieStore.get(cookieName)?.value);
}

export async function requireOwnerSession(locale?: string) {
  const session = await getOwnerSession();

  if (!session) {
    redirect(locale ? `/${locale}${adminPath}/login` : `${adminPath}/login`);
  }

  return session;
}
