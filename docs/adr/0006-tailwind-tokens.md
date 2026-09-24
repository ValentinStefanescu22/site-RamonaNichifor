# 0006 – Tailwind CSS v4 + design tokens

**Status:** Acceptat · 2026-09-24

## Context
Avem o paletă, două fonturi și o atmosferă definite. Dezvoltatorul învață web development; vrem o soluție standard,
bine documentată, care ține stilurile coerente și suportă RTL.

## Decizie
- Tailwind CSS v4; tokens (culori, fonturi, scară tipografică, spațiere, raze, umbre) în `src/styles/theme.css` cu `@theme`.
- Fonturi prin `next/font/google` (self-hosted): Cormorant Garamond (400/500/600 + italic) și DM Sans (400/500/600),
  subseturi `latin` + `latin-ext`.
- Culoarea de accent per univers prin variabila CSS `--accent`.
- Doar utilitare logice (`ms-`, `pe-`, `text-start`) pentru compatibilitate RTL.

## Consecințe
- **+** Tokens centralizați; documentație și exemple abundente; CSS final mic (doar clasele folosite).
- **−** Clase lungi în JSX; se compensează cu componente mici și reutilizabile.
- **Respins:** CSS Modules (mai verbose, tokens duplicați manual).

## Cum se schimbă
Tokenii sunt variabile CSS standard; se pot reutiliza cu orice altă abordare de styling.
