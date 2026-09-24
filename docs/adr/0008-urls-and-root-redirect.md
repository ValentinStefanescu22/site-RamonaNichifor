# 0008 – Slash final, redirect fix pentru `/`, fără detectarea limbii

**Status:** Acceptat · 2026-09-24

## Context
Pe un site static nu avem middleware care să aleagă limba. `/` trebuie totuși să ducă undeva, iar Google trebuie să vadă
URL-uri stabile, fără conținut duplicat.

## Decizie
- `trailingSlash: true`: fiecare pagină e `…/index.html`, servită identic de orice host static.
- `public/_redirects` (Cloudflare): `/ → /ro/` (301) și `/ro/carti/ → /ro/carti/copii/` (similar pentru EN).
  Rezervă: `app/page.tsx` cu `redirect('/ro/')`, exportat ca pagină cu meta refresh.
- Fără detectarea automată a limbii; `hreflang` + `x-default` (→ RO) și comutatorul de limbă fac restul.

## Consecințe
- **+** Comportament previzibil, ușor de indexat; nicio pagină nu se schimbă în funcție de browser.
- **−** Un vizitator vorbitor de engleză ajunge întâi pe RO și trebuie să comute (comutatorul e vizibil în header).

## Cum se schimbă
Detectarea limbii se poate adăuga ulterior cu un Cloudflare Worker/Pages Function pe `/`, fără alte modificări.
