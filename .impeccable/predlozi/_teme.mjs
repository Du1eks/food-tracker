// Tri sveta: tokeni, posude, miš, plamen. Raspored i sadržaj su u _gradi.mjs.
import { posuda, makroi, brojke, pecat, mehurici, PODACI } from './_gradi.mjs'

const MIS = '../../public/maskota/'
const f = (v) => Math.round((v / PODACI.CILJ.kcal) * 1000) / 10

// oblici posuda (d = obris, ch = visina linije cilja u % posude)
const O = {
  epruveta: { vb: '0 0 60 220', d: 'M8 4 H52 V190 A22 22 0 0 1 8 190 Z', ch: 80 },
  erlen: { d: 'M78 6 H122 V72 L188 198 Q194 214 176 214 H24 Q6 214 12 198 L78 72 Z', ch: 66 },
  reagens: { vb: '0 0 120 200', d: 'M42 4 H78 V30 Q112 40 112 76 V186 Q112 196 102 196 H18 Q8 196 8 186 V76 Q8 40 42 30 Z', ch: 72 },
  casa: { d: 'M22 8 H178 V196 Q178 214 160 214 H40 Q22 214 22 196 Z', ch: 78 },
  kotao: { vb: '0 0 240 200', d: 'M14 40 H226 Q236 40 232 52 Q240 150 176 186 Q166 194 150 194 H90 Q74 194 64 186 Q0 150 8 52 Q4 40 14 40 Z', ch: 70 },
  balon: { vb: '0 0 120 160', d: 'M46 4 H74 V52 A52 52 0 1 1 46 52 Z', ch: 62 },
  reaktor: { vb: '0 0 200 240', d: 'M50 6 H150 V40 Q186 52 186 96 V210 Q186 232 164 232 H36 Q14 232 14 210 V96 Q14 52 50 40 Z', ch: 72 },
  kockasta: { vb: '0 0 110 170', d: 'M40 4 H70 V36 L100 60 V160 Q100 166 94 166 H16 Q10 166 10 160 V60 L40 36 Z', ch: 66 },
  visoka: { vb: '0 0 80 200', d: 'M28 4 H52 V40 Q72 56 72 90 V188 Q72 196 64 196 H16 Q8 196 8 188 V90 Q8 56 28 40 Z', ch: 72 },
}
const para = '<div class="para" aria-hidden="true"><span></span><span></span><span></span></div>'
const plamenOblik = 'M9 23c-4.2 0-7-2.6-7-6.2 0-3.4 2.4-5.2 3.8-7.8.5 1.6 1.4 2.7 2.6 3.2-.3-2.6.6-5.4 2.8-7.4.2 3.2 3.8 5.8 3.8 10.6 0 4.4-2.4 7.6-6 7.6Z'
const plamenJezgro = 'M9 22c-2 0-3.3-1.3-3.3-3 0-1.8 1.3-2.8 2.1-4.3.6 1.2 1.6 1.7 2.4 1.9-.1-1.2.3-2.4 1-3.2.6 1.9 1.6 3 1.6 5.2 0 2-1.6 3.4-3.8 3.4Z'
const mantil = (telo, ivica, dzep, extra = '') => `<svg class="mantil" viewBox="0 0 200 130" aria-hidden="true">
  <path d="M8 130 C10 80 40 52 78 44 L100 78 L122 44 C160 52 190 80 192 130 Z" fill="${telo}" stroke="${ivica}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M78 44 L90 104 L100 78 Z M122 44 L110 104 L100 78 Z" fill="${telo}" stroke="${ivica}" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M100 82 V130" stroke="${ivica}" stroke-width="2"/>
  <rect x="128" y="94" width="34" height="26" rx="4" fill="${telo}" stroke="${ivica}" stroke-width="2.5"/>
  ${dzep}${extra}
</svg>`
const glava = (preko, kontekst, telo = '') => {
  const g = `<span class="mis"><img src="${MIS}glava.webp" alt="" width="160" height="160"><svg viewBox="0 0 160 160" aria-hidden="true">${preko}</svg></span>`
  return kontekst === 'lab' ? `<span class="mis-lab">${g}${telo}</span>` : g
}

// ======================================================= 1. LUDI NAUČNIK, TAMNO
const tamno = {
  id: 'tamno', fajl: 'laboratorija-1-tamno.html', naslov: 'Ludi naučnik',
  opis: 'Noćna laboratorija: crni sto, neon zelena tečnost koja svetli kroz staklo i mehurići koji ne staju. Dan je epruveta položena preko celog ekrana i puni se do crte cilja; miš nosi zaštitne naočare koje svetle istom zelenom.',
  kratko: 'Crna laboratorija u kojoj jedina svetlost dolazi iz tečnosti. Dan je neon epruveta preko celog ekrana, brojke svetle, a ime na rang listi bukvalno gori. Najglasniji i najigriviji od tri pravca.',
  opisPocetna: 'Epruveta zamenjuje luk: puni se sleva nadesno do isprekidane crte cilja, mehurići stalno idu. Klikni dugme da dodaš večeru: tečnost doskoči do cilja, kvačica upadne u četvrtak i lupi neon pečat.',
  opisLab: 'Klik na miša otvara unos. Namirnice upadaju u reaktor, tečnost od tamne postaje neon i proključa, a sa strane se otkriva napitak sa makroima i oznakama.',
  opisRang: 'Plavi plamen uz ime za pogođene proteine, narandžasta vatra oko imena za pogođene kalorije. Mera je mala epruveta.',
  fontUrl: 'family=Bungee&family=Chivo:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700',
  paleta: [['Noć', 'pod', '#0B100E'], ['Ploča', 'ploca', '#121A17'], ['Neon', 'akcent', '#8CFF5A'], ['Proteini', 'p', '#49C6FF'], ['UH', 'uh', '#FFD84A'], ['Masti', 'm', '#FF8F3F'], ['Tekst', 'tekst', '#E8F3ED'], ['Sivi tekst', 'sivi', '#93A99F']],
  fontovi: [['Naslovi i brojke', 'Bungee', '3 200 KCAL', 'f-d'], ['Interfejs', 'Chivo', 'Reci mišu šta si jeo', 'f-t'], ['Merne oznake', 'JetBrains Mono', 'CILJ 3 200 · 130–160 g', 'f-m']],
  oblici: 'Ploče 14 px, tanka ivica od stakla, sjaj samo na onome što je „živo“ (tečnost, glavno dugme, aktivan dan). Sve ostalo je tamno i mirno.',
  ikoneOpis: 'Tanka linija 1,75 px, zaobljeni krajevi; aktivna ikonica dobija neon boju, ne pozadinu.',
  animacije: ['Mehurići stalno idu kroz svaku tečnost (brže dok kuva).', 'Punjenje epruvete do cilja posle unosa, brojke se odbrojavaju.', 'Para i proključavanje u reaktoru; pečat „lupi“ kad je cilj pogođen.'],
  indexBoje: '--k-pod:#0b100e',
  znak: () => glava(tamno.naocare(true), 'znak'),
  naocare: (malo) => `<path d="M30 70 Q80 58 130 70" stroke="#1b2320" stroke-width="${malo ? 9 : 7}" fill="none"/><g class="naocare-sjaj"><circle cx="63" cy="72" r="17" fill="rgba(140,255,90,.22)" stroke="#8cff5a" stroke-width="4"/><circle cx="99" cy="72" r="17" fill="rgba(140,255,90,.22)" stroke="#8cff5a" stroke-width="4"/><path d="M80 72 h2" stroke="#8cff5a" stroke-width="4"/><path d="M54 64 q5-4 10-3 M90 64 q5-4 10-3" stroke="rgba(255,255,255,.75)" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`,
  mis: (k) => glava(tamno.naocare(), k, mantil('#e6efe9', '#0b100e', '<path d="M136 94 V80 M146 94 V76 M155 94 V84" stroke-width="4" stroke-linecap="round" stroke="#8cff5a"/><path d="M146 76 v-1" stroke="#49c6ff" stroke-width="4" stroke-linecap="round"/>', '<circle cx="62" cy="96" r="5" fill="#8cff5a"/>')),
  napredak: () => `<section class="panel napredak napredak-cev" aria-label="Dnevni napredak">
    ${brojke()}
    ${makroi(tamno)}
    <div class="cev" style="--fa:${f(PODACI.PRE[0])};--fb:${f(PODACI.POSLE[0])}" role="img" aria-label="Epruveta napunjena do ${Math.round(f(PODACI.PRE[0]))}% cilja">
      <div class="cev-staklo"><div class="cev-tecnost">${mehurici(16)}</div></div>
      <span class="cev-cilj"><span><b>CILJ</b> ${PODACI.br(PODACI.CILJ.kcal)}</span></span>
      <ol class="cev-skala" aria-hidden="true">${[0, 800, 1600, 2400].map((v) => `<li style="--x:${(v / PODACI.CILJ.kcal) * (100 / 1.15)}%">${PODACI.br(v)}</li>`).join('')}</ol>
      ${pecat(tamno)}
    </div>
  </section>`,
  malaPosuda: (k, fa, fb, klasa = '') => posuda(O.epruveta, { fa, fb, boja: k, mehura: 4, klasa }),
  labPosuda: () => `<div class="lab-posuda">${para}${posuda(O.reaktor, { fa: 14, fb: 82, mehura: 14 })}<div class="grejac" aria-hidden="true"><span></span></div></div>`,
  napitakIkona: () => `<span class="napitak-ik">${posuda(O.balon, { fa: 140, boja: 'napitak', mehura: 4 })}</span>`,
  plamenP: () => `<svg viewBox="0 0 18 24" aria-hidden="true"><path d="${plamenOblik}" fill="#1f8fff"/><path d="${plamenJezgro}" fill="#bfeaff"/></svg>`,
  plamenK: () => `<svg viewBox="0 0 18 24" aria-hidden="true"><path d="${plamenOblik}" fill="#ff6a1a"/><path d="${plamenJezgro}" fill="#ffd36b"/></svg>`,
  css: `
.tema-tamno{--strana:#070a09;--strana-tekst:#e8f3ed;--strana-sivi:#8da397;--strana-ploca:#0f1513;--strana-linija:#1f2b27;--strana-pod-ikone:#16201c;--telefon-ram:#1c2220;
--pod:#0b100e;--ploca:#121a17;--ploca-2:#18221e;--linija:#22312b;--linija-tabela:#1c2824;--tekst:#e8f3ed;--sivi:#93a99f;--hover:#1d2a25;
--traka:#070b0a;--traka-tekst:#e8f3ed;--traka-sivi:#93a99f;--traka-hover:#15201c;--nav-aktivno:rgba(140,255,90,.1);--nav-aktivno-tekst:#8cff5a;
--akcent:#8cff5a;--akcent-hover:#a8ff82;--akcent-tekst:#061206;--fokus:#8cff5a;--fokus-meko:rgba(140,255,90,.25);
--r:14px;--r-dugme:10px;--r-polje:10px;--r-oznaka:6px;--okvir:1px solid #22312b;--senka:inset 0 1px 0 rgba(255,255,255,.04),0 20px 40px -24px rgba(0,0,0,.8);--senka-jaka:0 0 0 1px rgba(140,255,90,.35),0 24px 60px -20px rgba(140,255,90,.35);
--dugme-okvir:0;--dugme-senka:0 4px 24px -6px rgba(140,255,90,.6);--polje:#0a0f0d;--polje-okvir:1px solid #2a3b35;
--p:#49c6ff;--uh:#ffd84a;--m:#ff8f3f;--kcal:#8cff5a;--p-meko:rgba(73,198,255,.14);--p-tekst:#8fdcff;--m-meko:rgba(255,143,63,.15);--m-tekst:#ffb27f;--kcal-meko:rgba(140,255,90,.14);--kcal-tekst:#a9ff85;
--ok:#8cff5a;--dan:#141d1a;--dan-danas:#17241e;
--staklo-unutra:rgba(255,255,255,.035);--staklo-ivica:rgba(200,255,220,.5);--staklo-debljina:2;--cilj-boja:#e8f3ed;--povrsina:rgba(255,255,255,.55);--mehur:rgba(230,255,220,.75);
--voda:#1d4f33;--napitak:#8cff5a;--napitak-pod:#0f1714;--para:rgba(170,255,140,.4);--sastojak:#e8f3ed;--sastojak-tekst:#0b100e;--oblacic:#1d2a25;--oblacic-tekst:#e8f3ed;
--grupa-tekst:#8cff5a;--grupa-linija:#2a3b35;--gori-p-tekst:#dff6ff;--gori-p-sjaj:0 0 6px #49c6ff,0 0 14px #1f8fff,0 -2px 22px rgba(73,198,255,.6);--vatra-1:#ffd36b;--vatra-2:#ff5a00;
--font-d:'Bungee',system-ui,sans-serif;--font-t:'Chivo',system-ui,sans-serif;--font-m:'JetBrains Mono',ui-monospace,monospace;--font-broj:'Bungee',system-ui,sans-serif;--potez:1.75}
.tema-tamno .f-d{font-family:var(--font-d)}.tema-tamno .f-t{font-family:var(--font-t);font-weight:700}.tema-tamno .f-m{font-family:var(--font-m);font-size:18px!important}
.tema-tamno .ekran{background:radial-gradient(900px 420px at 15% -8%,rgba(140,255,90,.09),transparent 70%),linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px) 0 0/32px 32px,linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px) 0 0/32px 32px,var(--pod)}
.tema-tamno .maketa-glava h1{color:#8cff5a;text-shadow:0 0 28px rgba(140,255,90,.45)}
.tema-tamno .panel-naslov{font-family:var(--font-t);font-weight:800;font-size:15px;letter-spacing:.08em;text-transform:uppercase;color:var(--sivi)}
.tema-tamno .np-naslov{font-family:var(--font-t);letter-spacing:.08em;text-transform:uppercase;font-size:13px}
.tema-tamno .veliki{color:#8cff5a;text-shadow:0 0 30px rgba(140,255,90,.5)}
.tema-tamno .traka-ime{font-size:16px;letter-spacing:.02em}
.tema-tamno .traka nav a[aria-current] .ik{filter:drop-shadow(0 0 6px rgba(140,255,90,.8))}
.tema-tamno .dan.ok .dan-znak .ik{filter:drop-shadow(0 0 5px rgba(140,255,90,.9))}
.tema-tamno .naocare-sjaj{filter:drop-shadow(0 0 6px rgba(140,255,90,.85))}
.tema-tamno .posuda-unutra .tecnost{box-shadow:0 0 18px rgba(140,255,90,.35)}
.tema-tamno .makro{border:1px solid var(--linija)}
.tema-tamno .makro .tecnost{filter:drop-shadow(0 0 6px var(--boja))}
/* epruveta preko celog ekrana */
.napredak-cev{display:grid;grid-template-columns:auto 1fr;gap:20px 40px;align-items:end;padding:24px 28px 40px}
.napredak-cev .makroi{justify-self:end;width:min(640px,100%)}
.cev{grid-column:1/-1;position:relative;height:112px;margin-top:20px;--f:var(--fa)}
.posle .cev{--f:var(--fb)}
.cev-staklo{position:absolute;inset:0;border-radius:14px 56px 56px 14px;border:2px solid rgba(200,255,220,.45);border-left-width:8px;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.01) 40%,rgba(255,255,255,.04));overflow:hidden;box-shadow:inset 0 10px 18px -12px rgba(255,255,255,.35)}
.cev-tecnost{position:absolute;left:0;top:0;bottom:0;width:calc(min(var(--f),112) / 1.15 * 1%);background:linear-gradient(180deg,#b8ff95,#8cff5a 35%,#4fd12a);box-shadow:0 0 40px rgba(140,255,90,.7),inset -6px 0 12px rgba(255,255,255,.35);transition:width 1.8s cubic-bezier(.16,1,.3,1);overflow:hidden;border-radius:0 6px 6px 0}
.cev-tecnost i{position:absolute;bottom:-10px;left:var(--x);width:var(--s);height:var(--s);border-radius:50%;background:rgba(240,255,235,.85);animation:mehur var(--d) linear var(--k) infinite}
.cev-cilj{position:absolute;left:calc(100% / 1.15);top:-30px;bottom:-8px;border-left:2px dashed #e8f3ed;padding-left:8px;font-family:var(--font-m);font-size:13px;color:var(--tekst);white-space:nowrap}
.cev-cilj b{color:#8cff5a}
.cev-skala{position:absolute;left:0;right:0;bottom:-26px;margin:0;padding:0;list-style:none;font-family:var(--font-m);font-size:12px;color:var(--sivi)}
.cev-skala li{position:absolute;left:var(--x);transform:translateX(-50%)}
.cev-skala li:first-child{transform:none;left:10px}
.cev .pecat{right:-6px;top:50%;margin-top:-66px}
.tema-tamno .pecat-krug{fill:rgba(11,16,14,.85);stroke:#8cff5a;stroke-width:3}
.tema-tamno .pecat-unutra{fill:none;stroke:rgba(140,255,90,.5);stroke-width:1.5;stroke-dasharray:3 4}
.tema-tamno .pecat-tekst{fill:#8cff5a}
.tema-tamno .pecat{filter:drop-shadow(0 0 14px rgba(140,255,90,.6))}
/* laboratorija */
.tema-tamno .lab-scena{background:radial-gradient(420px 300px at 50% 75%,rgba(140,255,90,.12),transparent 70%),var(--ploca)}
.tema-tamno .kuva .lab-scena{background:radial-gradient(460px 340px at 50% 75%,rgba(140,255,90,.28),transparent 70%),var(--ploca)}
.tema-tamno .lab-sto .posuda{filter:drop-shadow(0 0 22px rgba(140,255,90,.35))}
.grejac{height:22px;margin:8px auto 0;width:70%;border-radius:6px;background:#1b2622;border:1px solid #2a3b35;display:grid;place-items:center}
.grejac span{width:80%;height:4px;border-radius:4px;background:#ff6a1a;box-shadow:0 0 12px #ff6a1a;opacity:.25;transition:opacity .6s}
.kuva .grejac span{opacity:1;animation:puls 1s ease-in-out infinite}
.tema-tamno .napitak{border-color:rgba(140,255,90,.4)}
.tema-tamno .napitak h2{color:#8cff5a;font-size:20px}
.tema-tamno .napitak-ik .tecnost{box-shadow:0 0 14px #8cff5a}
/* rang */
.tema-tamno .rang-merac{height:16px;border-radius:4px 10px 10px 4px;border:1.5px solid rgba(200,255,220,.4);border-left-width:4px;overflow:hidden}
.tema-tamno .merac-tecnost{display:block;height:100%;width:calc(var(--f) * 1%);background:linear-gradient(180deg,#b8ff95,#8cff5a 40%,#4fd12a);box-shadow:0 0 14px rgba(140,255,90,.7)}
.tema-tamno .ime{font-family:var(--font-t);font-weight:800}
.tema-tamno .gori-k .ime-tekst{color:#fff4e0;text-shadow:0 0 8px rgba(255,140,40,.9)}
.tema-tamno .plamencic svg,.tema-tamno .leg svg{filter:drop-shadow(0 0 5px currentColor)}
.tema-tamno .leg-p{color:#49c6ff}.tema-tamno .leg-k{color:#ff7a1a}.tema-tamno .plamencic{color:#49c6ff}
@container ekran (max-width:640px){
  .napredak-cev{grid-template-columns:1fr;padding:18px 16px 34px;gap:12px}
  .napredak-cev .makroi{justify-self:stretch;width:auto;order:3}
  .cev{order:2;height:80px;margin-top:24px}
  .cev .pecat{margin-top:-52px;right:-10px}
  .tema-tamno .veliki{font-size:50px}
  .cev-skala{display:none}
  .cev-cilj span{position:absolute;right:8px;top:0}
}
`,
}

// ======================================================= 2. SVETLA ČISTA LABORATORIJA
const svetlo = {
  id: 'svetlo', fajl: 'laboratorija-2-svetlo.html', naslov: 'Čista laboratorija',
  opis: 'Bela laboratorija pod dnevnim svetlom: staklo, tanke merne crte i pastelne tečnosti u bocama sa urednim etiketama. Dan je Erlenmajerova boca sa podelom; brojke stoje na etiketi kao na uzorku. Najbliži sadašnjoj zelenoj paleti.',
  kratko: 'Belo, staklo i pastelne tečnosti sa urednim etiketama. Dan je Erlenmajerova boca sa mernim crtama, brojke su na etiketi uzorka. Najmirniji i najčitljiviji pravac, zadržava sadašnju zelenu.',
  opisPocetna: 'Boca se puni do isprekidane crte cilja, makroi su tri boce reagensa sa etiketama. Dodaj večeru: tečnost se podigne, kvačica upadne i zeleni pečat „odobreno“ legne na etiketu.',
  opisLab: 'Miš u belom mantilu i okruglim naočarima. Namirnice padaju u čašu na grejnoj ploči, voda postaje pastel zelena, pa se pojavi napitak sa etiketom i oznakama.',
  opisRang: 'Plavi Bunzenov plamen uz ime za proteine, meka narandžasta vatra oko imena za kalorije. Mera je graduisana menzura.',
  fontUrl: 'family=Archivo:wdth,wght@62..125,100..900&family=Martian+Mono:wght@400;600',
  paleta: [['Pozadina', 'pod', '#F3F7F5'], ['Staklo', 'ploca', '#FFFFFF'], ['Zelena', 'akcent', '#389600'], ['Mint', 'dan-danas', '#DFF6ED'], ['Proteini', 'p', '#8CCBEE'], ['UH', 'uh', '#F4D27A'], ['Masti', 'm', '#F3AE92'], ['Tekst', 'tekst', '#14201D']],
  fontovi: [['Naslovi i brojke', 'Archivo Expanded', '3 200 kcal', 'f-d'], ['Interfejs', 'Archivo', 'Reci mišu šta si jeo', 'f-t'], ['Etikete', 'Martian Mono', 'UZORAK 19.11. · P 130–160 g', 'f-m']],
  oblici: 'Veliki radijusi kao staklo (18 px), dugmad kao tablete, oznake kao nalepnice sa oštrim uglom. Tanke 1 px ivice umesto senki; senka samo ispod onoga što „stoji“ na stolu.',
  ikoneOpis: 'Tanka linija 1,5 px, laboratorijski precizno; aktivna stavka dobija mint podlogu.',
  animacije: ['Tečnost se puni do crte cilja uz meniskus koji se ljulja.', 'Mehurići se lagano dižu kroz boce; u čaši brže dok greje.', 'Pečat „odobreno“ i kvačica u nedelji kad je cilj pogođen.'],
  indexBoje: '--k-pod:#f3f7f5',
  znak: () => glava(svetlo.naocare(), 'znak'),
  naocare: () => `<g fill="rgba(255,255,255,.15)" stroke="#14201d" stroke-width="2.6"><circle cx="63" cy="72" r="14"/><circle cx="99" cy="72" r="14"/></g><path d="M77 70 q4-4 8 0 M49 70 l-12 -4 M113 70 l12 -4" stroke="#14201d" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
  mis: (k) => glava(svetlo.naocare(), k, mantil('#ffffff', '#9fb7af', '<path d="M138 94 V80 M148 94 V77" stroke-width="4" stroke-linecap="round" stroke="#389600"/>', '<rect x="40" y="88" width="40" height="18" rx="3" fill="#dff6ed" stroke="#9fb7af" stroke-width="2"/><text x="60" y="101" text-anchor="middle" font-family="Martian Mono,monospace" font-size="9" fill="#14201d">dr MIŠ</text>')),
  napredak: () => `<section class="panel napredak napredak-boca" aria-label="Dnevni napredak">
    <div class="boca-zona">
      ${posuda(O.erlen, { fa: f(PODACI.PRE[0]), fb: f(PODACI.POSLE[0]), klasa: 'velika', mehura: 7 })}
      <ol class="boca-skala" aria-hidden="true">${[3200, 2400, 1600, 800].map((v) => `<li style="--y:${(v / PODACI.CILJ.kcal) * O.erlen.ch}%">${PODACI.br(v)}</li>`).join('')}</ol>
    </div>
    <div class="etiketa">
      ${brojke()}
      ${makroi(svetlo)}
      <p class="et-dno"><span class="barkod" aria-hidden="true"></span><span>Uzorak · čet 19.11.2026 · cilj ${PODACI.br(PODACI.CILJ.kcal)} kcal</span></p>
    </div>
    ${pecat(svetlo)}
  </section>`,
  malaPosuda: (k, fa, fb, klasa = '') => `<span class="reagens ${klasa}">${posuda(O.reagens, { fa, fb, boja: k, mehura: 3 })}<span class="reagens-et">${{ p: 'P', uh: 'UH', m: 'M' }[k]}</span></span>`,
  labPosuda: () => `<div class="lab-posuda">${para}${posuda(O.casa, { fa: 14, fb: 80, mehura: 10 })}<ol class="casa-crte" aria-hidden="true"><li>400</li><li>300</li><li>200</li><li>100</li></ol><div class="ploca-grejna" aria-hidden="true"><span></span></div></div>`,
  napitakIkona: () => `<span class="napitak-ik">${posuda(O.reagens, { fa: 140, boja: 'napitak', mehura: 3 })}</span>`,
  plamenP: () => `<svg viewBox="0 0 18 24" aria-hidden="true"><path d="M9 2 C12 8 15 12 15 16.5 A6 6 0 0 1 3 16.5 C3 12 6 8 9 2Z" fill="#cfe9fb" stroke="#3d9be0" stroke-width="1.4"/><path d="M9 9 C10.6 12 12 14 12 16.6 A3 3 0 0 1 6 16.6 C6 14 7.4 12 9 9Z" fill="#3d9be0"/></svg>`,
  plamenK: () => `<svg viewBox="0 0 18 24" aria-hidden="true"><path d="${plamenOblik}" fill="#ffd2ad" stroke="#ff8a3d" stroke-width="1.2"/><path d="${plamenJezgro}" fill="#ff8a3d"/></svg>`,
  css: `
.tema-svetlo{--strana:#e9efec;--strana-tekst:#14201d;--strana-sivi:#55655f;--strana-ploca:#ffffff;--strana-linija:#d3ddd9;--strana-pod-ikone:#eef5f2;--telefon-ram:#d9e1de;
--pod:#f3f7f5;--ploca:#ffffff;--ploca-2:#f1f7f4;--linija:#dbe5e1;--linija-tabela:#e6eeea;--tekst:#14201d;--sivi:#56675f;--hover:#eef6f2;
--traka:#ffffff;--traka-tekst:#14201d;--traka-sivi:#56675f;--traka-hover:#eef6f2;--nav-aktivno:#dff6ed;--nav-aktivno-tekst:#1f5a00;
--akcent:#389600;--akcent-hover:#2f8200;--akcent-tekst:#0b1608;--fokus:#389600;--fokus-meko:rgba(56,150,0,.18);
--r:18px;--r-dugme:999px;--r-polje:12px;--r-oznaka:3px;--okvir:1px solid #dbe5e1;--senka:0 1px 2px rgba(20,32,29,.04),0 12px 32px -20px rgba(20,32,29,.2);--senka-jaka:0 24px 60px -24px rgba(20,32,29,.32);
--dugme-okvir:0;--dugme-senka:none;--polje:#fbfdfc;--polje-okvir:1px solid #c8d6d0;
--p:#8ccbee;--uh:#f4d27a;--m:#f3ae92;--kcal:#a3d985;--p-meko:#e3f3fc;--p-tekst:#1b5a80;--m-meko:#fde9e1;--m-tekst:#86391b;--kcal-meko:#e4f3db;--kcal-tekst:#2a6600;
--ok:#389600;--dan:#f1f7f4;--dan-danas:#dff6ed;
--staklo-unutra:rgba(223,246,237,.35);--staklo-ivica:#93ada4;--staklo-debljina:2;--cilj-boja:#389600;--povrsina:rgba(255,255,255,.9);--mehur:rgba(255,255,255,.95);
--voda:#cde8f3;--napitak:#a3d985;--napitak-pod:#ffffff;--para:rgba(170,195,188,.55);--sastojak:#ffffff;--sastojak-tekst:#14201d;--oblacic:#dff6ed;--oblacic-tekst:#14201d;
--grupa-tekst:#14201d;--grupa-linija:#c8d6d0;--gori-p-tekst:#16507a;--gori-p-sjaj:0 0 10px rgba(140,203,238,.95),0 -2px 16px rgba(61,155,224,.45);--vatra-1:#ffe2b8;--vatra-2:#ff9a5c;
--font-d:'Archivo',system-ui,sans-serif;--font-t:'Archivo',system-ui,sans-serif;--font-m:'Martian Mono',ui-monospace,monospace;--font-broj:'Archivo',system-ui,sans-serif;--potez:1.5}
.tema-svetlo .f-d{font-family:var(--font-d);font-stretch:120%;font-weight:800}.tema-svetlo .f-t{font-weight:500}.tema-svetlo .f-m{font-family:var(--font-m);font-size:16px!important}
.tema-svetlo .maketa-glava h1,.tema-svetlo .red-glava h2,.tema-svetlo .sis-blok h3,.tema-svetlo .panel-naslov,.tema-svetlo .lab-uvod h1,.tema-svetlo .rang-uvod h1,.tema-svetlo .napitak h2,.tema-svetlo .datum b,.tema-svetlo .traka-ime{font-stretch:118%;font-weight:800;letter-spacing:-.01em}
.tema-svetlo .veliki,.tema-svetlo .makro-br b,.tema-svetlo .napitak-makroi dd,.tema-svetlo .proc,.tema-svetlo .dan-br,.tema-svetlo .mesto{font-stretch:125%;font-weight:800}
.tema-svetlo .ekran{background:linear-gradient(rgba(20,32,29,.035) 1px,transparent 1px) 0 0/48px 48px,linear-gradient(90deg,rgba(20,32,29,.035) 1px,transparent 1px) 0 0/48px 48px,var(--pod)}
.tema-svetlo .panel{background:rgba(255,255,255,.86);backdrop-filter:blur(6px)}
.tema-svetlo .dugme-drugo{background:#fff;box-shadow:inset 0 0 0 1px #c8d6d0}
.tema-svetlo .oznaka{border:1px solid currentColor}
.tema-svetlo .sastojci li{border:1px solid #c8d6d0}
.tema-svetlo .oblacic{border:1px solid #bfe3d3}
.tema-svetlo .tecnost::before{height:10px;border-radius:50%/0 0 100% 100%;top:-1px;animation:meniskus 3s ease-in-out infinite alternate}
@keyframes meniskus{to{transform:scaleY(.55) translateY(2px)}}
/* boca i etiketa */
.napredak-boca{display:grid;grid-template-columns:300px 1fr;gap:36px;align-items:center;padding:28px 32px}
.boca-zona{position:relative;padding-right:56px}
.boca-skala{position:absolute;right:0;top:0;bottom:0;margin:0;padding:0;list-style:none;font-family:var(--font-m);font-size:11px;color:var(--sivi);width:52px}
.boca-skala li{position:absolute;bottom:var(--y);left:0;transform:translateY(50%);padding-left:12px}
.boca-skala li::before{content:"";position:absolute;left:0;top:50%;width:8px;border-top:1px solid #93ada4}
.boca-skala li:first-child{color:#2a6600;font-weight:600}
.etiketa{position:relative;display:grid;gap:18px;padding:24px 24px 16px;border:1.5px solid #14201d;border-radius:6px;background:#fff}
.et-dno{display:flex;align-items:center;gap:14px;padding-top:12px;border-top:1px solid #14201d;font-family:var(--font-m);font-size:11px;color:var(--sivi)}
.barkod{width:96px;height:22px;flex:none;background:repeating-linear-gradient(90deg,#14201d 0 2px,transparent 2px 4px,#14201d 4px 5px,transparent 5px 8px,#14201d 8px 11px,transparent 11px 12px)}
.tema-svetlo .makro{background:#f6faf8;border:1px solid var(--linija);border-radius:12px}
.reagens{position:relative;display:block;width:46px;flex:none}
.reagens .posuda{width:100%}
.reagens-et{position:absolute;left:12%;right:12%;top:52%;padding:2px 0;background:#fff;border:1px solid #14201d;font-family:var(--font-m);font-size:9px;font-weight:600;text-align:center;line-height:1.2}
.napredak-boca .pecat{right:22px;top:14px}
.tema-svetlo .pecat-krug{fill:rgba(255,255,255,.9);stroke:#2f7d00;stroke-width:3}
.tema-svetlo .pecat-unutra{fill:none;stroke:#2f7d00;stroke-width:1.2}
.tema-svetlo .pecat-tekst{fill:#2f7d00}
.tema-svetlo .pecat{mix-blend-mode:multiply}
/* laboratorija */
.tema-svetlo .lab-scena{background:linear-gradient(180deg,#ffffff 0 72%,#eef4f1 72%)}
.casa-crte{position:absolute;left:14%;top:calc(8% + 90px);margin:0;padding:0;list-style:none;font-family:var(--font-m);font-size:10px;color:#56675f;display:grid;gap:16px}
.casa-crte li{border-top:1px solid #93ada4;width:26px;padding-top:2px}
.ploca-grejna{height:26px;margin-top:6px;border-radius:8px;background:#e7eeeb;border:1px solid #c8d6d0;display:grid;place-items:center}
.ploca-grejna span{width:12px;height:12px;border-radius:50%;background:#c8d6d0;transition:background .6s,box-shadow .6s}
.kuva .ploca-grejna span{background:#ff8a3d;box-shadow:0 0 10px #ff8a3d}
.tema-svetlo .napitak{border:1.5px solid #14201d;border-radius:8px}
.tema-svetlo .napitak-ik .reagens-et{display:none}
/* rang */
.tema-svetlo .rang-merac{height:18px;border:1.5px solid #93ada4;border-radius:3px 9px 9px 3px;overflow:hidden;background:repeating-linear-gradient(90deg,transparent 0 calc(10% - 1px),rgba(20,32,29,.25) calc(10% - 1px) 10%)}
.tema-svetlo .merac-tecnost{display:block;height:100%;width:calc(var(--f) * 1%);background:#a3d985;border-right:2px solid #6fb34a}
.tema-svetlo .ime{font-weight:700;font-stretch:112%}
.tema-svetlo .vatra i{filter:blur(4px);opacity:.85}
@container ekran (max-width:640px){
  .napredak-boca{grid-template-columns:1fr;gap:18px;padding:18px 14px}
  .boca-zona{width:200px;justify-self:center;padding-right:48px}
  .etiketa{padding:16px 12px 12px;gap:14px}
  .reagens{width:34px}
  .reagens-et{font-size:7px}
  .napredak-boca .pecat{right:8px;top:8px}
  .lab-scena{background:#fff}
  .casa-crte{display:none}
}
`,
}

// ======================================================= 3. CRTANA ALHEMIJA
const alhemija = {
  id: 'alhemija', fajl: 'laboratorija-3-alhemija.html', naslov: 'Crtana alhemija',
  opis: 'Toplo drvo, bakar i šareni napici u crtanom fazonu sa debelom tamnom konturom. Dan je bakarni kotao nad vatrom koji ključa i puni se do crte; makroi su tri bočice na polici, a miš alhemičar nosi šešir i bakarne naočare.',
  kratko: 'Drvo, bakar i šareni napici sa debelim crtanim konturama. Dan je kotao koji ključa nad vatrom, makroi su bočice na polici, miš je alhemičar sa šeširom. Najtopliji i najviše kao igra.',
  opisPocetna: 'Kotao se puni do crte cilja, para se diže, vatra pucketa. Dodaj večeru: napitak se podigne, kvačica upadne i utisne se crveni voštani pečat.',
  opisLab: 'Miš alhemičar u ljubičastoj odori. Namirnice upadaju u kotao, voda postaje ljubičasti napitak koji ključa, pa se otkriva bočica sa imenom jela i oznakama.',
  opisRang: 'Plavi alhemijski plamen uz ime za proteine, narandžasta vatra oko imena za kalorije. Mera je bakarna cev puna napitka.',
  fontUrl: 'family=Grandstander:wght@600;800;900&family=Baloo+2:wght@400;600;700;800',
  paleta: [['Orah', 'traka', '#3A2110'], ['Med drvo', 'ploca', '#E0A868'], ['Bakar', 'akcent', '#C8743A'], ['Proteini', 'p', '#3FA9F5'], ['UH', 'uh', '#FFC23D'], ['Masti', 'm', '#E0457B'], ['Napitak', 'napitak', '#9B5CF0'], ['Mastilo', 'tekst', '#2A1608']],
  fontovi: [['Naslovi i brojke', 'Grandstander', '3 200 kcal', 'f-d'], ['Interfejs', 'Baloo 2', 'Reci mišu šta si jeo', 'f-t'], ['Oznake', 'Grandstander', 'HIGH PROTEIN', 'f-m']],
  oblici: 'Sve ima debelu tamnu konturu od 3 px kao crtani film i meku senku koja „podiže“ predmet sa stola. Ploče su od svetlog drveta, kontrole bakarne, oznake okrugle kao etikete na tegli.',
  ikoneOpis: 'Debela linija 2,5 px sa zaobljenim krajevima, kao nacrtano flomasterom.',
  animacije: ['Kotao ključa: mehurići, para i vatra koja pucketa ispod.', 'Napitak se diže do crte cilja posle unosa; bočice na polici prate makroe.', 'Voštani pečat se utisne kad je cilj pogođen; ime na rang listi gori.'],
  indexBoje: '--k-pod:#5a3720',
  znak: () => glava(alhemija.sesir(), 'znak'),
  sesir: () => `<path d="M48 34 Q80 24 112 34 L94 -18 Q90 -26 84 -20 Z" fill="#6b3fa0" stroke="#2a1608" stroke-width="3" stroke-linejoin="round"/><path d="M52 31 Q80 22 108 31 L106 38 Q80 30 54 38 Z" fill="#c8743a" stroke="#2a1608" stroke-width="2.5"/><ellipse cx="80" cy="36" rx="40" ry="8" fill="#6b3fa0" stroke="#2a1608" stroke-width="3"/><circle cx="78" cy="6" r="3" fill="#ffc23d"/><circle cx="89" cy="-6" r="2" fill="#ffc23d"/><circle cx="71" cy="20" r="2" fill="#ffc23d"/><g fill="rgba(255,255,255,.12)" stroke="#c8743a" stroke-width="3"><circle cx="63" cy="72" r="13"/><circle cx="99" cy="72" r="13"/></g><path d="M76 70 q5-4 10 0" stroke="#c8743a" stroke-width="3" fill="none"/>`,
  mis: (k) => glava(alhemija.sesir(), k, mantil('#6b3fa0', '#2a1608', '<circle cx="145" cy="107" r="5" fill="#ffc23d" stroke="#2a1608" stroke-width="2"/>', '<circle cx="100" cy="96" r="4" fill="#c8743a" stroke="#2a1608" stroke-width="2"/><circle cx="100" cy="114" r="4" fill="#c8743a" stroke="#2a1608" stroke-width="2"/>')),
  napredak: () => `<section class="panel napredak napredak-kotao" aria-label="Dnevni napredak">
    <div class="kotao-zona">
      ${para}
      ${posuda(O.kotao, { fa: f(PODACI.PRE[0]), fb: f(PODACI.POSLE[0]), klasa: 'kotao', mehura: 12 })}
      <div class="ognjiste" aria-hidden="true"><span class="vatra">${'<i></i>'.repeat(7)}</span><span class="cepanica"></span><span class="cepanica"></span></div>
    </div>
    <div class="tabla">${brojke()}</div>
    <div class="polica-mak">${makroi(alhemija)}</div>
    ${pecat(alhemija)}
  </section>`,
  malaPosuda: (k, fa, fb, klasa = '') => posuda({ p: O.balon, uh: O.visoka, m: O.kockasta, napitak: O.balon }[k], { fa, fb, boja: k, mehura: 3, klasa: `bocica ${klasa}` }),
  labPosuda: () => `<div class="lab-posuda">${para}${posuda(O.kotao, { fa: 14, fb: 84, klasa: 'kotao', mehura: 14 })}<div class="ognjiste" aria-hidden="true"><span class="vatra">${'<i></i>'.repeat(7)}</span><span class="cepanica"></span><span class="cepanica"></span></div></div>`,
  napitakIkona: () => `<span class="napitak-ik">${posuda(O.balon, { fa: 140, boja: 'napitak', mehura: 3, klasa: 'bocica' })}</span>`,
  plamenP: () => `<svg viewBox="0 0 18 24" aria-hidden="true"><path d="${plamenOblik}" fill="#3fa9f5" stroke="#2a1608" stroke-width="1.6"/><path d="${plamenJezgro}" fill="#d6f0ff"/></svg>`,
  plamenK: () => `<svg viewBox="0 0 18 24" aria-hidden="true"><path d="${plamenOblik}" fill="#ff7a1a" stroke="#2a1608" stroke-width="1.6"/><path d="${plamenJezgro}" fill="#ffe066"/></svg>`,
  css: `
.tema-alhemija{--strana:#24150c;--strana-tekst:#f6e6cf;--strana-sivi:#d2b896;--strana-ploca:#33200f;--strana-linija:#4a2f1a;--strana-pod-ikone:#43291a;--telefon-ram:#1a0f08;
--pod:#5a3720;--ploca:#e0a868;--ploca-2:#d29556;--linija:#b97a40;--linija-tabela:rgba(58,33,16,.25);--tekst:#2a1608;--sivi:#5b3618;--hover:rgba(255,236,200,.35);
--traka:#3a2110;--traka-tekst:#f6e6cf;--traka-sivi:#dcc3a0;--traka-hover:#4a2c16;--nav-aktivno:#c8743a;--nav-aktivno-tekst:#1e0f05;
--akcent:#c8743a;--akcent-hover:#d98a4f;--akcent-tekst:#1e0f05;--fokus:#ffd34d;--fokus-meko:rgba(255,211,77,.45);
--r:20px;--r-dugme:14px;--r-polje:12px;--r-oznaka:999px;--okvir:3px solid #3a2110;--senka:0 6px 0 rgba(42,22,8,.55),0 16px 26px -10px rgba(0,0,0,.55);--senka-jaka:0 8px 0 rgba(42,22,8,.6),0 22px 40px -12px rgba(0,0,0,.6);
--dugme-okvir:3px solid #3a2110;--dugme-senka:0 4px 0 #3a2110;--polje:#efc488;--polje-okvir:3px solid #3a2110;
--p:#3fa9f5;--uh:#ffc23d;--m:#e0457b;--kcal:#6cc04a;--p-meko:#bfe3ff;--p-tekst:#0d3f66;--m-meko:#ffc9da;--m-tekst:#7a1035;--kcal-meko:#cdeebc;--kcal-tekst:#22520e;
--ok:#245f12;--dan:#d29556;--dan-danas:#f0bd7c;
--staklo-unutra:rgba(255,236,200,.22);--staklo-ivica:#2a1608;--staklo-debljina:3.5;--cilj-boja:#fff3d6;--povrsina:rgba(255,255,255,.55);--mehur:rgba(255,255,255,.8);
--voda:#3fa59a;--napitak:#9b5cf0;--napitak-pod:#f0bd7c;--para:rgba(255,240,220,.55);--sastojak:#fff2d8;--sastojak-tekst:#2a1608;--oblacic:#fff2d8;--oblacic-tekst:#2a1608;
--grupa-tekst:#2a1608;--grupa-linija:#3a2110;--gori-p-tekst:#0d3f66;--gori-p-sjaj:0 0 8px #7fd0ff,0 -3px 14px rgba(63,169,245,.85);--vatra-1:#ffe066;--vatra-2:#ff6a1a;
--font-d:'Grandstander',system-ui,sans-serif;--font-t:'Baloo 2',system-ui,sans-serif;--font-m:'Grandstander',system-ui,sans-serif;--font-broj:'Grandstander',system-ui,sans-serif;--potez:2.5}
.tema-alhemija .f-d{font-family:var(--font-d);font-weight:900}.tema-alhemija .f-t{font-weight:600}.tema-alhemija .f-m{font-family:var(--font-m);font-weight:800}
.tema-alhemija h1,.tema-alhemija h2,.tema-alhemija h3,.tema-alhemija .veliki,.tema-alhemija .makro-br b,.tema-alhemija .proc,.tema-alhemija .dan-br,.tema-alhemija .mesto,.tema-alhemija .datum b,.tema-alhemija .traka-ime,.tema-alhemija .napitak-makroi dd{font-weight:900}
.tema-alhemija .ekran{background:repeating-linear-gradient(180deg,#5d3a21 0 54px,#4b2d18 54px 57px),#5a3720}
.tema-alhemija .maketa-glava h1{color:#ffc23d}
.tema-alhemija .lab-uvod,.tema-alhemija .rang-uvod{color:#f6e6cf}
.tema-alhemija .lab-uvod p,.tema-alhemija .rang-uvod p,.tema-alhemija .legenda{color:#ead2b0}
.tema-alhemija .panel{background:linear-gradient(180deg,rgba(255,255,255,.12),transparent 30%),repeating-linear-gradient(90deg,rgba(90,50,20,.07) 0 3px,transparent 3px 19px),var(--ploca)}
.tema-alhemija .makro,.tema-alhemija .dan,.tema-alhemija .napitak-mali,.tema-alhemija .napitak-makroi div{border:2.5px solid #3a2110}
.tema-alhemija .oznaka{border:2px solid #3a2110;font-size:12px}
.tema-alhemija .sastojci li,.tema-alhemija .oblacic{border:2.5px solid #3a2110}
.tema-alhemija .tabela thead th{color:#4a2a12}
.tema-alhemija .traka{border-bottom:3px solid #2a1608}
.tema-alhemija .traka nav a[aria-current]{border:2.5px solid #1e0f05}
.tema-alhemija .dugme-ikona{color:#4a2a12}
.tema-alhemija .dan.danas{box-shadow:inset 0 0 0 3px #3a2110}
.tema-alhemija .tacka{background:#e0457b}
.tema-alhemija .posuda-obris path{fill:none}
.bocica .posuda-unutra{background:rgba(255,245,230,.45)}
.kotao .posuda-unutra{background:linear-gradient(90deg,rgba(150,80,35,.55),rgba(200,116,58,.25) 40%,rgba(150,80,35,.6))}
.kotao .posuda-obris path{stroke-width:4}
.kotao::after{content:"";position:absolute;left:2%;right:2%;top:17%;height:9%;border:4px solid #2a1608;border-radius:50%;background:transparent;box-shadow:inset 0 3px 0 rgba(255,220,170,.5)}
/* kotao i polica */
.napredak-kotao{display:grid;grid-template-columns:360px 1fr;grid-template-rows:auto auto;gap:18px 40px;align-items:center;padding:26px 32px}
.kotao-zona{grid-row:span 2;position:relative;padding-top:60px}
.kotao-zona .para,.lab-posuda .para{bottom:auto;top:-10px}
.kotao-zona,.tema-alhemija .lab-posuda{isolation:isolate}
.tema-alhemija .posuda.kotao{z-index:1}
.ognjiste{position:relative;z-index:0;height:48px;margin:-8px 14% 0}
.ognjiste .vatra{inset:-30px 6% 14px;z-index:1}
.ognjiste .vatra i{filter:blur(1px);border:2px solid rgba(42,22,8,.6)}
.cepanica{position:absolute;bottom:0;height:16px;width:62%;border-radius:8px;background:#7a4421;border:3px solid #2a1608;z-index:2}
.ognjiste .vatra{z-index:-1}
.cepanica:nth-of-type(2){left:0;transform:rotate(-6deg)}.cepanica:nth-of-type(3){right:0;transform:rotate(6deg)}
.tabla{padding:18px 22px;border:3px solid #3a2110;border-radius:16px;background:#fff2d8;box-shadow:0 5px 0 rgba(42,22,8,.45)}
.tabla .np-naslov{color:#7a4421}
.tema-alhemija .veliki{color:#2a1608;letter-spacing:-.01em}
.polica-mak{position:relative;padding-bottom:14px}
.polica-mak::after{content:"";position:absolute;left:-12px;right:-12px;bottom:0;height:14px;border-radius:4px;background:#7a4421;border:3px solid #2a1608}
.tema-alhemija .makro{background:transparent;border:0;padding:0 4px 4px;align-items:flex-end}
.tema-alhemija .makro .posuda{width:54px}
.tema-alhemija .makro-tekst{padding:6px 10px;border-radius:10px;background:#fff2d8;border:2.5px solid #3a2110}
.napredak-kotao .pecat{left:300px;top:6px}
.tema-alhemija .pecat-krug{fill:#b3202a;stroke:#6e0f16;stroke-width:5}
.tema-alhemija .pecat-unutra{fill:#c42a33;stroke:#7d1219;stroke-width:2}
.tema-alhemija .pecat-tekst{fill:#ffe1d6}
.tema-alhemija .pecat{filter:drop-shadow(0 4px 0 rgba(42,22,8,.5))}
/* laboratorija */
.tema-alhemija .lab-scena{background:radial-gradient(340px 260px at 50% 82%,rgba(255,140,40,.28),transparent 70%),repeating-linear-gradient(90deg,rgba(90,50,20,.07) 0 3px,transparent 3px 19px),var(--ploca)}
.tema-alhemija .lab-posuda{width:min(320px,100%)}
.tema-alhemija .ognjiste .vatra{opacity:.55;transition:opacity .6s}
.tema-alhemija .napredak-kotao .ognjiste .vatra,.tema-alhemija .kuva .ognjiste .vatra{opacity:1}
.tema-alhemija .napitak{background:#fff2d8}
.tema-alhemija .lab-savet{border:3px dashed #3a2110;color:#4a2a12}
/* rang */
.tema-alhemija .rang-lista{background:var(--ploca)}
.tema-alhemija .rang-merac{height:20px;border:3px solid #2a1608;border-radius:10px;background:#a65d2a;overflow:hidden;box-shadow:inset 0 3px 0 rgba(255,210,160,.4)}
.tema-alhemija .merac-tecnost{display:block;height:100%;width:calc(var(--f) * 1%);background:#9b5cf0;border-right:3px solid #2a1608}
.tema-alhemija .rang-kcal{color:#4a2a12}
.tema-alhemija .gori-k .ime-tekst{color:#2a1608}
.tema-alhemija .vatra i{border:0}
@container ekran (max-width:640px){
  .napredak-kotao{grid-template-columns:1fr;padding:16px 14px;gap:14px}
  .kotao-zona{grid-row:auto;width:250px;justify-self:center;padding-top:44px}
  .tema-alhemija .makro .posuda{width:40px}
  .tema-alhemija .makro-tekst{padding:4px 4px}
  .napredak-kotao .pecat{left:auto;right:0;top:0}
  .tema-alhemija .lab-posuda{width:220px}
}
`,
}

export const teme = [tamno, svetlo, alhemija]
