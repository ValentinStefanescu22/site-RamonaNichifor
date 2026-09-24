import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Static HTML export to `out/` (ADR 0001). No server features allowed.
  output: 'export',
  // Every page becomes `…/index.html`, served the same way by any static host (ADR 0008).
  trailingSlash: true,
  // We don't use next/image; images come from our own sharp pipeline (ADR 0005).
  images: { unoptimized: true },
  experimental: {
    // Our root layout lives under `[locale]`, so the 404 page needs its own document.
    globalNotFound: true,
  },
};

// next-intl is used only for UI messages (ADR 0002).
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
