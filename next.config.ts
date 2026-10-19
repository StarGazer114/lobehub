import { defineConfig } from './src/libs/next/config/define-config';

const isVercel = !!process.env.VERCEL_ENV;

const vercelConfig = {
  // Vercel serverless optimization: exclude musl binaries from all routes
  // Vercel uses Amazon Linux (glibc), not Alpine Linux (musl)
  // This saves ~16MB (sharp-musl) per serverless function
  outputFileTracingExcludes: {
    '*': [
      'node_modules/.pnpm/@img+sharp-libvips-*musl*',
      // Exclude SPA/desktop/mobile build artifacts from serverless functions
      'public/_spa/**',
      'dist/desktop/**',
      'dist/mobile/**',
      'apps/desktop/**',
      'packages/database/migrations/**',
    ],
  },
};
const isNetlify = !!process.env.NETLIFY;

// Netlify rejects function bundles larger than 250 MB (unzipped), and the
// Next.js server handler ends up above that limit with the default tracing.
// Keep the same static artifacts out of the function that the Vercel config
// already excludes, plus the build-time-only toolchain.
const netlifyConfig = {
  outputFileTracingExcludes: {
    '*': [
      'node_modules/.pnpm/@img+sharp-libvips-*musl*',
      'public/_spa/**',
      'dist/desktop/**',
      'dist/mobile/**',
      'apps/desktop/**',
      'packages/database/migrations/**',
      // build-time toolchains, never required by the running handler
      'node_modules/.pnpm/@typescript+native-preview*/**',
      'node_modules/.pnpm/@next+swc-*/**',
      'node_modules/.pnpm/@playwright/**',
      'node_modules/.pnpm/playwright*/**',
    ],
  },
};

const nextConfig = defineConfig({
  ...(isVercel ? vercelConfig : {}),
  ...(isNetlify ? netlifyConfig : {}),
});

export default nextConfig;
