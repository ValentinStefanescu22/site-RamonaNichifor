# 0003 – Conținut ca date TypeScript + Zod + strat de date

**Status:** Acceptat · 2026-09-24

## Context
Azi doar dezvoltatorul editează conținutul, în repo. Mâine poate veni un CMS sau Shopify.
Componentele nu trebuie să știe de unde vin datele.

## Decizie
- Conținutul stă în `content/*.ts`, ca obiecte cu câmpuri localizate (`Localized<T> = Record<Locale, T>`).
- Schemele **Zod** (`content/schemas.ts`) sunt sursa tipurilor (`z.infer`) și validează datele la build,
  inclusiv referințele (`bookId`, `universeId` etc.) și traducerile lipsă.
- `src/lib/data/index.ts` expune o interfață `async` (`getUniverses(locale)`, `getProducts(filter, locale)` …) care
  returnează view-models deja localizate. Implementarea actuală e în `src/lib/data/local/`.
- ESLint interzice importul din `content/` în afara `src/lib/data/local/`.
- ID-uri stabile în engleză; slug-urile sunt localizate și independente de ID.

## Consecințe
- **+** Greșelile de conținut opresc build-ul cu mesaj clar, nu ajung în producție.
- **+** Schimbarea sursei de date (CMS, Shopify) atinge un singur folder.
- **−** Editarea textelor lungi în TS e mai puțin comodă decât în Markdown; acceptabil acum.

## Cum se schimbă
CMS: schemele Zod devin modelele CMS-ului; se scrie `src/lib/data/cms/` cu aceeași interfață și se schimbă exportul
din `index.ts`. Surse mixte sunt posibile (de ex. produse din Shopify, restul local).
