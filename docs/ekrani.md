# Ekrani (MVP)

Rutiranje: `react-router`. Svaki ekran ima svoju adresu (radi nazad, osvežavanje i link na dan).
UI na srpskom (latinica).

| Ruta | Ekran | Pristup |
|---|---|---|
| `/login` | Prijava | neulogovan |
| `/registracija` | Registracija | neulogovan |
| `/` | Glavni ekran (danas) | ulogovan |
| `/dan/:datum` | Glavni ekran za izabrani datum (isti ekran kao `/`) | ulogovan |
| `/profil` | Profil | ulogovan |
| `/kalendar` | Kalendar | ulogovan |

Neulogovan korisnik na zaštićenoj ruti → `/login`. Ulogovan na `/login` → `/`.

## Prijava (`/login`)
- Email, lozinka, dugme "Prijavi se".
- "Registruj se" → `/registracija`.
- "Zaboravio si lozinku?" → šalje email za reset.

## Registracija (`/registracija`)
- Email, lozinka, ponovi lozinku.
- Potvrda email-a je uključena: posle registracije poruka "Proveri email da potvrdiš nalog".

## Glavni ekran (`/` i `/dan/:datum`)
- **Zaglavlje:** ikonica kalendara na sredini (→ `/kalendar`), ikonica profila u gornjem desnom uglu.
  Ako profil nije popunjen: crvena tačka koja pulsira na ikonici profila.
- **Levo: unos namirnice**
  - pretraga proizvoda: prvo naša baza, pa Open Food Facts; korisnik potvrdi/ispravi vrednosti
  - ako nema proizvoda: forma za novi (ime, brend, jedinica 100g/komad, kcal, proteini, UH, masti)
  - količina (g ili komad), obrok (doručak / ručak / večera / užina), "Dodaj"
- **Desno: tabela dana**
  - lista unosa (ime, količina, kcal, P, UH, M) sa izmeni/obriši
  - zbir za dan, cilj iz profila, koliko je ostalo
  - dok profil nije popunjen, cilj je "—"
- Za prošle dane (iz kalendara) unos, izmena i brisanje rade isto kao za danas.
- **Telefon:** unos iznad tabele.

## Profil (`/profil`)
- Ime, pol, datum rođenja, visina, težina, treninga nedeljno, koraka dnevno, cilj (smršati / održavati / bulk), ciljna težina.
- Dnevni cilj (kcal, proteini, UH, masti): popunjava formula Mifflin-St Jeor, korisnik može ručno da promeni.
- "Sačuvaj" → `/`. "Odjavi se".

## Kalendar (`/kalendar`)
- Mesec preko celog ekrana; svaki dan je kvadrat sa unetim kcal.
- Klik na dan → `/dan/:datum`.

## Kasnije
- Ikonica kalendara koja se na hover otvara kao knjiga (animacija).
