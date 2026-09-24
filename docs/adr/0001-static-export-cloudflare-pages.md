# 0001 – Next.js static export + Cloudflare Pages

**Status:** Acceptat · 2026-09-24

## Context

Site de prezentare fără coș, conturi sau date dinamice. Buget mic, fără costuri lunare de hosting.
Clientul are uz comercial, deci Vercel Hobby (interzice uzul comercial) nu e o opțiune.

## Decizie

- Next.js (App Router) + TypeScript strict, cu `output: 'export'`: build-ul produce HTML/CSS/JS static în `out/`.
- Hosting pe **Cloudflare Pages** (plan Free: uz comercial permis, lățime de bandă nelimitată pentru fișiere statice,
  500 build-uri/lună, 20.000 fișiere/site), deploy prin integrarea Git.

## Consecințe

- **+** Rapid (CDN), sigur (fără server de atacat), gratuit, previzibil.
- **+** Next.js ne dă componente, rutare, metadata, sitemap, fonturi optimizate.
- **−** Fără middleware, API routes, ISR sau Image Optimization din Next.js (vezi ADR 0002, 0005).
- **−** Orice modificare de conținut înseamnă un rebuild (~1–2 min), acceptabil pentru un site editat rar.

## Cum se schimbă

Output-ul e un folder static: se poate muta pe Cloudflare Workers Static Assets, Netlify, GitHub Pages etc. în câteva minute.
Dacă apare nevoia de server (de ex. checkout propriu), se scoate `output: 'export'` și se trece pe un host cu runtime,
fără a rescrie componentele. Termenii de uz comercial se reverifică la lansare.
