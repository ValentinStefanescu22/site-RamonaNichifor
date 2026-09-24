import type { SiteInput } from './schemas';

export const site: SiteInput = {
  // TODO(launch): replace with Ramona's domain. `SITE_URL` env var overrides this at build time.
  baseUrl: 'https://ramona-nichifor.pages.dev',
  header: {
    // Decision pending with Ramona: small name above the menu (true) or menu only (false).
    showName: true,
  },
};
