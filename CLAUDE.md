# Food Tracker — CLAUDE.md

## O projektu
Aplikacija za praćenje ishrane (kalorije i makrosi) koju više ljudi koristi preko linka, svako sa svojim profilom.
Projekat je ujedno **vežba za učenje system design-a**, pre većeg projekta (logistički softver koji zamenjuje Excel i ručne korake).

## Režim učenja (VAŽNO)
- Radimo korak po korak, ne pravi sve odjednom.
- Pre svake veće odluke objasni koncept: **šta je, zašto se koristi, koje su alternative**.
- Na kraju svakog koraka kratko reci kako se isti koncept primenjuje na logistički softver.
- Daj mi male zadatke da sam razmislim (npr. "napiši zahteve", "nacrtaj tabele"), pa tek onda pregledaj i dopuni.
- Odgovori kratki i jasni, bez eseja.

### Plan učenja
1. Zahtevi (funkcionalni i nefunkcionalni)
2. Model podataka (entiteti, relacije, tabele)
3. Arhitektura (frontend / backend / baza, zašto razdvojeni)
4. API (kako delovi komuniciraju)
5. Autentifikacija i dozvole (ko šta vidi)
6. Skaliranje i održavanje

Trenutno smo na: **Korak 6 — Skaliranje i održavanje** (Korak 1: SPEC.md, 2: docs/model.md, 3: docs/arhitektura.md, 4: docs/api.md, 5: docs/dozvole.md).

## Stack
Princip: **jedan backend, više klijenata** (isti pristup planiramo za logistički softver).
- **Backend/baza:** Supabase (Postgres, auth, Row Level Security), zajednički za sve klijente
- **Frontend:** React + Vite (TypeScript), jedan kod za web i desktop
- **Web klijent:** isti React build na Vercel-u (link koji šaljem drugima)
- **Desktop klijent:** isti React kod zapakovan u **Tauri** (Electron kao alternativa ako Tauri zapne)
- **Kasnije:** mobilna app (React Native / Expo) na istom backendu, i integracija u moju gym app

### Redosled
1. Web verzija (MVP)
2. Pakovanje u Tauri desktop app
3. Rešavanje razlika: login i čuvanje sesije u desktop app-u, build, instalacija

## Pravila za kod
- Modularno: logika za obroke/proizvode odvojena od UI-a, da se kasnije lako prenese u gym app.
- Bez koda koji radi samo u browseru ili samo u desktop-u bez razloga; razlike između web i Tauri verzije drži na jednom mestu.
- UI na srpskom (latinica).
- Svaki korisnik vidi samo svoje podatke.
- Bez plaćenih API-ja i servisa (AI, OCR, pretraga...); samo besplatne opcije.
- Prvo MVP (vidi SPEC.md), pa proširenja.

## Git
- Nikad ne dodaji `Co-Authored-By: Claude` niti bilo kakvu Claude atribuciju u commit-e i PR-ove. Claude nije kolaborator na projektu.
- `.env` i svi ključevi idu u `.gitignore` pre prvog commit-a.
- Jasne commit poruke na srpskom (npr. "dodat unos obroka").

## Moj profil (primer default korisnika)
- 177 cm, 73 kg, cilj 77 kg (blagi bulk)
- Trening 4–5x nedeljno, ~10 000 koraka dnevno
- Cilj: ~3200 kcal, proteini 130–160 g, masti 70–90 g, ostatak UH
