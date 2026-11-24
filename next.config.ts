import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
};

const withNextIntl = createNextIntlPlugin();

console.log('[env-check]', {
  target: process.env.VERCEL_TARGET_ENV ?? process.env.VERCEL_ENV ?? 'local',
  branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
  neonBaseUrl: Boolean(process.env.NEON_AUTH_BASE_URL),
  neonCookieSecret: Boolean(process.env.NEON_AUTH_COOKIE_SECRET),
});

export default withNextIntl(nextConfig);
