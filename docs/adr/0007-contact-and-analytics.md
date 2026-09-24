# 0007 – Contact fără formular; WhatsApp/mailto; Cloudflare Web Analytics

**Status:** Acceptat · 2026-09-24

## Context
Site static, fără server. Un formular ar cere un serviciu extern, anti-spam și obligații GDPR suplimentare.

## Decizie
- Contact prin link WhatsApp (`wa.me` cu mesaj precompletat, localizat, cu numele produsului), `mailto:`
  (adresa e afișată și ca text), Instagram și Facebook.
- Statistici prin Cloudflare Web Analytics: fără cookie-uri, fără banner de consimțământ.
- Pagină de Confidențialitate simplă + bloc legal în footer (de confirmat cu Ramona și un specialist).

## Consecințe
- **+** Nu stocăm date personale; zero spam; nimic de întreținut.
- **−** Vizitatorii fără WhatsApp/client de e-mail trebuie să copieze adresa (de aceea e afișată ca text).

## Cum se schimbă
Formular ulterior prin Formspree/Web3Forms (cu honeypot + Turnstile) într-o componentă nouă pe pagina Contact.
