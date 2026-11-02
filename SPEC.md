# SPEC — Food Tracker

## Zahtevi (Korak 1)

### Funkcionalni
- Registracija i login
- Profil: visina, težina, godine, pol, cilj (smršati / održavati / bulk), treninzi nedeljno, koraci dnevno → izračun dnevnog cilja (kcal + makrosi, Mifflin-St Jeor)
- Zajednička baza proizvoda: ulogovani korisnici čitaju, dodaju i menjaju, briše samo ko ga je uneo, pamti se ko je poslednji menjao; pretraga pre dodavanja (protiv duplikata)
- Unos obroka: izaberi proizvod + količina (g ili komad); ako proizvoda nema, unese ga ručno (vrednosti na 100 g / po komadu) i on ulazi u zajedničku bazu
- Pretraga namirnice: prvo naša baza, pa Open Food Facts (besplatno, bez ključa); korisnik potvrdi/ispravi vrednosti i proizvod se čuva u zajedničku bazu
- Izmena i brisanje unosa
- Dnevna tabela: svi unosi za dan, zbir kcal i makrosa, koliko fali do cilja
- Kalendar: klik na dan prikazuje istoriju unosa tog dana
- Obroci su privatni: korisnik vidi samo svoje unose i profil

### Nefunkcionalni
- Privatnost: obroci i profil samo vlasniku (Row Level Security u bazi); lozinke hešovane (Supabase auth)
- Brzina: dnevni pregled < 1 s (95% zahteva); unos jednog obroka korisniku traje do 10 s
- Platforme: web (i na telefonu, responsive) i desktop (Tauri), isti podaci
- Trajnost: podaci u bazi, ne u aplikaciji; backup plan (besplatni Supabase pauzira posle ~7 dana neaktivnosti i nema auto-backup)
- Obim: do ~50 korisnika
- "Danas" = datum u vremenskoj zoni korisnika
- Istorija se ne menja unazad: unos čuva kopiju vrednosti proizvoda (snapshot)
- Bez plaćenih API-ja i servisa (važi i posle MVP-a)

### Van MVP-a
- Slika deklaracije (kasnije besplatan OCR u browseru uz ručnu proveru, bez plaćenog AI-ja)

## MVP (prva verzija)
- Registracija i login
- Profil sa ciljevima: kcal, proteini, UH, masti, trenutna i ciljna težina
- Baza proizvoda: vrednosti na 100 g (ili po komadu, npr. tortilja)
- Unos obroka: izaberi proizvod + količinu (g ili komad), ili ručni unos
- Dnevni pregled: zbir kcal i makrosa, progress barovi do cilja, koliko još fali
- Link koji šaljem drugima — svako ima svoj nalog i vidi samo svoje podatke

## Faza 2: Desktop app
- Isti React kod zapakovan u Tauri (Windows, opciono Mac/Linux)
- Login radi i u desktop app-u, sesija ostaje sačuvana posle zatvaranja
- Instalacioni fajl koji mogu da pošaljem drugima
- Podaci isti kao na webu (isti Supabase backend)

## Posle toga
- Istorija po danima i nedeljni prosek
- Praćenje težine (graf)
- Brzi unos čestih obroka ("kao juče", omiljeni obroci)
- Skeniranje deklaracije slikom (besplatan OCR u browseru, npr. Tesseract.js, uz ručnu proveru)
- Deljenje napretka sa prijateljima (opciono)
- Integracija u gym app (isti backend)

## Primer dana (za testiranje)
Doručak: 150 g sira, 1 tortilja, 200 g pilećih prsa, 10 g kikirikija → ~520 kcal, ~52 g P
