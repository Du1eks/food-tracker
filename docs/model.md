# Model podataka (Korak 2)

```mermaid
erDiagram
  AUTH_USERS ||--|| PROFIL : ima
  AUTH_USERS ||--o{ UNOS : unosi
  AUTH_USERS ||--o{ PROIZVOD : dodaje
  PROIZVOD |o--o{ UNOS : "koristi se u"
  AUTH_USERS {
    uuid id PK
    text email
    text lozinka_hes "Supabase"
  }
  PROFIL {
    uuid id PK,FK "isti kao auth id"
    text ime
    text pol "m / z"
    date datum_rodjenja
    numeric visina_cm "100-250"
    numeric tezina_kg "30-300"
    int treninga_nedeljno "0-14"
    int koraka_dnevno
    text cilj "smrsati / odrzavati / bulk"
    numeric ciljna_tezina_kg
    numeric cilj_kcal "formula, menja korisnik"
    numeric cilj_proteini
    numeric cilj_uh
    numeric cilj_masti
    timestamptz azurirano
  }
  PROIZVOD {
    uuid id PK
    text ime
    text brend
    text jedinica "100g ili komad"
    numeric kcal
    numeric proteini
    numeric uh
    numeric masti
    uuid ko_je_uneo FK
    timestamptz kreirano
    uuid izmenio FK "poslednji koji je menjao"
    timestamptz izmenjeno
  }
  UNOS {
    uuid id PK
    uuid korisnik_id FK
    uuid proizvod_id FK "moze null"
    date datum "lokalni datum korisnika"
    text obrok "dorucak / rucak / vecera / uzina"
    numeric kolicina "g ili komada"
    text ime "snapshot"
    numeric kcal "snapshot"
    numeric proteini "snapshot"
    numeric uh "snapshot"
    numeric masti "snapshot"
    timestamptz kreirano
  }
```

## Odluke
- **Korisnici** su Supabase `auth.users` (email, hešovana lozinka); `profil` je 1:1 sa njima.
- **Proizvodi su zajednički** (samo ulogovani korisnici): svi čitaju, dodaju i menjaju; briše samo `ko_je_uneo`. `izmenio`/`izmenjeno` pamte poslednju izmenu.
- **Unosi su privatni**: RLS dozvoljava samo `korisnik_id = auth.uid()`. Isto važi za `profil`.
- **Snapshot**: unos kopira ime i vrednosti (već izračunate za količinu), pa izmena proizvoda ne menja istoriju, a dnevni zbir je prost `SUM`.
- **Datum** šalje app (lokalni datum korisnika), ne server.
- **Datum rođenja umesto godina**: ne čuvamo izvedene podatke koji zastarevaju.
- **Dnevni cilj** se čuva u profilu (popunjava formula Mifflin-St Jeor, korisnik može ručno da promeni). Bez istorije ciljeva u MVP-u.
- **Obrok** je kolona u `unos`, ne zasebna tabela.
- `CHECK` ograničenja u bazi odbijaju besmislene vrednosti.
