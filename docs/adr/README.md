# Architecture Decision Records

Fiecare ADR descrie o decizie importantă: **Context / Decizie / Consecințe / Cum se schimbă**.
Un ADR nu se rescrie; dacă decizia se schimbă, se scrie unul nou care îl înlocuiește („Înlocuit de 00xx”).

| #                                              | Decizie                                                      | Status   |
| ---------------------------------------------- | ------------------------------------------------------------ | -------- |
| [0001](0001-static-export-cloudflare-pages.md) | Next.js static export + Cloudflare Pages                     | Acceptat |
| [0002](0002-i18n-routing.md)                   | next-intl pentru mesaje, registru propriu de rute traduse    | Acceptat |
| [0003](0003-content-as-typed-data.md)          | Conținut ca date TS + Zod + strat de date                    | Acceptat |
| [0004](0004-artwork-vs-product.md)             | `Artwork` separat de `Product`                               | Acceptat |
| [0005](0005-image-pipeline.md)                 | Pipeline de imagini cu sharp                                 | Acceptat |
| [0006](0006-tailwind-tokens.md)                | Tailwind v4 + design tokens                                  | Acceptat |
| [0007](0007-contact-and-analytics.md)          | Fără formular; WhatsApp/mailto; Cloudflare Web Analytics     | Acceptat |
| [0008](0008-urls-and-root-redirect.md)         | Slash final, redirect fix pentru `/`, fără detectarea limbii | Acceptat |
