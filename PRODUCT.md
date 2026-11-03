# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Dule i drugari iz teretane: ljudi koji treniraju i prate kalorije i makrose (bulk/cut), znaju šta su proteini, UH i masti.
Svako ima svoj nalog preko linka. Koriste app podjednako na telefonu (brz unos preko dana, posle obroka) i na računaru (pregled dana, kalendar, profil).

## Product Purpose
Dnevno praćenje unosa hrane: korisnik unese namirnicu i količinu, app sabira kalorije, proteine, UH i masti i pokazuje koliko je ostalo do dnevnog cilja izračunatog iz profila (Mifflin-St Jeor + aktivnost).
Uspeh: unos jednog obroka traje do 10 s, dnevni pregled se učita za manje od 1 s.

## Positioning
Mala, besplatna app za ekipu iz teretane: zajednička baza proizvoda koju drugari zajedno pune (domaći proizvodi koje stvarno jedu), a obroci ostaju privatni. Bez reklama i bez plaćenih funkcija.

## Operating Context
- Unos posle obroka na telefonu, često u žurbi; pregled i kalendar na računaru.
- Isti React kod kao web (Vercel) i kasnije desktop (Tauri).
- Ekrani: docs/ekrani.md (prijava, registracija, glavni ekran dana, profil, kalendar).

## Capabilities and Constraints
- Zajednička baza proizvoda (vrednosti na 100 g ili po komadu); pretraga prvo u našoj bazi, pa Open Food Facts; korisnik potvrdi vrednosti.
- Obroci i profil privatni (Supabase RLS).
- Login email + lozinka, sesija ostaje.
- Bez plaćenih API-ja i servisa.
- UI na srpskom (latinica).
- Projekat je i vežba za učenje system design-a; odluke treba kratko objasniti.

## Brand Commitments
- Ime: **Mouse's tracker**.
- Paleta koju je korisnik zadao (obavezna):
  - Zelena `#389600`
  - Svetlozelena `#C2DCB8`
  - Mint `#DFF6ED`
  - Pozadina aplikacije `#E3EEE6`
  - Spoljna pozadina `#D5DCD7`
  - Bela `#FFFFFF`
  - Glavni tekst `#111311`
  - Sivi tekst `#818581`

## Evidence on Hand
- `foods.json`: prvi stvarni proizvodi (obrani sir, pileća prsa narezak, tortilja...).
- Primer dana iz SPEC-a: 150 g sira, 1 tortilja, 200 g pilećih prsa, 10 g kikirikija (~520 kcal, ~52 g P).
- Primer profila: 177 cm, 73 kg, cilj 77 kg (blagi bulk), trening 4–5x nedeljno, ~10 000 koraka; cilj ~3200 kcal, P 130–160 g, M 70–90 g.
- Maskota (miš) i logo: PNG slike u `public/maskota/` (jede, hoda, slavi, cilj, logo, logo-ikona), dodao korisnik (commit 8a33656). Fotografija nema.

## Product Principles
1. Brzina unosa iznad svega: najčešća akcija (dodaj namirnicu) mora biti na dohvat ruke.
2. Brojevi su glavni sadržaj: koliko sam uneo i koliko je ostalo vidi se na prvi pogled.
3. Isto iskustvo na telefonu i računaru.
4. Poverenje u podatke: korisnik uvek vidi i može da ispravi vrednosti pre čuvanja.
