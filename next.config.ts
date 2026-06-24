import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseRemotePattern = supabaseUrl
  ? {
      protocol: "https" as const,
      hostname: new URL(supabaseUrl).hostname,
      pathname: "/storage/v1/object/public/**",
    }
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(supabaseRemotePattern ? [supabaseRemotePattern] : []),
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
