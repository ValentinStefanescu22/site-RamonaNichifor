# 0002 – i18n: next-intl pentru mesaje, registru propriu de rute traduse

**Status:** Acceptat · 2026-09-24

## Context

RO (implicit) și EN la lansare, cu căi traduse (`/ro/despre-mine/` ↔ `/en/about/`); mai târziu FR, DE, ES, AR (RTL), HI.
next-intl nu suportă `pathnames` (căi traduse) cu export static, pentru că acestea se bazează pe rescrieri în middleware.

## Decizie

- **next-intl** doar pentru textele de interfață (`messages/*.json`, ICU, `setRequestLocale` pentru randare statică).
- **Registru de rute propriu** (`src/lib/routing/routes.ts`): fiecare cheie de rută are segmente per limbă.
  Din el derivă `href()`, `alternates()` (hreflang, comutator de limbă, sitemap) și `matchRoute()`.
- O singură rută dispecer `app/[locale]/[[...segments]]/page.tsx` generează toate paginile prin `generateStaticParams`.
- `src/i18n/config.ts` descrie limbile (`code`, `dir`, `hreflang`, `label`); CSS doar cu proprietăți logice.

## Consecințe

- **+** Căi traduse pe site static; o singură sursă de adevăr pentru linkuri, hreflang și sitemap.
- **+** Mai puțin dependenți de API-urile next-intl care se schimbă.
- **−** Cod propriu de rutare (~100 de rânduri) de întreținut și testat.
- **−** Dispecerul e mai puțin „standard” decât un folder per pagină.

## Cum se schimbă

Dacă site-ul trece pe un host cu server, se poate reveni la `pathnames` din next-intl; linkurile rămân generate prin `href()`,
deci schimbarea e locală. O limbă nouă: config + `messages/xx.json` + segmente traduse + câmpuri în conținut.
