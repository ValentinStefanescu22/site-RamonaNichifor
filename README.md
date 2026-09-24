# Ramona Nichifor – site

Site de prezentare static, bilingv (RO/EN), pentru Ramona Nichifor.
Next.js (App Router) + TypeScript, export static, găzduit pe Cloudflare Pages.

- Plan și decizii: [`docs/PLAN.md`](docs/PLAN.md), [`docs/adr/`](docs/adr/)

## Rulare locală

Cerințe: Node 24 LTS (`nvm use` citește `.nvmrc`).

```bash
npm install
npm run dev          # http://localhost:3000/ro/  (generează întâi fonturile și imaginile)
```

Verificarea versiunii de producție (exact fișierele care ajung pe server):

```bash
npm run build        # → folderul out/
npm run preview      # servește out/ pe http://localhost:3000 (cu compresie, ca în producție)
```

`/` redirecționează spre `/ro/` doar pe Cloudflare (`public/_redirects`); local deschide direct `/ro/` sau `/en/`.

Alte comenzi: `npm run lint`, `npm run typecheck`, `npm run format`, `npm run content:check`
(lista materialelor care lipsesc: linkuri, coperți, date de contact).

## Unde se modifică

| Ce                                        | Unde                                       |
| ----------------------------------------- | ------------------------------------------ |
| Texte, cărți, universuri, produse, roluri | `content/*.ts` (validat la build)          |
| Texte de interfață (meniu, butoane)       | `messages/ro.json`, `messages/en.json`     |
| Imagini                                   | `media-src/` + `media-src/media.config.ts` |
| Culori, fonturi, dimensiuni               | `src/styles/theme.css`                     |

## Deploy pe Cloudflare Pages (prima dată)

1. Urcă repo-ul pe GitHub (**privat**, `reference/` conține fotografii personale).
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → alege repo-ul.
3. Setări de build:
   - Framework preset: **None** (e un export static)
   - Build command: `npm run build`
   - Build output directory: `out`
   - Environment variables: `NODE_VERSION` = `24`
4. **Save and Deploy.** Site-ul apare la `https://<proiect>.pages.dev`.
   Până la lansare paginile au `noindex` și `robots.txt` blochează indexarea (intenționat).
5. La lansare (Milestone 6):
   - adaugă domeniul Ramonei în proiect (**Custom domains**) și configurează DNS-ul;
   - setează variabilele `SITE_URL=https://domeniul-ramonei.ro` și `ALLOW_INDEXING=true`, apoi redeploy;
   - activează Web Analytics și adaugă site-ul în Google Search Console.

Fiecare `git push` pe `main` publică automat; celelalte branch-uri primesc un URL de preview.
