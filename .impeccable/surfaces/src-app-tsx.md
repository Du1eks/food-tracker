---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Surface: glavni ekran dana (i shell za sve ekrane)

Mode: Operate. Korisnik: drugari iz teretane, telefon posle obroka i računar za pregled. Zadatak: videti koliko je ostalo do cilja i dodati namirnicu za manje od 10 s. Ekrani i stanja: docs/ekrani.md.

## Direction contract

THESIS: Dan kao epruveta u noćnoj laboratoriji: jedina svetlost na ekranu je neon tečnost koja raste do crte cilja. Odbija standard kategorije (bele kartice sa krugom napretka) i prethodni pravac „Aerodromska tabla“.

OWN-WORLD: Tamni laboratorijski sto (#0B100E sa tankom mrežom), ploče #121A17 sa staklenom ivicom, najdublja tama #050807 za gornju traku, glave panela i zbir dana. Neon #8CFF5A sa tamnim tekstom #061206 za glavnu akciju, aktivno stanje i tečnost; makroi imaju svoje tečnosti (P #49C6FF, UH #FFD84A, M #FF8F3F). Bungee za naslove i monumentalne brojke, Chivo za interfejs. Sjaj samo na onome što je živo.

STORY: Posetilac na prvi pogled vidi koliko je kcal uneo (neon broj) i koliko je epruveta puna do crte cilja, unese obrok mišu (Masko), vidi da tečnost poraste, a u tabeli dana ispravi unos.

FIRST VIEWPORT: Crna traka 60 px sa imenom i ikonicama (aktivna svetli neonom). Nedelja sa kvačicama. Kartica napretka: „Dnevni napredak“, neon broj kcal i „/ cilj kcal“ levo, tri kartice makroa desno, ispod epruveta preko cele širine sa crtom CILJ i procentom. Telefon: isto, jedno ispod drugog, glava miša gore desno.

FORM: Ludi naučnik (izabran od tri .html makete u .impeccable/predlozi). Potpis: epruveta sa mehurićima koja se puni posle svakog unosa i postane zlatna kad je cilj pogođen; Masko miš ostaje bez kostima i izviruje sa strane na ostalim stranicama. seed: none (pravac je izabrao korisnik iz maketa)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
