# Site Ramona Nichifor – Plan de proiect

> Document viu. Deciziile importante au ADR în `docs/adr/`. Ultima actualizare: 2026-09-24.

## Context
Site de prezentare static, RO + EN, pentru Ramona Nichifor (autor, ilustrator, antreprenor, consilier pentru
dezvoltare personală). Buget fix pe pagini. Nu există coș; cumpărarea se face extern (Amazon, eMAG, WhatsApp).
Arhitectura trebuie să permită mai târziu Shopify, pagini de produs, CMS, limbi noi (inclusiv RTL) și universuri noi
**fără rescriere**. Obiectiv SEO minim: site-ul apare la căutarea „Ramona Nichifor”.

**Decizii de la clarificări (2026-09-24):**
1. Cuvintele accentuate din hero se scriu cu Cormorant Garamond Italic; Italianno nu se folosește.
2. Fluturele se decupează deocamdată de pe copertă; varianta PNG transparentă și acuarela mare se cer Ramonei.
3. Titlurile și slug-urile EN sunt traduceri de lucru, de confirmat; textul EN e draft, revizuit de Ramona.
4. `/` face redirect fix spre `/ro/`, fără detectarea limbii; `x-default` → RO.
5. **RO și EN au amândouă eMAG + Amazon**; alte magazine pot apărea mai târziu (doar date).
6. Prețurile nu se afișează la lansare (câmp opțional în model).
7. Scurtăturile din hero: Cărți pentru copii → `booksByAudience/kids`; Picturi și ilustrații → Artă; Dezvoltare personală → Despre mine#consilier; O comunitate cu sens → Contact.
8. Fără formular de contact; WhatsApp + e-mail.
9. Statistici: Cloudflare Web Analytics (fără cookie-uri).
10. Bloc legal în footer + pagină Confidențialitate (de confirmat cu Ramona și un contabil/jurist).
11. Culorile de accent ale universurilor le propun eu; le confirmă Ramona.
12. Numele din header e configurabil, **pornit** în M1.
13. Node 24 LTS (`.nvmrc`); repo GitHub privat; deploy prin integrarea Git a Cloudflare Pages.

---

## 1. Scop și non-scop
**Scop (lansare):** 7 pagini unice (Acasă, Despre mine, Universuri, Artă, Produse, Contact, 404) + 2 șabloane
(Univers ×4, Cărți pe public ×3), complete în RO și EN; header fix centrat cu dropdown-uri generate din date; SEO complet;
WCAG 2.2 AA; Lighthouse mobil ≥ 90; deploy pe Cloudflare Pages.
**În plus (acceptat la #10, în afara listei bugetate):** pagina Confidențialitate + bloc legal în footer. Trebuie confirmat cu Ramona.
**Non-scop:** coș, plăți, conturi, formular de contact, pagini de produs, CMS, blog, pagina Consiliere, alte limbi.
Toate sunt pregătite arhitectural (secțiunea 12), dar nu se construiesc.

## 2. Harta site-ului și rute
Toate căile au slash final (`trailingSlash: true`), ca să fie servite simplu de orice host static (`/ro/arta/index.html`).

| Cheie rută | RO | EN |
|---|---|---|
| `home` | `/ro/` | `/en/` |
| `about` | `/ro/despre-mine/` (#consilier #autor #artist #antreprenor) | `/en/about/` (#counselor #author #artist #entrepreneur) |
| `universes` | `/ro/universuri/` | `/en/universes/` |
| `universe` | `/ro/universuri/{slug.ro}/` | `/en/universes/{slug.en}/` |
| `booksByAudience` | `/ro/carti/{copii\|adolescenti\|adulti}/` | `/en/books/{kids\|teens\|adults}/` |
| `art` | `/ro/arta/` (#originale #printuri → tab activ) | `/en/art/` (#originals #prints) |
| `products` | `/ro/produse/` (filtre în query: `?univers=&tip=&status=`) | `/en/products/` |
| `contact` | `/ro/contact/` | `/en/contact/` |
| `privacy` | `/ro/confidentialitate/` | `/en/privacy/` |
| 404 | `/404.html`, bilingv | — |
| *viitor* `counseling` | `/ro/consiliere/` | `/en/counseling/` |
| *viitor* `product` | `/ro/produse/{slug.ro}/` | `/en/products/{slug.en}/` |

Slug-uri de univers. Cele RO sunt fără diacritice; cele EN sunt **traduceri de lucru**, de confirmat:
`fluturele-dansator-de-step` / `the-tap-dancing-butterfly`, `buburuza-rotunjoara` / `roundy-the-ladybug`,
`tantarul-cu-cizme-de-cauciuc` / `the-mosquito-in-rubber-boots`, `musca-ratacita` / `the-lost-fly`.

- **`/` pe un site static:** `public/_redirects` conține `/  /ro/  301` (Cloudflare) și, ca rezervă pentru alte hosturi, `app/page.tsx` cu `redirect('/ro/')`. La export static, acesta devine o pagină HTML cu meta refresh. Nu se detectează limba browserului.
- `/ro/carti/` → 301 spre `/ro/carti/copii/` (la fel pentru EN), tot în `_redirects`.
- **hreflang:** fiecare pagină declară `ro`, `en` și `x-default` (→ varianta RO), plus canonical la propria versiune. Sursa acestor valori este registrul de rute (secțiunea 5), deci sunt mereu sincronizate cu sitemap-ul și cu comutatorul de limbă.

## 3. Modelul de conținut
Tipurile TypeScript se deduc din scheme Zod (`z.infer`), deci există o singură sursă de adevăr. Validarea rulează la build: dacă datele sunt greșite, build-ul eșuează cu un mesaj clar.
ID-urile sunt în engleză, stabile și independente de limbă (`butterfly`, `book-butterfly`). Slug-urile sunt localizate și se pot schimba fără să rupă referințele.

```ts
type Locale = 'ro' | 'en';                   // derivat din config, nu hardcodat
type Localized<T> = Record<Locale, T>;       // Zod cere toate limbile active
type RichText = string[];                    // paragrafe; ulterior se poate trece la Markdown/portable text
type MediaRef = { src: string; alt: Localized<string> }; // src = cheie din manifestul de imagini

Profile   { name; hero: { roles, lines, cta }; roles: Role[]; social: { instagram, facebook };
            contact: { whatsapp /*E.164*/, email }; legal?: { entityName, taxId, anpcLinks } }
Role      { id: 'counselor'|'author'|'artist'|'entrepreneur'; title: Localized; anchor: Localized;
            summary: Localized; body: Localized<RichText>; image?: MediaRef }
          // titulaturile de consiliere = placeholder până vin certificatele; interzis: „psiholog”, „psihoterapeut”
Series    { id; name: Localized /* Magia suntem noi / We Are the MAGIC */; description: Localized }
Universe  { id; slug: Localized; bookId; tagline: Localized; story: Localized<RichText>;
            accentColor: `#${string}`; status: 'published'|'coming_soon'; order; ogImage?: MediaRef }
Book      { id; title: Localized; subtitle?: Localized; seriesId?; seriesNumber?; universeId?;
            audience: 'kids'|'teens'|'adults'; status: 'published'|'coming_soon';
            cover?: MediaRef /* lipsă → placeholder „Copertă în curând” */;
            editions: Edition[] }
Edition   { language: string /* 'ro','en',… */; format: 'print'|'ebook'|'audiobook'|'video_book';
            isbn?; year?; publisher?; pages? }
          // ISBN-ul aparține unei ediții (limbă + format), nu cărții: ediția EN va avea alt ISBN
Artwork   { id; title: Localized; technique: 'acrylic'|'watercolor'|'illustration'|'painting';
            dimensions?: { widthCm, heightCm }; year?; images: MediaRef[]; description?: Localized }
Product   { id; slug: Localized; type: ProductType; name: Localized; shortDescription?: Localized;
            universeId?; bookId?; artworkId?; images: MediaRef[];
            status: 'available'|'coming_soon'|'made_to_order'|'sold'|'portfolio_only';
            purchaseOptions: PurchaseOption[]; price?: { amount, currency };   // neafișat la lansare
            hasDetailPage: boolean /* false acum */; order }
ProductType = 'book'|'ebook'|'audiobook'|'bookmark'|'card_game'|'family_game'|'ceramic'|'print'|'original'
            // extensibil: se adaugă în enum + eticheta în fișierele de mesaje
PurchaseOption =
  | { kind: 'external_retailer'; retailerId: 'amazon'|'emag'|…; url; locales?: Locale[] /* lipsă = toate */ }
  | { kind: 'contact_inquiry'; channel: 'whatsapp'|'email' }   // mesaj localizat, cu numele produsului
  // viitor, fără refactorizare: | { kind: 'internal_checkout'; provider: 'shopify'; variantId }
Retailer  { id; name; } // registru separat: un magazin nou = o intrare
NavigationItem { id; label; href?; children?: NavigationItem[]; badge?: 'coming_soon' } // generat, nu stocat
SiteConfig { baseUrl; defaultLocale; locales; header: { showName: boolean } }
```

**De ce `Artwork` e separat de `Product` (ADR 0004):**
- *Lucrarea* (titlu, tehnică, dimensiuni, imagine) e un lucru; *ce se vinde* e altceva. Un original poate avea mai multe printuri. O lucrare poate fi doar în portofoliu.
- Pagina Artă afișează lucrări. Pagina Produse și Shopify, mai târziu, lucrează cu produse, deci maparea e 1:1.
- Costul e mic: un câmp `artworkId` pe produs.

**Reguli pentru butoanele de cumpărare, în funcție de status:**

| Status | Ce se afișează |
|---|---|
| `available` | butoanele magazinelor care au URL și se potrivesc limbii |
| `made_to_order` | „Comandă prin mesaj” pe WhatsApp |
| `coming_soon` | eticheta „În curând”, fără butoane |
| `sold` | „Vândut”, cu opțiunea „Întreabă de lucrări similare” |
| `portfolio_only` | nimic |

Un link care lipsește nu blochează build-ul. Butonul pur și simplu nu apare, iar `npm run content:check` listează ce lipsește.

## 4. Stratul de date
- `src/lib/data/index.ts` este **interfața publică**. E singurul loc din care componentele iau date. Toate funcțiile sunt `async`, ca un CMS sau Shopify să poată intra fără modificări în componente:
  `getProfile(l)`, `getSeries(l)`, `getUniverses(l)`, `getUniverse(slug, l)`, `getUniverseById(id, l)`,
  `getBooksByAudience(a, l)`, `getProducts(filter, l)`, `getArtworks(filter, l)`, `getNavigation(l)`, `getSiteConfig()`.
- Funcțiile returnează **view-models deja localizate**: stringuri simple, URL-uri calculate și imaginile rezolvate. Componentele nu văd `Localized<>`.
- `src/lib/data/local/` este implementarea de acum. Importă din `content/*.ts`, validează o singură dată cu Zod, verifică referințele (de exemplu, un `bookId` inexistent produce eroare) și construiește view-models.
- Regulă ESLint (`no-restricted-imports`): `content/**` se poate importa doar din `src/lib/data/local/**`.

## 5. i18n cu export static
- **next-intl** doar pentru textele de interfață: `messages/ro.json` și `messages/en.json`, cu formatare ICU (plural, dată), în mod static prin `setRequestLocale`. Nu folosim middleware și nici `pathnames`, pentru că la export static next-intl nu suportă căi traduse.
- **Registru de rute propriu:** `src/lib/routing/routes.ts`. Fiecare cheie de rută are segmente per limbă. Din el vin:
  - `href(key, params, locale)`, pentru toate linkurile;
  - `alternates(key, params)`, pentru hreflang, comutatorul de limbă și sitemap;
  - `matchRoute(locale, segments)`.
- **Structura App Router:** `app/[locale]/layout.tsx` setează `<html lang dir>`. `app/[locale]/[[...segments]]/page.tsx` este un dispecer mic: `generateStaticParams` enumeră toate rutele din registru și din date, iar `matchRoute` alege componenta de pagină din `src/views/`. Același dispecer calculează `generateMetadata`.
  Dacă ruta opțională `[[...segments]]` dă probleme cu segmentul gol, Acasă primește `app/[locale]/page.tsx` separat. Verific asta în M1.
- **Config de limbi:** `src/i18n/config.ts` conține `{ code, dir: 'ltr'|'rtl', hreflang, label }`. O limbă nouă înseamnă: config, `messages/xx.json`, traducerea segmentelor din registru și a câmpurilor din conținut. Zod refuză build-ul dacă lipsește o traducere într-o limbă activă.
- **Pregătire RTL de la început:** doar proprietăți CSS logice (`ms-*`, `me-*`, `ps-*`, `text-start`), cu o regulă de lint pentru Tailwind; `dir` pe `<html>`; iconițele direcționale (→) se oglindesc prin `rtl:` .
- **Comutatorul de limbă** duce la **aceeași pagină** în cealaltă limbă, folosind `alternates` și păstrând ancora.

## 6. Design system
- **Tailwind CSS v4.** Token-urile stau în `src/styles/theme.css` (`@theme`). Utilitarele sunt standard, bine documentate și nu mai cer fișier de config. Alternativa, CSS Modules, e mai verbose, fără câștig real (ADR 0006).
- **Culori:**

  | Token | Valoare | Folosire |
  |---|---|---|
  | `ink` | `#40345e` | text |
  | `lavender` | `#8174aa` | decor și text mare |
  | `lavender-strong` | `#5f5090` | butoane cu text alb (AA) |
  | `muted` | `#655d77` | text secundar |
  | `paper` | `#ffffff` | fundal |
  | `mist` | `#f8f6fc` | fundal pal |
  | `blush` | `#f5f0fa` | fundal pal |

  Lavanda `#8174aa` pe alb are contrast de aproximativ 4,1:1, deci nu se folosește pentru text mic.
- **Fonturi** prin `next/font/google`, găzduite local, cu subseturile `latin` și `latin-ext` (necesare pentru ș, ț, ă, î, â):
  - Cormorant Garamond 400/500/600 și **italic** (cuvintele accentuate din hero);
  - DM Sans 400/500/600.

  Italianno nu se încarcă.
- **Scară tipografică fluidă:** `clamp()` pentru display, h1–h3, body, small. Spațiere pe o scară de 4 px. Raze: `sm`, `md`, `pill`. Două umbre soft.
- **Accent per univers:** `style={{'--accent': universe.accentColor}}` pe `<main>`. Componentele folosesc `var(--accent)`.
  Culori propuse (de confirmat cu Ramona): Fluturele `#b27bb8`, Buburuza `#d9826f`, Țânțarul `#5f9aa8`, Musca `#8aa383`. Folosite ca text, se verifică pentru AA.
- **Atmosfera:** acuarela ca fundal decorativ (`aria-hidden`, mască CSS), la dreapta, mai mică decât în mockup. Fluturele e un element separat, decupat deocamdată de pe copertă. `prefers-reduced-motion` e respectat.

## 7. Componente
| Componentă | Props principale | Responsabilitate |
|---|---|---|
| `SiteHeader` | `nav, locale, showName` | Header fix centrat. La scroll devine bară subțire (IntersectionObserver pe o santinelă, fără listener de scroll). |
| `NavDropdown` | `item` | Pattern „disclosure”: buton cu `aria-expanded` și `aria-controls`. Se închide la Esc (focus înapoi pe buton), la click în afară și la ieșirea focusului. |
| `MobileMenu` | `nav` | Hamburger, panou cu acordeoane, focus reținut în panou cât e deschis, scroll-ul paginii blocat. |
| `LanguageSwitcher` | `alternates, current` | Linkuri `hreflang` către aceeași pagină. |
| `SiteFooter` | `nav, social, legal` | Nume, linkuri, Instagram, Facebook, ©, limbă, bloc legal. |
| `Hero` | `profile.hero, photo` | Nume, roluri, rânduri cu italic, CTA, foto cu margini estompate. |
| `HeroShortcuts` | `items[4]` | Cele 4 scurtături cu iconițe SVG inline. |
| `Section` | `id, eyebrow, title, tone` | Container de secțiune cu titlu semantic. |
| `UniverseCard` | `universe` | Copertă sau placeholder, titlu, tagline, badge „în curând”, accent. |
| `BookCover` | `cover?, title` | Coperta sau placeholder-ul „Copertă în curând”. |
| `BookDetails` | `book` | An, ISBN, număr în serie, subtitlu. |
| `ProductCard` | `product` | Imagine, tip, nume, status, `PurchaseButtons`. Link spre pagina produsului doar dacă `hasDetailPage`. |
| `PurchaseButtons` | `options, productName` | Butoane magazin și WhatsApp cu mesaj localizat, după regulile de status. |
| `ProductFilters` | `facets, value` | Filtre prin `<fieldset>`/checkbox, sincronizate cu query-ul. Client component în `Suspense`. |
| `ProductGrid` | `products` | Grilă cu starea „niciun rezultat”. |
| `ArtGallery` | `artworks, tabs` | Tab-uri Originale/Printuri (ARIA tabs, sincronizate cu `#hash`) și filtre pe tehnică. |
| `RoleSection` | `role` | Secțiune „Despre mine” cu ancoră. |
| `ContactLinks` | `contact, social` | Buton WhatsApp, e-mail afișat ca text și link, rețele sociale. |
| `ComingSoon` | `label?` | Placeholder standard. |
| `ResponsiveImage` | `mediaKey, sizes, priority?, alt` | `<picture>` AVIF/WebP cu srcset din manifest, width/height (CLS 0). |
| `JsonLd` | `data` | `<script type="application/ld+json">`. |
| `Breadcrumbs` | `items` | Navigație vizibilă și JSON-LD BreadcrumbList. |

## 8. Imagini (fără Image Optimization de la Next.js)
- **Originalele** se copiază din `reference/` în `media-src/`, care se commit-uie.
- **Configurarea** e în `media-src/media.config.ts`: cheie, fișier sursă, decupare opțională (de exemplu, fața copertei: `{left: 812, top: 22, width: 765, height: 1122}`), lățimi țintă și poziție.
- **Scriptul** `scripts/optimize-images.mjs` folosește **sharp** și rulează ca `prebuild`. Generează:
  - lățimile 400/800/1200/1600 (fără upscale), în AVIF și WebP, în `public/media/`, care e ignorat de git;
  - `src/generated/media-manifest.json` cu dimensiuni, căi și un placeholder blur mic;
  - imaginile Open Graph de 1200×630: una implicită (foto și nume pe fundal de acuarelă) și câte una per univers (copertă pe fundalul culorii de accent).
- **Cache:** scriptul sare peste fișierele deja generate și neschimbate.
- **Alternativa respinsă:** `next-image-export-optimizer` e mai „magic”. Scriptul propriu are ~120 de rânduri, e ușor de înțeles și de schimbat (ADR 0005).

## 9. Contact fără server
- Link WhatsApp `https://wa.me/<număr>?text=<mesaj codificat>`, cu mesaj localizat din `messages` (de exemplu: „Bună, Ramona! Aș dori să comand: {product}.”).
- E-mail: link `mailto:` și adresa afișată ca text.
- Instagram și Facebook.
- **Fără formular** (ADR 0007). Astfel nu stocăm date personale și nu avem spam de gestionat. Pagina Confidențialitate descrie doar statisticile (fără cookie-uri) și contactul direct.

## 10. SEO, accesibilitate, performanță
**SEO:**
- Metadata per pagină și limbă prin `generateMetadata`: titlul după modelul `%s · Ramona Nichifor`, descriere, canonical absolut, `alternates.languages` (ro, en, x-default) și Open Graph/Twitter.
- `sitemap.ts` și `robots.ts` cu `dynamic = 'force-static'`: toate rutele din registru și din date, cu alternativele de limbă.
- JSON-LD:
  - `WebSite` și `Person` pe Acasă: `sameAs` spre Instagram și Facebook; `jobTitle` doar titluri nereglementate (Author, Illustrator);
  - `BookSeries` pe Universuri;
  - `Book` pe fiecare univers, cu `workExample` pe ediții și ISBN;
  - `BreadcrumbList` pe paginile de nivel 2+.
- Un singur `<h1>` pe pagină și landmark-uri (`header`, `nav`, `main`, `footer`).
- După lansare, în M6: Google Search Console (proprietate de domeniu prin DNS TXT la Cloudflare), trimiterea sitemap-ului, inspectarea URL-urilor principale, Bing Webmaster (import din GSC), verificarea rezultatului pentru „Ramona Nichifor” după 1–4 săptămâni.

**Accesibilitate (WCAG 2.2 AA):**
- contrast AA;
- focus vizibil (3 px) care nu e acoperit de header-ul fix (`scroll-padding-top`);
- ținte de minimum 24×24 px (44 recomandat);
- navigare completă din tastatură;
- `alt` localizat (gol pentru decor);
- skip link;
- `lang` și `dir`;
- reduced motion;
- filtre anunțate prin `aria-live` („12 produse”).

Verificare cu axe (Playwright + `@axe-core/playwright`) pe toate rutele și manual din tastatură.

**Performanță:**
- JS minim: Server Components implicit, client doar pentru header, meniu, filtre și tab-uri;
- imaginea LCP (foto din hero) cu `fetchpriority="high"` și AVIF;
- acuarela cu rezoluție mai mică și `loading="lazy"` în afara hero-ului;
- fonturi cu `display: swap` și subseturi.

Țintă: Lighthouse mobil ≥ 90 la toate cele 4 categorii.

## 11. Structura folderelor
```
app/                     # doar rutare: [locale]/layout, [locale]/[[...segments]]/page, page.tsx (redirect), not-found, sitemap.ts, robots.ts
src/
  views/                 # o componentă per tip de pagină (HomeView, UniverseView, ProductsView…)
  components/            # layout/ (header, footer, nav), ui/ (butoane, carduri), sections/
  lib/data/              # index.ts (interfață) + local/ (implementare) + types.ts (view-models)
  lib/routing/           # routes.ts (registru), href, alternates, matchRoute
  lib/seo/               # metadata + builderi JSON-LD
  i18n/                  # config.ts (limbi), request.ts (next-intl)
  styles/                # globals.css, theme.css (tokens)
  generated/             # media-manifest.json (generat, ignorat de git)
content/                 # DATE: profile.ts, series.ts, universes.ts, books.ts, products.ts, artworks.ts, retailers.ts, site.ts, schemas.ts
messages/                # ro.json, en.json (texte UI)
media-src/               # imagini originale + media.config.ts
scripts/                 # optimize-images.mjs, content-check.mjs
public/                  # _redirects, _headers, favicon; media/ generat
docs/                    # PLAN.md, adr/
reference/               # prototip, nu intră în build
tests/                   # e2e + a11y (Playwright)
```

## 12. Căi de migrare
- **(a) Shopify:**
  1. adaug `PurchaseOption.kind = 'internal_checkout'` (`provider: 'shopify'`, `variantId`);
  2. `PurchaseButtons` primește un caz nou, „Adaugă în coș”, prin Shopify Buy Button/Storefront API pe client (merge și pe site static) sau prin checkout Shopify hostat;
  3. produsele pot veni din Storefront API la build: se implementează `getProducts` în `lib/data/shopify/`, iar restul rămâne local.

  UI-ul și rutele nu se schimbă.
- **(b) Pagini de produs:** `hasDetailPage: true` pe produsele dorite, ruta `product` în registru și `ProductView`. `generateStaticParams` le include automat, la fel sitemap-ul.
- **(c) CMS** (de exemplu Sanity, Decap sau Keystatic): schemele Zod devin modelele CMS-ului; se scrie `lib/data/cms/` cu aceeași interfață și se schimbă importul din `lib/data/index.ts`. Rebuild prin webhook pe Cloudflare Pages (deploy hook).
- **(d) Limbă nouă** (exemplu: `ar`, RTL):
  1. `i18n/config.ts` primește `{code: 'ar', dir: 'rtl'}`;
  2. `messages/ar.json`;
  3. segmentele traduse în registru;
  4. câmpurile `ar` în conținut (Zod arată ce lipsește);
  5. un font cu suport arab (de exemplu Noto Naskh Arabic) încărcat doar pentru `ar`;
  6. verificare vizuală RTL.
- **(e) Pagina Consiliere:** cheia `counseling` în registru, `CounselingView`, date noi în `profile` sau `counseling.ts`, o intrare în navigație. Ancora din „Despre mine” rămâne.
- **(f) Univers nou:** doar date (o intrare în `universes.ts`, `books.ts` și `products.ts`, plus imaginile în `media-src/`). Meniul, sitemap-ul, rutele și paginile se generează singure.

## 13. ADR-uri (`docs/adr/`)
0001 Next.js static export + Cloudflare Pages ·
0002 i18n: next-intl pentru mesaje, registru propriu de rute traduse ·
0003 Conținut ca date TS + Zod + strat de date ·
0004 `Artwork` separat de `Product` ·
0005 Pipeline de imagini cu sharp ·
0006 Tailwind v4 + tokens ·
0007 Fără formular de contact; WhatsApp/mailto; Cloudflare Web Analytics ·
0008 Rute cu slash final, redirect fix pentru `/`, fără detectarea limbii.

## 14. Milestone-uri
**Definition of Done**, pentru fiecare milestone:
- ambele limbi complete;
- fără text hardcodat în componente (lint + verificare de review);
- verificat pe mobil (375 px) și desktop (1440 px);
- navigabil din tastatură;
- axe fără erori;
- `npm run build` static fără erori sau avertismente de tip;
- Lighthouse mobil ≥ 90;
- commit-uri Conventional Commits.

- **M1 – Fundația și Acasă** (conform promptului)
  - [ ] scaffold în folder temporar, mutat în rădăcină; `output: 'export'`, `trailingSlash`, TS strict, ESLint, Prettier, `.gitignore`, `.nvmrc` (24)
  - [ ] `mockup-annotated.jpeg` mutat în `reference/`; `.DS_Store` ignorat
  - [ ] i18n (config, mesaje, registru de rute, dispecer, redirect `/`)
  - [ ] tokens și fonturi
  - [ ] scheme Zod, conținut real (4 universuri, Fluturele, colecția, rolurile), strat de date, `content:check`
  - [ ] pipeline de imagini (inclusiv decuparea copertei și a fluturelui)
  - [ ] header, dropdown-uri, meniu de telefon, footer, comutator de limbă
  - [ ] pagina Acasă RO și EN, cu metadata, JSON-LD `Person`/`WebSite`, sitemap și robots de bază
  - [ ] build static, instrucțiuni de rulare locală și primul deploy pe Cloudflare Pages
- **M2 – Universuri și cărți:** șablonul de univers, lista Universuri, Cărți pe public, JSON-LD `Book`/`BookSeries`, OG per univers.
- **M3 – Produse și Artă:** pagina Produse cu filtre (query), Artă cu tab-uri și filtre, date `Artwork`.
- **M4 – Despre mine, Contact, 404, Confidențialitate:** plus blocul legal din footer.
- **M5 – Calitate:** teste Playwright și axe, Lighthouse pe toate rutele, revizuirea textelor EN, înlocuirea placeholder-elor cu materialele primite.
- **M6 – Lansare:** domeniu și DNS, Web Analytics, Search Console, sitemap trimis, checklist post-lansare.

## 15. Riscuri și întrebări deschise
- **Materiale lipsă** (coperți, linkuri, texte): se lansează cu placeholder-e, iar `content:check` le listează.
- **Acuarela** are rezoluție mică și e în format portret. Pe desktop lat poate arăta pixelată; trebuie cerută o variantă mare.
- **Traducerile EN** sunt draft făcut de mine. Titlurile cărților în engleză trebuie confirmate de Ramona.
- **Legal:** dacă se vinde direct prin mesaj, pot fi obligatorii datele firmei și linkurile ANPC SAL/SOL. De verificat cu un contabil sau jurist.
- **Titulaturi:** doar cele de pe certificate. Până atunci, placeholder neutru.
- **Evoluția Next.js și next-intl:** versiunile se fixează în `package-lock`, iar rutarea proprie ne face mai puțin dependenți de next-intl.
- **Hosting:** Cloudflare recomandă Workers Static Assets pentru proiecte noi, iar Pages rămâne suportat. Mutarea e trivială, pentru că output-ul e doar folderul `out/`. Termenii de uz comercial se reverifică la lansare.
- **„Tablouri” ca tehnică:** acrilic și acuarelă sunt tehnici, „tablou” e un format. De confirmat cu Ramona categoriile exacte ale filtrului.
- **Imaginea din `mockup-annotated.jpeg` e generată de AI** și nu se folosește ca asset.

## 16. Materiale de cerut Ramonei
1. Texte finale: bio scurt și lung; cele 4 secțiuni din Despre mine; povestea fiecărui univers; descrieri de produse. Validare pentru textele EN.
2. Titlurile oficiale în engleză ale celor 4 cărți.
3. Titulaturile exacte de pe certificatele de consiliere (și ce e permis să se afișeze).
4. Coperțile celorlalte 3 cărți, când există. Fișierul original, la rezoluție mare, pentru *Fluturele*.
5. Fluturele ca PNG transparent la rezoluție mare; acuarela de fundal la rezoluție mare, în format peisaj.
6. Fotografii: portret la rezoluție mare (și alte variante pentru Despre mine); lucrări (originale și printuri, cu titlu, tehnică, dimensiuni, an, status); produse (semne de carte, cărți de joc, joc, cană pe fundal neutru).
7. Linkuri eMAG și Amazon pentru fiecare ediție, plus alte magazine când apar.
8. Număr WhatsApp (pentru business), adresă de e-mail, URL-urile de Instagram și Facebook.
9. Editura și orașul pentru *Fluturele* (coperta: „Bacău 2026”), ediții și ISBN-uri viitoare (EN, e-book, audiobook).
10. Date legale, dacă vinde direct (PFA/SRL, CUI).
11. Confirmarea culorilor de accent pentru universuri și a numelui din header (da/nu).
12. Categoriile de tehnică pentru filtrul din Artă.

