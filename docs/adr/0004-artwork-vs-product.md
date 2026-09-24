# 0004 – `Artwork` separat de `Product`

**Status:** Acceptat · 2026-09-24

## Context

Pagina Artă prezintă originale și printuri. Unele lucrări se vând, altele sunt doar în portofoliu.
Un original poate avea mai multe printuri. Mai târziu, produsele pot veni din Shopify.

## Decizie

- `Artwork` = lucrarea (titlu, tehnică, dimensiuni, an, imagini, descriere).
- `Product` = ce se vinde; produsele de tip `original` și `print` au `artworkId`.
- Statusul de vânzare (`available`, `sold`, `portfolio_only` …) și opțiunile de cumpărare stau doar pe `Product`.

## Consecințe

- **+** Un print nou pentru o lucrare existentă = un produs nou, fără date duplicate.
- **+** Maparea 1:1 `Product` ↔ produs Shopify.
- **−** O entitate în plus și o referință de validat.

## Cum se schimbă

Dacă se dovedește inutil, `Artwork` se poate „turti” în câmpuri opționale pe `Product` printr-o migrare de date simplă.
