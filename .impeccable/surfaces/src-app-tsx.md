---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Surface: glavni ekran dana (i shell za sve ekrane)

Mode: Operate. Korisnik: drugari iz teretane, telefon posle obroka i računar za pregled. Zadatak: videti koliko je ostalo do cilja i dodati namirnicu za manje od 10 s. Ekrani i stanja: docs/ekrani.md.

## Direction contract

THESIS: Dan kao tabla do izlaza: jedna zelena traka nad ekranom kaže koliko je još ostalo i šta je sledeći korak. Odbija standard kategorije: bele kartice sa krugom napretka.

OWN-WORLD: Zadata paleta. Zelena #389600 je pano signalizacije i rezervisana je za traku ostatka i primarnu akciju. Crna #111311 su umetnute kvadratne pločice sa strelicom ili piktogramom (gornja traka, glava panela, aktivni segment). Podloga #E3EEE6, paneli beli. Humanistički sans (Source Sans 3), monumentalne tabularne brojke težine 900, strelice zaključane uz ivicu koju pokazuju, kontrole sa 2 px crnim okvirom.

STORY: Posetilac na prvi pogled vidi ostatak kcal i makrosa, unese namirnicu (pretraga, količina, obrok, Dodaj), vidi da se traka odmah preispisala, a u tabeli dana ispravi ili obriše unos.

FIRST VIEWPORT: Crna gornja traka 56 px: ime levo, pločica kalendara u sredini, pločica profila desno (crvena tačka dok profil nije popunjen). Ispod zelena traka: "Ostalo do cilja" i 1 915 kcal monumentalno levo, P/UH/M u sredini, crna pločica sa strelicom desno. Red datuma sa ‹ ›. Levo panel 440 px "Sledeće: dodaj namirnicu" sa crnom glavom, forma i zeleno dugme Dodaj na dnu. Desno tabela dana po obrocima. Telefon: traka ostaje lepljiva i kompaktna, forma iznad tabele.

FORM: Aerodromska signalizacija (dealt challenger wayfinding-cartography-signage-terminal-yellow-wayfinding, izabran umesto dodeljenog #6 sa liste). Potpis: lepljiva traka ostatka koja se posle svakog unosa preispiše kao promena table (view transition na brojkama). seed:1c4413b2684e3b18

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
