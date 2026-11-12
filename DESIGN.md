---
name: Mouse's tracker
description: Kalorije i makrosi za ekipu iz teretane, kao aerodromska tabla do izlaza.
colors:
  zelena: "#389600"
  svetlozelena: "#c2dcb8"
  mint: "#dff6ed"
  pozadina: "#e3eee6"
  spolja: "#d5dcd7"
  bela: "#ffffff"
  tekst: "#111311"
  sivi: "#818581"
  sivi-tekst: "#5c605c"
  greska: "#b3261e"
  greska-bg: "#fdeceb"
typography:
  display:
    fontFamily: "'Source Sans 3 Variable', 'Source Sans 3', system-ui, sans-serif"
    fontSize: "clamp(56px, 7vw, 96px)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  figure:
    fontFamily: "'Source Sans 3 Variable', 'Source Sans 3', system-ui, sans-serif"
    fontSize: "clamp(26px, 3vw, 40px)"
    fontWeight: 800
    lineHeight: 1
    fontFeature: "tnum"
  headline:
    fontFamily: "'Source Sans 3 Variable', 'Source Sans 3', system-ui, sans-serif"
    fontSize: "clamp(22px, 2.4vw, 28px)"
    fontWeight: 800
  title:
    fontFamily: "'Source Sans 3 Variable', 'Source Sans 3', system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
  body:
    fontFamily: "'Source Sans 3 Variable', 'Source Sans 3', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "'Source Sans 3 Variable', 'Source Sans 3', system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
  column-head:
    fontFamily: "'Source Sans 3 Variable', 'Source Sans 3', system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    letterSpacing: "0.06em"
rounded:
  plocica: "4px"
  r: "6px"
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
    textColor: "{colors.tekst}"
    rounded: "{rounded.r}"
    padding: "0 6px 0 16px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "#3fa800"
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
    backgroundColor: "{colors.tekst}"
    textColor: "{colors.bela}"
    rounded: "{rounded.plocica}"
    size: "40px"
  plocica-hover:
    backgroundColor: "#2a2e2a"
  plocica-svetla:
    backgroundColor: "{colors.bela}"
    textColor: "{colors.tekst}"
    rounded: "{rounded.plocica}"
    size: "40px"
  plocica-svetla-hover:
    backgroundColor: "{colors.svetlozelena}"
  input:
    backgroundColor: "{colors.bela}"
    textColor: "{colors.tekst}"
    rounded: "{rounded.r}"
    padding: "0 14px"
    height: "48px"
  segment-active:
    backgroundColor: "{colors.tekst}"
    textColor: "{colors.bela}"
    padding: "10px 8px"
  top-bar:
    backgroundColor: "{colors.tekst}"
    textColor: "{colors.bela}"
    padding: "0 clamp(16px, 4vw, 32px)"
    height: "56px"
  traka-ostatka:
    backgroundColor: "{colors.zelena}"
    textColor: "{colors.tekst}"
    typography: "{typography.display}"
    padding: "18px clamp(16px, 4vw, 32px)"
  panel:
    backgroundColor: "{colors.bela}"
    rounded: "{rounded.r}"
  panel-glava:
    backgroundColor: "{colors.tekst}"
    textColor: "{colors.bela}"
    typography: "{typography.title}"
    padding: "14px 18px"
  greska:
    backgroundColor: "{colors.greska-bg}"
    textColor: "{colors.greska}"
    rounded: "{rounded.r}"
    padding: "12px 14px"
  poruka:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.tekst}"
    rounded: "{rounded.r}"
    padding: "12px 14px"
---

# Design System: Mouse's tracker

## Overview

**Creative North Star: "Tabla do izlaza"**

Svaki ekran se čita kao aerodromska signalizacija: jedna zelena traka kaže koliko je ostalo do cilja, crne kvadratne pločice nose strelice i piktograme, a sve ostalo je mirna svetlozelena podloga sa belim panelima. Brojevi su glavni sadržaj i stoje monumentalno, tabularno, težine 900; tekst oko njih je kratak i funkcionalan.

Gustina je radna, ne dekorativna: paneli, tabela i forma stoje jedno do drugog na računaru, a na telefonu se slažu u kolonu ispod lepljive trake. Kontrole imaju crni okvir od 2 px, kao table sa natpisima, a strelica uvek stoji uz ivicu na koju pokazuje.

Svet odbija standard kategorije: bele kartice sa krugom napretka. Napredak je traka (pano, merač, linija na dnu polja kalendara), nikad krug.

**Key Characteristics:**
- Zadata paleta (PRODUCT.md), zelena rezervisana za signal i glavnu akciju.
- Crni tekst na zelenoj, kao na aerodromskim tablama.
- Monumentalne tabularne brojke (Source Sans 3, 800–900).
- Crne i bele kvadratne pločice sa piktogramom (lucide, SVG).
- Kontrole sa 2 px crnim okvirom, blago zaobljene (6px).
- Jedna meka senka za bele površine; bez tvrdih senki.

## Colors

Zadata zelena sa crnim i neutralnim svetlozelenim tonovima; jedan akcent, dve funkcionalne crvene za greške.

### Primary
- **Signalna zelena** (zelena): traka ostatka na glavnom ekranu, zaglavlje ekrana prijave, glavno dugme (Dodaj, Sačuvaj, Prijavi se), broj mesta u rangu, ispuna merača i traka napretka u polju kalendara. Hover glavnog dugmeta je za nijansu svetliji (#3fa800).

### Neutral
- **Crna table** (tekst): sav glavni tekst, okviri kontrola (2px), gornja traka, glava panela, pločice, aktivni segment, oznaka "danas", fokus prsten. Hover crne pločice je #2a2e2a.
- **Bela** (bela): paneli, tabela dana, polja unosa, sekundarna dugmad, svetle pločice na crnoj traci i u redu datuma.
- **Podloga** (pozadina): pozadina aplikacije (body), tanki razdelnici između redova, prazna traka merača, polje "Daje".
- **Spoljna siva** (spolja): pozadina iza aplikacije (:root), razdelnici u listama rezultata, isprekidan okvir budućih dana, hover tihog dugmeta.
- **Svetlozelena** (svetlozelena): hover svetlih pločica na crnim površinama, fokus prsten polja (3px), selekcija teksta.
- **Mint** (mint): hover sekundarnih dugmadi i redova, izabrana namirnica, predloženi obrok, poruka o uspehu, red korisnika u rang listi.
- **Siva iz palete** (sivi): samo traka za skrolovanje; nije za tekst.
- **Tamnija siva za tekst** (sivi-tekst): oznake polja, sitan sporedni tekst, zaglavlja kolona, placeholder. AA prilagođenje: #818581 na beloj ima 3,7:1.
- **Greška** (greska, greska-bg): poruke o grešci i crvena tačka na pločici profila dok profil nije popunjen.

### Named Rules
**The Ink on Green Rule.** Na zelenoj ide crni tekst (tekst), nikad beli: belo na #389600 ne prolazi kontrast za sitan tekst.

**The Signal Rule.** Zelena znači ostatak, napredak ili glavnu akciju. Nije pozadina panela i nije ukras.

**The Darker Grey Rule.** Sav sivi tekst je sivi-tekst; sivi iz palete ostaje za netekstualne elemente.

## Typography

**Display Font:** Source Sans 3 Variable (sa system-ui, sans-serif)
**Body Font:** Source Sans 3 Variable

**Character:** Jedna humanistička sans porodica u celom rasponu težina, od 400 za tekst do 900 za brojke; razliku nosi težina i veličina, ne druga porodica.

### Hierarchy
- **Display** (900, clamp 56–96px, 0.95, -0.03em): ostatak kcal u traci. Ista uloga, šira skala na ekranu prijave (clamp 56–112px, naslov) i na profilu prijatelja (clamp 56–88px). Jedinica (kcal) je 0.3–0.36em, težine 700.
- **Figure** (800, clamp 26–40px, 1): makrosi u traci; zbir u podnožju tabele (900, 24px, kcal 30px); broj mesta u rangu 80px/900 zelen.
- **Headline** (800, clamp 22–28px): datum ili naslov ekrana u redu ispod trake.
- **Title** (700, 20px): glava panela; glavno dugme 800/20px, ostala dugmad 700/17px.
- **Body** (400, 16px, 1.45): tekst; polja unosa 17px.
- **Label** (600, 14px, sivi-tekst): oznake polja iznad unosa; sporedni red 13px/500.
- **Column head** (700, 13px, 0.06em, verzal, sivi-tekst): samo zaglavlja kolona tabele i dana u kalendaru; grupe obroka u tabeli 800/14px verzal crno.

### Named Rules
**The Tabular Rule.** Svaki broj koji se menja ima tabularne cifre (klasa num), da se tabla ne trese pri preispisu.

**The Monumental Figure Rule.** Najvažniji broj na ekranu je najveći i najteži element; oznaka iznad njega je kratka (700, 15–18px) i opisuje broj, nije naslov odeljka.

## Layout

Bočni razmak svuda je clamp(16px, 4vw, 32px), isti za gornju traku, traku ostatka, red datuma i sadržaj. Glavni ekran je mreža od dve kolone: panel unosa minmax(340px, 440px) i tabela 1fr, razmak 24px, 48px ispod. Ekran prijave centrira formu širine 440px. Profil (1100px) i Namirnice (860px) su centrirani zajedno sa naslovom strane.

Ritam razmaka: 8, 12, 16, 18, 24, 32, 48 px. Unutrašnjost panela 18px sa 16px između polja; parovi polja u dve kolone sa 12px.

Prelomi: ispod 960px sve ide u jednu kolonu (forma iznad tabele, polje ranga iznad unosa). Ispod 640px traka ostatka postaje niska (oko 120px, broj 48px, makrosi u drugom redu, strelica 44px), tabela krije kolone P/UH/M i pokazuje ih kao sitan red ispod imena (u zbiru pored kcal stoje i proteini, sa jedinicom sitno ispod broja), kalendar smanjuje polja.

Traka ostatka je lepljiva (sticky, top 0) na svim širinama.

## Elevation & Depth

Hibrid: dubinu najviše nosi ton (bela na svetlozelenoj, crna glava na beloj), a bele površine dobijaju jednu meku ambijentalnu senku. Traka ostatka ima sopstvenu, dužu senku jer lebdi iznad sadržaja dok se skroluje.

### Shadow Vocabulary
- **Senka** (`box-shadow: 0 6px 18px -8px rgb(17 19 17 / 0.28)`): paneli, tabela dana, forma prijave, polje ranga, dani kalendara sa unosom.
- **Senka trake** (`box-shadow: 0 8px 20px -14px rgb(17 19 17 / 0.6)`): samo lepljiva traka ostatka.

### Named Rules
**The Soft Lift Rule.** Postoji jedna senka za površine i jedna za traku. Bez tvrdih pomerenih senki i bez novih nivoa.

## Shapes

Blago zaobljeno: 6px (r) za panele, polja, dugmad, poruke i polja kalendara; 4px za pločice; 999px samo za oznaku "danas" i merače. Kontrole imaju okvir 2px crne boje; razdelnici unutar površina su 1px (pozadina ili spolja); grupe obroka i podnožje tabele dele se okvirom od 2px. Pločica je kvadrat: 40px osnovno, 36px u dugmetu i redu datuma, 38px u gornjoj traci, 72px strelica u traci ostatka.

### Named Rules
**The Locked Arrow Rule.** U dugmetu je pločica sa strelicom zaključana uz desnu ivicu (padding 0 6px 0 16px, space-between), jer strelica pokazuje kuda dugme vodi.

## Components

### Buttons
Taktilna, sa crnim okvirom i pločicom na kraju.
- **Shape:** blago zaobljeno (6px), okvir 2px crn, min. visina 48px.
- **Primary:** zelena, crni tekst 800/20px, visina 56px, crna pločica sa strelicom desno; u formama preko cele širine.
- **Secondary:** bela, 700/17px; hover mint.
- **Quiet (tiho):** bez okvira i pozadine, centriran tekst; hover spoljna siva. Za "Nazad na danas", "Zaboravio si lozinku?", odjavu.
- **Disabled:** providnost 0.5, kursor not-allowed.

### Pločice
Potpis sveta: kvadrat sa piktogramom ili strelicom (lucide, 20–22px, debljina 2.25–2.75).
- **Crna:** crna, bela ikona; hover #2a2e2a ili svetlozelena kad stoji na crnoj glavi panela.
- **Svetla:** bela, crna ikona; na crnoj gornjoj traci i u redu datuma (‹ ›); hover svetlozelena.
- **Ikona u redu tabele:** 36px, bez pozadine, sivi-tekst; hover crna pločica. Na uređajima sa mišem vidljiva tek na hover/fokus reda.

### Inputs / Fields
- **Style:** bela, okvir 2px crn, 6px, visina 48px, 17px; oznaka iznad (Label). Kursor zelen.
- **Focus:** bez obrisa, prsten 0 0 0 3px svetlozelena.
- **Mali unos u tabeli:** 38px visine, 90px širine, desno poravnat.
- **Error:** poruka ispod forme (greska-bg, greska, 600).

### Segment
Izbor jedne opcije (pol, cilj, obrok): okvir 2px, pregrade 2px, izabrana opcija crna sa belim tekstom; fokus unutrašnji prsten 3px svetlozelena.

### Cards / Containers
- **Panel:** bela, 6px, senka, crna glava (Title, pločica 32px levo), telo 18px.
- **Tabela dana:** bela površina 6px sa senkom, padding 8px 24px 16px.
- **Poruka / izabrano:** mint površina, 6px, 12px 14px, bez okvira.

### Navigation
- **Gornja traka:** crna, 56px, tri kolone: ime levo (800/18px), pločica kalendara u sredini, pločice desno (namirnice, prijatelji, profil). Crvena tačka 14px sa pulsom na pločici profila dok profil nije popunjen. Ekran prijave umesto nje ima zeleni gornji deo (var(--zelena)) spojen sa trakom naslova, sa logom `logo-zeleno.png` (52px na sredini, od 961px 72px levo): to je original logo čiji su zeleni delovi posvetljeni na #b0e878 da se vide na #389600. Od 1100px desno od forme stoji `pokazuje.png` (miš pokazuje ulevo na formu); na užem ekranu `pokazuje_dole.png` (280px) leži na vrhu forme i prstom prelazi preko njene ivice.
- **Red datuma:** svetle pločice ‹ ›, naslov (Headline), crna oznaka "danas" (pill, 700/14px).

### Traka ostatka (signature)
Zelena lepljiva traka: oznaka "Ostalo do cilja" / "Preko cilja" / "Uneto", ostatak kcal (Display), makrosi (Figure), crna pločica 72px sa strelicom nadole desno. Posle svakog unosa brojka se preispiše kao tabla: clip-path odozgo nadole, pomeraj -0.18em i blur 2px, 520ms cubic-bezier(0.16, 1, 0.3, 1), samo bez prefers-reduced-motion. Bez cilja desno stoji crno dugme "Popuni profil za cilj".

### Polje kalendara
Bela ćelija 6px, broj dana 800/18px gore levo, kcal (900) dole, zelena traka napretka 6px na dnu. Danas: crni okvir 2px i broj u crnoj pločici. Budući dani: providni, isprekidan okvir spolja.

### Polje ranga
Bela tabla sa okvirom 2px i senkom, zeleni broj mesta 80px/900, pločica sa strelicom desno; maskota se naslanja na levu ivicu i nasumično priča (oblačić iznad miša, isti stil kao u panelu za unos, rep nadole; prvi put posle 2,5 s, pa na 9–16 s, stoji 4,5 s; rečenice iz mesta i procenta, `staKaze` u src/lib/rang.ts). Oblačić je ukras (aria-hidden); opis za čitač ekrana ostaje na polju. Natpis se otkriva na hover/fokus (450ms), na dodir je stalno vidljiv.

### Panel "Reci mišu šta si jeo" (ReciMisu)
Glavni unos. Crna glava panela sa "+" (ručni unos). Miš 92px levo, desno oblačić: bela tabla sa okvirom 2px i repom ka mišu (kvadrat 14px okrenut 45°), 700/17px; greška je crvena varijanta (greska-bg, greska). Oblačić govori iz stanja i brojeva dana ("Još 50 g proteina do cilja."). Poze: `hoda` (čeka/čita), `jede` (posle upisa), `slavi` (cilj pogođen). Polje za tekst je textarea 104px sa istim okvirom kao `.unos`, Enter šalje, Shift+Enter novi red.
Pregled pre upisa: grupe po obroku (segment kontrola), ispod svake grupe redovi: ime 700, sitan red sa oznakom izvora ("iz baze" crna puna pilula, "procena" pilula sa okvirom) i kcal/makrosima, polje količine 76px sa jedinicom, X za izbacivanje. Grupe dele linija 2px. Red sa procenom ima olovku: otvara mint polje sa četiri mala unosa (kcal, P, UH, M) po jedinici; neispravan broj dobija crveni okvir i zaključava "Upiši". Procena se upisuje samo u dnevnik; u tabeli dana pored imena stoji pilula-dugme "+ U bazu" (bela, okvir, na hover crna, uvek vidljiva) koja je šalje u zajedničku bazu, a olovka u tabeli za procenu otvara isto mint polje sa vrednostima po jedinici ispod reda. Grupa bez obroka pita "Koji je ovo obrok?" (800/17px), a "Upiši N" je zaključano dok obrok nije izabran.
Pokret (samo bez prefers-reduced-motion): miš poskoči kad promeni pozu (520ms), njiše se dok čita, oblačić se "otvori" (320ms), redovi pregleda se ispišu jedan za drugim istim preklopom kao brojke u traci (60ms razmak).

### Assets
Jedini rasteri su `public/maskota/*.png` (jede, hoda, slavi, cilj, pokazuje, pokazuje_dole, logo, logo-zeleno, logo-ikona), providni PNG. Poreklo: supplied by the project owner, commit 8a33656, 2026-11-02, generator and licence not recorded (zapisano i u tEXt bloku svake slike). Na glavnom ekranu su dva miša: kod leaderboarda (92px, cilj 110px) i u panelu za unos (92px). Oba "žive" (`zivi`, 7s: dah, nagib, mali poskok) samo bez prefers-reduced-motion; miš kod leaderboarda poskakuje dok priča. Poze `cilj` i `pokazuje` imaju tekst uslikan u oblačić, pa se ne koriste tamo gde miš govori. Favicon je `public/favicon.png` (192×192): `logo-ikona.png` centrirana na providnom kvadratu, koristi se i kao apple-touch-icon.

## Do's and Don'ts

### Do:
- **Do** stavljaj crni tekst (tekst) na zelenu.
- **Do** daj svakom promenljivom broju tabularne cifre i najveću težinu na ekranu (900).
- **Do** koristi pločicu (crnu ili svetlu, 4px) za svaku strelicu i piktogram, i zaključaj strelicu uz ivicu na koju pokazuje.
- **Do** daj kontrolama okvir 2px tekst i radijus 6px.
- **Do** koristi sivi-tekst za sav sitan sivi tekst.
- **Do** pokazuj napredak trakom (zelena ispuna na podlozi).
- **Do** poštuj prefers-reduced-motion za svaku animaciju.

### Don't:
- **Don't** stavljaj beli tekst na zelenu.
- **Don't** koristi zelenu kao pozadinu panela, kartica ili ukrasa; ona je signal.
- **Don't** pravi bele kartice sa krugom napretka.
- **Don't** koristi sivi (#818581) za tekst.
- **Don't** dodaj tvrde pomerene senke ni nove nivoe senki.
- **Don't** dodaj nalepnice u verzalu iznad naslova; verzal sa razmakom je samo za zaglavlja kolona.
- **Don't** uvodi drugi akcent ili drugu porodicu fontova.
