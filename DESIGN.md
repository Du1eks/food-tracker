---
name: Mouse's tracker
description: Kalorije i makrosi za ekipu iz teretane, kao neon epruveta u noćnoj laboratoriji.
colors:
  zelena: "#8cff5a"
  zelena-jaca: "#a8ff82"
  zelena-duboka: "#4fd12a"
  na-neonu: "#061206"
  svetlozelena: "#2f6b1a"
  mint: "#1a2a22"
  pozadina: "#0b100e"
  spolja: "#22312b"
  ivica: "#35503f"
  bela: "#121a17"
  ploca-2: "#18221e"
  crna: "#050807"
  tekst: "#e8f3ed"
  sivi: "#6f857b"
  sivi-tekst: "#93a99f"
  greska: "#ff6b6b"
  greska-bg: "#3a1414"
  proteini-boja: "#49c6ff"
  uh-boja: "#ffd84a"
  masti-boja: "#ff8f3f"
typography:
  display:
    fontFamily: "'Bungee', 'Chivo Variable', system-ui, sans-serif"
    fontSize: "clamp(52px, 6vw, 84px)"
    fontWeight: 400
    lineHeight: 0.95
  headline:
    fontFamily: "'Bungee', 'Chivo Variable', system-ui, sans-serif"
    fontSize: "clamp(24px, 2.6vw, 32px)"
    fontWeight: 400
    letterSpacing: "0.01em"
  figure:
    fontFamily: "'Chivo Variable', 'Chivo', system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 800
    lineHeight: 1
    fontFeature: "tnum"
  title:
    fontFamily: "'Chivo Variable', 'Chivo', system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
  body:
    fontFamily: "'Chivo Variable', 'Chivo', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "'Chivo Variable', 'Chivo', system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
  column-head:
    fontFamily: "'Chivo Variable', 'Chivo', system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    letterSpacing: "0.06em"
rounded:
  oznaka: "4px"
  plocica: "8px"
  r: "12px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  gutter: "clamp(16px, 4vw, 32px)"
components:
  button-primary:
    backgroundColor: "{colors.zelena}"
    textColor: "{colors.na-neonu}"
    rounded: "{rounded.r}"
    padding: "0 6px 0 16px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.zelena-jaca}"
  button-secondary:
    backgroundColor: "{colors.bela}"
    textColor: "{colors.tekst}"
    rounded: "{rounded.r}"
    padding: "0 6px 0 16px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.mint}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.tekst}"
    rounded: "{rounded.r}"
    padding: "0 12px"
    height: "48px"
  button-quiet-hover:
    backgroundColor: "{colors.spolja}"
  plocica:
    backgroundColor: "{colors.zelena}"
    textColor: "{colors.na-neonu}"
    rounded: "{rounded.plocica}"
    size: "40px"
  plocica-svetla:
    backgroundColor: "transparent"
    textColor: "{colors.sivi-tekst}"
    rounded: "{rounded.plocica}"
    size: "38px"
  plocica-svetla-hover:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.tekst}"
  plocica-aktivna:
    backgroundColor: "rgb(140 255 90 / 0.1)"
    textColor: "{colors.zelena}"
  input:
    backgroundColor: "#0a0f0d"
    textColor: "{colors.tekst}"
    rounded: "{rounded.r}"
    padding: "0 14px"
    height: "48px"
  segment-active:
    backgroundColor: "{colors.zelena}"
    textColor: "{colors.na-neonu}"
    padding: "10px 8px"
  top-bar:
    backgroundColor: "{colors.crna}"
    textColor: "{colors.tekst}"
    padding: "0 clamp(16px, 4vw, 32px)"
    height: "60px"
  panel:
    backgroundColor: "{colors.bela}"
    rounded: "{rounded.r}"
  panel-glava:
    backgroundColor: "{colors.crna}"
    textColor: "{colors.tekst}"
    typography: "{typography.title}"
    padding: "14px 18px"
  kartica-makroa:
    backgroundColor: "{colors.bela}"
    textColor: "{colors.tekst}"
    typography: "{typography.figure}"
    rounded: "{rounded.r}"
    padding: "18px 20px 20px"
  epruveta:
    height: "96px"
    width: "100%"
  zbir-dana:
    backgroundColor: "{colors.crna}"
    textColor: "{colors.zelena}"
    rounded: "{rounded.r}"
    padding: "16px"
  greska:
    backgroundColor: "{colors.greska-bg}"
    textColor: "{colors.greska}"
    rounded: "{rounded.r}"
    padding: "12px 14px"
  poruka:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.zelena}"
    rounded: "{rounded.r}"
    padding: "12px 14px"
---

# Design System: Mouse's tracker

## Overview

**Creative North Star: "Ludi naučnik"**

Aplikacija je noćna laboratorija: tamni sto sa tankom mrežom, ploče sa staklenom ivicom, a jedina prava svetlost na ekranu je neon tečnost. Dan je epruveta položena preko cele širine koja se puni posle svakog unosa do isprekidane crte CILJ i postane ljubičasta (boja prekipelog napitka) kad je cilj kalorija pogođen. Sve što svetli je živo (tečnost, glavna akcija, stranica na kojoj si, današnji dan); sve ostalo je mirna tama.

Pravac je izabrao korisnik 2026-11-17 iz tri makete (`.impeccable/predlozi/laboratorija-1-tamno.html`) i on zamenjuje prethodni svet "Aerodromska tabla". Brand Commitments u PRODUCT.md još navode staru svetlu paletu (#389600 i svetlozelene tonove): ona je povučena iz interfejsa i preživljava samo kao zelena etiketa (#389600) ispod loga na ekranu prijave, jer je `logo-zeleno.webp` crtan za tu podlogu. Imena tokena su ostala iz stare palete da komponente ne moraju da se menjaju; vrednosti su nove (bela je sada površina ploče, tekst je svetao).

Masko miš ostaje bez kostima (bez naočara i mantila): na početnoj živi u panelu za unos, na stranici Laboratorija stoji pored neon boce, a na ostalim stranicama viri sa ivice ekrana. Svet odbija standard kategorije (bele kartice sa krugom napretka); napredak je tečnost u epruveti i trakama.

**Key Characteristics:**
- Tamni laboratorijski sto (pozadina sa mrežom 32px i slabim zelenim odsjajem odozgo), ploče sa staklenom ivicom.
- Jedan neon akcent (zelena) sa tamnim tekstom na njemu; makroi imaju svoje tečnosti (plava, žuta, narandžasta).
- Bungee za naslove i monumentalne brojke, Chivo za interfejs.
- Sjaj samo na onome što je živo.
- Epruveta preko cele širine kao potpis dana.
- Svaka animacija postoji samo bez prefers-reduced-motion.

## Colors

Tamna zelenkasta skala sa jednim neon akcentom i tri tečnosti makroa; crvena samo za grešku.

### Primary
- **Neon tečnost** (zelena): tečnost u epruveti i boci, glavno dugme, pločice, aktivni segment, broj kcal, ikonica stranice na kojoj si, današnji dan, kvačica pogođenog dana, trake napretka u kalendaru, fokus prsten, kursor, selekcija teksta. Hover je zelena-jaca; zelena-duboka je dno tečnosti u epruveti.
- **Tamno na neonu** (na-neonu): sav tekst i piktogrami na zelenoj površini.

### Secondary (tečnosti makroa)
- **Proteini** (proteini-boja), **ugljeni hidrati** (uh-boja), **masti** (masti-boja): ispuna i sjaj tanke trake ispod kartice makroa i segmenti stubića u grafiku "Tvoj napredak". Nikad tekst ni pozadina površine.

### Neutral
- **Najdublja tama** (crna): pozadina iza aplikacije, gornja traka, glave panela, zbir dana u tabeli, obris sira, zatamnjenje iza kartice jela (75%).
- **Laboratorijski sto** (pozadina): body sa mrežom; prazna staza traka napretka.
- **Ploča** (bela): paneli, tabela dana, kartice makroa, oblačići, forma prijave, polja kalendara. **Druga ploča** (ploca-2): hover reda tabele, razdelnik redova, kartice makroa u kartici jela.
- **Staklena ivica** (ivica): okvir kontrola 1,5px (`--okvir`), traka za skrolovanje, hover polja kalendara.
- **Spoljna** (spolja): tanke ivice ploča (1px), razdelnici u listama, isprekidan okvir budućih dana, donja ivica gornje trake, hover tihog dugmeta.
- **Mint** (mint): hover sekundarnih dugmadi, redova i svetlih pločica; izabrana namirnica, predloženi obrok, mint polje za izmenu procene, poruka o uspehu (sa zelenim tekstom).
- **Svetlozelena** (svetlozelena): hover pločica u listi prijatelja; retko.
- **Svetao tekst** (tekst): sav glavni tekst, crta cilja u epruveti.
- **Siva** (sivi): netekstualno (obris praznog kruga dana, placeholder). **Siva za tekst** (sivi-tekst): oznake polja, sitan sporedni tekst, zaglavlja kolona, tihe pločice (oko 6,8:1 na ploči).
- **Greška** (greska, greska-bg): poruke o grešci, crveni oblačić miša, promašen dan "!", tačka na pločici profila, neispravno polje.

### Named Rules
**The Dark on Neon Rule.** Na zelenoj ide samo na-neonu; svetao tekst na neonu ne prolazi kontrast.

**The Only Light Rule.** Neon je svetlost laboratorije: znači tečnost, glavnu akciju ili aktivno stanje. Nije pozadina panela i nije ukras.

**The Own Liquid Rule.** Svaki makro ima svoju tečnost i ona važi samo za njega (traka, stubić, legenda); kalorije su uvek neon zelena, a pogođen cilj kalorija ljubičast, iste boje kao oštećene kartice makroa.

## Typography

**Display Font:** Bungee (sa Chivo Variable, system-ui)
**Body Font:** Chivo Variable

**Character:** Bungee je laboratorijska etiketa: kockast, glasan, samo za naslove i brojke koje treba videti sa vrata. Chivo nosi sav interfejs u težinama 400 do 900.

### Hierarchy
- **Display** (Bungee 400, clamp 52–84px, 0.95): uneti kcal na početnoj, neon sa sjajem; telefon 52px. Ista uloga šire na prijavi (naslov clamp 52–108px), u kartici jela (kcal clamp 52–76px) i u natpisu "Goal achieved!" (clamp 48–120px, zlatan).
- **Headline** (Bungee 400, clamp 24–32px): naslov strane u redu ispod trake (npr. "Laboratorija"); h1 dana 20px. Bungee nose i ime u gornjoj traci (17px), mesec u nedelji (15px), broj dana (16px), kcal u polju kalendara i zbir dana (22px, kcal 28px).
- **Figure** (Chivo 800, 40px na računaru, 24px tablet, 20px telefon, tabularno): vrednost u kartici makroa; cilj sitno pored (700, sivi-tekst).
- **Title** (Chivo 700, 20px): glava panela; glavno dugme 800/20px, ostala dugmad 700/17px.
- **Body** (Chivo 400, 16px, 1.45): tekst; polja unosa i tabela 17px.
- **Label** (Chivo 600, 14px, sivi-tekst): oznake polja iznad unosa; sporedni red 13px.
- **Column head** (Chivo 700, 13px, 0.06em, verzal, sivi-tekst): zaglavlja kolona tabele, dani u kalendaru i grafiku. Grupa obroka u tabeli je 900/15px verzal u neon zelenoj.

### Named Rules
**The Tabular Rule.** Svaki broj koji se menja ima tabularne cifre (klasa num) i preispiše se pokretom preklopa.

**The Label Font Rule.** Bungee je samo za naslove i brojke; nikad za rečenice, oznake polja ni dugmad.

## Layout

Bočni razmak svuda je clamp(16px, 4vw, 32px) (gornja traka, nedelja, kartica napretka, red naslova, sadržaj). Početna: nedelja, kartica dnevnog napretka preko cele širine, pa mreža od dve kolone (unos minmax(340px, 440px) levo preko dva reda; desno grafik "Tvoj napredak" i polje ranga), tabela dana ispod preko cele širine; razmak 24px, 48px ispod. Prijava centrira formu 440px. Profil, Laboratorija i Namirnice su centrirani sa naslovom strane.

Ritam: 8, 12, 16, 18, 24, 32, 48 px. Unutrašnjost panela 18px, 16px između polja, parovi polja 12px.

Prelomi: od 961px kartica napretka ima broj levo i kartice makroa desno (do 720px), epruvetu ispod. Do 960px sve je jedna kolona i grafik makroa se krije. Do 640px epruveta je 72px, glava miša stoji gore desno u kartici, tabela krije P/UH/M kolone (sitan red ispod imena) i obroci se skupljaju strelicom. Do 520px ime u gornjoj traci se krije.

Kartica napretka nije lepljiva: sa epruvetom je visoka oko 300px.

## Elevation & Depth

Dubinu nosi ton (ploča na stolu, najdublja tama za trake i glave) i tanka staklena ivica; senka je jedna, tiha. Sjaj je zasebna vrsta svetlosti i pripada samo živim elementima.

### Shadow Vocabulary
- **Senka ploče** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.04), 0 20px 40px -24px rgb(0 0 0 / 0.8)`): paneli, tabela, kartice makroa, polja kalendara sa unosom, forma prijave, polje ranga.
- **Neon sjaj** (`box-shadow: 0 4px 24px -6px rgb(140 255 90 / 0.6)`): glavno dugme, "Popuni profil za cilj", etiketa loga na prijavi, poziv u Laboratoriji na hover.
- **Sjaj tečnosti** (`box-shadow: 0 0 40px` boja tečnosti): ispuna epruvete; trake i stubići makroa svetle svojom bojom (0 0 10px).
- **Sjaj broja** (`text-shadow: 0 0 30px rgb(140 255 90 / 0.5)`): neon kcal, naslov prijave, zbir dana, kcal u kartici jela.

### Named Rules
**The Live Glow Rule.** Sjaj dobija samo ono što je živo: tečnost, glavna akcija, aktivna stranica, današnji i pogođen dan, miš i boca. Mirne ploče nikad ne svetle.

## Shapes

Mekano zaobljeno: 12px (r) za ploče, polja, dugmad, oblačiće i poruke; 8px za pločice; 4px za sitne oznake (ikona u redu, broj današnjeg dana, oznake jela); 999px za pilule i trake. Kontrole imaju staklenu ivicu 1,5px (ivica), ploče 1px (spolja). Epruveta je jedini asimetričan oblik: 12px levo, 48px desno (zaobljeno dno), leva ivica 8px kao čep.

### Named Rules
**The Locked Arrow Rule.** U dugmetu je pločica sa strelicom zaključana uz desnu ivicu (padding 0 6px 0 16px, space-between).

## Components

### Buttons
- **Shape:** 12px, ivica 1,5px, min. visina 48px.
- **Primary:** neon, tamni tekst 800/20px, 56px, neon sjaj, pločica obrnuta (tamna sa neon strelicom) uz desnu ivicu; u formama preko cele širine. Hover zelena-jaca.
- **Secondary:** ploča, 700/17px; hover mint.
- **Quiet (tiho):** bez ivice i pozadine, centriran; hover spolja.
- **Disabled:** providnost 0.5.
- **Focus:** obris 2px neon, pomak 2px (globalno).

### Pločice
Neon kvadrat 40px (8px) sa piktogramom ili strelicom (lucide SVG), tamna ikona. Svetla pločica u gornjoj traci je providna sa sivom ikonom; hover mint; stranica na kojoj si dobija neon ikonu sa sjajem na 10% neon podlozi.

### Inputs / Fields
- **Style:** najtamnija površina (#0a0f0d), ivica 1,5px, 12px, 48px, 17px, placeholder sivi, kursor neon.
- **Focus:** bez obrisa; ivica neon i prsten 0 0 0 3px neon 22%.
- **Error:** ivica greska; poruka greska-bg/greska 600.

### Segment
Ivica 1,5px oko celine i pregrade; izabrana opcija neon sa tamnim tekstom; fokus unutrašnji neon prsten 3px.

### Cards / Containers
- **Panel:** ploča, 12px, ivica spolja, senka; glava najdublje tame (Title) sa tankom neon linijom ispod (35%), telo 18px.
- **Tabela dana:** ploča 12px, padding 8px 24px 16px. Zaglavlje Column head sa ivicom; grupe obroka neon verzalom sa zbirom pod kolonama; redovi 17px, hover ploca-2; akcije vidljive na hover/fokus (na dodir uvek). **Zbir dana:** traka najdublje tame, Bungee u neon boji, kcal 28px sa sjajem.
- **Poruka:** mint površina, neon tekst.

### Navigation
- **Gornja traka:** najdublja tama, 60px, donja ivica spolja; levo pločica kuće i ime (Bungee 17px), desno pločice (kalendar, Laboratorija, prijatelji, profil). Crvena tačka 14px sa pulsom (1,6s) na profilu dok nije popunjen.
- **Nedelja (početna):** ‹ › pločice, mesec Bungee, sedam dana: neon krug sa kvačicom i sjajem = pogođen cilj, "!" na greska-bg = promašen, siv obris = prazan, isprekidan i 55% = budući. Danas: ime dana u neon pilulici; izabrani dan: ploča sa neon ivicom i sjajem.
- **Prijava:** logo na zelenoj etiketi #389600 (12px, neon sjaj; 52px, od 961px 72px levo), naslov Display neon sa sjajem, forma 440px; miš pokazuje na formu (`pokazuje.webp` desno od 1100px, `pokazuje_dole.webp` na užem).

### Epruveta (signature)
Kartica "Dnevni napredak" stoji na stolu bez sopstvene ploče: Bungee neon broj uneto kcal i "/ cilj kcal" sitno, ispod epruveta preko cele širine (96px, telefon 72px). Staklo je providno sa svetlom ivicom 2px (rgb(200 255 220 / 0.45)) i odsjajem odozgo; tečnost je vertikalni prelaz (#b8ff95, zelena, zelena-duboka) sa sjajem 40px i belim mehurićima koji stalno idu nagore. Epruveta prima do 115% cilja; isprekidana crta "CILJ broj" stoji na 1/1,15 dužine, procenat ide ispod kraja tečnosti. Kad je cilj kalorija pogođen, tečnost postane ljubičasta (--eksplozija-mrlja, kao oštećene kartice) i na kraju epruvete iskoči sir (700ms) pa se njiše. Ispod ili desno tri kartice makroa (ploča, Figure, tanka traka 8px u boji tečnosti makroa sa sjajem); kartice proteina i masti puknu kao napitak (blesak, krhotine, kapi) i ostanu oštećene: ljubičasto-roze mrlje, gar, napukline, nakrivljene, broj i traka u boji mrlje. Prelazak bilo kog cilja: 3D natpis "Goal achieved!" (Bungee zlato, 10 slojeva po Z osi za debljinu) uleti okrećući se dva puta, ljulja se i odleti nadole, ispod pilula sa imenima ciljeva (3 s); zatim ekran skroluje do polja, zatamni se 72% a polje stoji iznad zastora sa zlatnim sjajem; pa konfete, epruveta udari i bljesne, kartice puknu jedna za drugom. Posle unosa tečnost raste 1,4s (cubic-bezier(0.16, 1, 0.3, 1)) a brojke se preispišu (preklop 520ms: clip-path odozgo, -0.18em, blur 2px). Na telefonu gore desno glava miša u pločici 72px: vodi na polje "Reci mišu šta si jeo"; na hover se pozadina napuni neonom i miš se isplazi.

### Masko miš
Miš je uvek isti, bez kostima (bez naočara, mantila ili majice).
- **Početna (panel "Reci mišu šta si jeo"):** živi Masko miš (140px, `ZiviMis`, @masko/player) levo, oblačić desno (ploča, ivica 1,5px, rep ka mišu, 700/17px; crvena varijanta za grešku). Pri učitavanju iskoči iz tačke na podu (650ms). Uz prefers-reduced-motion stoji statična slika poze (`Maskota`, 92px).
- **Ostale stranice (`MisViri`):** miš viri sa ivice ekrana, odsečen ravno uz ivicu (clamp 84–112px, zeleni sjaj 0.28). Kalendar i spisak prijatelja desno, Namirnice, Profil i profil prijatelja levo. Uđe posle 600ms (700ms) i povremeno nakrivi glavu (5s); prevlači se gore-dole (miš, prst, strelice) i pamti visinu; klik daje rečenicu u oblačiću sa neon ivicom (4 s). Ne pojavljuje se na početnoj ni u Laboratoriji, gde miš već stoji na strani.

### Laboratorija (ruta /kuhinja)
Strana "Laboratorija" (moja jela), iste širine kao Namirnice. Miš (`MisKuvar`) je jedan SVG: slika `hoda.webp` bez kostima i pored nje neon boca (Erlenmajer) sa neon tečnošću, staklenim obrisom, mehurićima (1,6s) i sjajem; dok miš čita, boca se ljulja. Poziv je veliko dugme-ploča (miš 150px, telefon 104px) sa neon ivicom 35% i zelenim odsjajem iza miša; hover neon ivica i neon sjaj, miš mahne. Panel za kuvanje je isti kao "Reci mišu". Posle "Napravi obrok" namirnice kao pilule sa neon prstenom polete u bocu (`data-cilj`) uz varnice, pa iskoči **kartica jela**: zatamnjenje 75%, neon zraci koji se vrte, ploča sa neon ivicom i sjajem, pilula "Jelo je spremno!", ime Bungee neon, kcal Display sa sjajem, makroi na ploca-2, oznake (HIGH PROTEIN, LOW FAT...) kao neon pečati 4px koji lupe. Varnice (#ffe066) su jedina boja van palete ovde.

### Rang i Prijatelji
Polje ranga: ploča sa ivicom i senkom, neon broj mesta 80px/900, a levo stakleni pehar (`components/Pehar`): providna čaša sa drškama na nozi, napunjena napitkom u boji mesta (zlato, srebro, bronza; poslednje mesto ili bez drugara mutan maslinast napitak), površina se talasa, mehurići idu gore, napitak svetli; pehar padne i odskoči sa varnicama u istoj boji. Rang lista: ime u plamenu (`components/ImeUPlamenu`), boje plamena su namerno van palete i važe samo tamo.

### Pokret
Svi pokreti stoje u `@media (prefers-reduced-motion: no-preference)`. Uz reduce: tečnost i procenat odmah stoje na mestu, mehurići i boca miruju, nema skoka miša ni virenja (miš samo stoji uz ivicu), živi miš je zamenjen slikom, natpisi samo izblede, oštećena kartica se samo pojavi, nema leta namirnica ni konfeta.

## Do's and Don'ts

### Do:
- **Do** stavljaj na-neonu na svaku neon površinu.
- **Do** pokazuj napredak tečnošću: epruveta za kalorije, trake i stubići u boji makroa.
- **Do** daj sjaj samo živim elementima (tečnost, glavna akcija, aktivna stranica, današnji dan).
- **Do** koristi Bungee samo za naslove i brojke, Chivo za sve ostalo.
- **Do** daj svakom promenljivom broju tabularne cifre.
- **Do** ostavi Masko miša bez kostima; na stranicama bez sopstvenog miša neka viri sa ivice.
- **Do** stavi svaki pokret pod prefers-reduced-motion: no-preference.

### Don't:
- **Don't** stavljaj svetao tekst na neon zelenu.
- **Don't** koristi neon kao pozadinu ploča ili ukras.
- **Don't** daj sjaj mirnim pločama, karticama ili tekstu.
- **Don't** pravi kartice sa krugom napretka.
- **Don't** vraćaj svetlu paletu sa #389600 u interfejs; ostaje samo etiketa loga na prijavi.
- **Don't** oblači miša (naočare, mantil, majica).
- **Don't** koristi boje makroa za tekst ili površine.
