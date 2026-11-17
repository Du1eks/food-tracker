// Pravi tri makete pravaca + index. Pokretanje: node .impeccable/predlozi/_gradi.mjs
// Zajednički su podaci i raspored ekrana; svaka tema daje tokene, posude, plamen i miša.
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { teme } from './_teme.mjs'

const OVDE = dirname(fileURLToPath(import.meta.url))
const MIS = '../../public/maskota/'

// ---------- podaci (primer dana; ime, količina, kcal, P, UH, M) ----------
const CILJ = { kcal: 3200, p: [130, 160], uh: 450, m: [70, 90] }
const DAN = [
  ['Doručak', [['Ovsene pahuljice', '100 g', 372, 13, 60, 7], ['Mleko 2,8%', '300 ml', 177, 10, 14, 8], ['Banana', '1 kom', 105, 1, 27, 0], ['Med', '20 g', 61, 0, 16, 0]]],
  ['Ručak', [['Pileća prsa', '150 g', 248, 47, 0, 5], ['Pirinač kuvan', '300 g', 390, 8, 84, 1], ['Maslinovo ulje', '10 g', 88, 0, 0, 10]]],
  ['Užina', [['Obrani sir', '150 g', 108, 18, 5, 1], ['Tortilja', '1 kom', 190, 5, 32, 5], ['Kikiriki', '30 g', 177, 8, 5, 15], ['Pirinčane galete', '3 kom', 105, 2, 23, 1]]],
]
const VECERA = ['Večera', [['Junetina mlevena', '100 g', 250, 26, 0, 15], ['Testenina kuvana', '250 g', 393, 14, 78, 2], ['Paradajz sos', '150 g', 50, 2, 9, 1], ['Sok od narandže', '500 ml', 225, 3, 52, 0], ['Mlečna čokolada', '40 g', 216, 3, 23, 12]]]
const zbir = (obroci) => obroci.flatMap((o) => o[1]).reduce((s, r) => [s[0] + r[2], s[1] + r[3], s[2] + r[4], s[3] + r[5]], [0, 0, 0, 0])
const PRE = zbir(DAN)
const POSLE = zbir([...DAN, VECERA])
const proc = (v, c) => Math.round((v / c) * 1000) / 10
// samoprovera: posle večere cilj mora biti pogođen (95–105 %), pre ne
const pogodjen = (k) => k / CILJ.kcal >= 0.95 && k / CILJ.kcal <= 1.05
if (pogodjen(PRE[0]) || !pogodjen(POSLE[0])) throw new Error(`loši podaci dana: ${PRE[0]} → ${POSLE[0]}`)
if (POSLE[1] < CILJ.p[0] || POSLE[1] > CILJ.p[1] || POSLE[3] < CILJ.m[0] || POSLE[3] > CILJ.m[1]) throw new Error('makroi posle večere van cilja')

const JELO = { ime: 'Piletina sa pirinčem i paprikom', sastojci: ['200 g piletine', '100 g pirinča', '1 paprika', '10 g maslinovog ulja'], kcal: 818, p: 70, uh: 88, m: 18 }
const oznake = (j) => [j.p >= 30 && 'HIGH PROTEIN', j.kcal >= 700 && 'HIGH CALORIE', (j.m * 9) / j.kcal <= 0.2 && 'LOW FAT'].filter(Boolean)
const NAPICI = [
  { ime: 'Ovsena kaša sa whey-om', kcal: 520, p: 38, uh: 66, m: 10, boja: 'uh' },
  { ime: 'Tortilja sa obranim sirom', kcal: 298, p: 23, uh: 37, m: 6, boja: 'p' },
  { ime: 'Testenina bolonjeze', kcal: 960, p: 46, uh: 120, m: 30, boja: 'm' },
]
const RANG = [
  { ime: 'dule', kcal: 3140, cilj: 3200, p: true, pehar: 'zlato' },
  { ime: 'kiza', kcal: 2880, cilj: 3000, p: false, pehar: 'srebro' },
  { ime: 'maja_fit', kcal: 1940, cilj: 2200, p: true, pehar: 'bronza' },
  { ime: 'stefke', kcal: 2270, cilj: 3200, p: false },
  { ime: 'ana.b', kcal: 1080, cilj: 2000, p: false },
]
const NEDELJA = [['Pon', 16, 'ok', 3180], ['Uto', 17, 'ok', 3240], ['Sre', 18, 'promasen', 2710], ['Čet', 19, 'danas'], ['Pet', 20], ['Sub', 21], ['Ned', 22]]

// ---------- pomoćnici ----------
const br = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
const IKONE = {
  kuca: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  tikvica: '<path d="M9 3h6"/><path d="M10 3v6.5L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9.5V3"/><path d="M7 15h10"/>',
  kalendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  namirnice: '<path d="M12 7c-2-2-6-1.5-7 2s.5 8 3 10.5c1.2 1.2 2.6 1 4 .3 1.4.7 2.8.9 4-.3C18.5 17 20 12.5 19 9s-5-4-7-2Z"/><path d="M12 7c0-2 1-3.5 3-4"/>',
  prijatelji: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-3.5 3.2-5.5 6.5-5.5s6 2 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c2 .8 3.2 2.6 3.5 5.2"/>',
  profil: '<circle cx="12" cy="8" r="4"/><path d="M4 21c.6-4 3.8-6.5 8-6.5s7.4 2.5 8 6.5"/>',
  pehar: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  levo: '<path d="m15 5-7 7 7 7"/>',
  desno: '<path d="m9 5 7 7-7 7"/>',
  olovka: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z"/>',
  kanta: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  strelica: '<path d="M4 12h14M13 6l6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  plamen: '<path d="M12 21c-4 0-7-2.8-7-6.6 0-3.6 2.6-5.6 4-8.4.6 1.8 1.6 3 3 3.6-.4-2.8.6-5.6 3-7.6.2 3.4 4 6.2 4 11.4 0 4-3 7.6-7 7.6Z"/>',
}
export const ik = (n, k = '') => `<svg class="ik ${k}" viewBox="0 0 24 24" aria-hidden="true">${IKONE[n]}</svg>`
export const mehurici = (n = 9) => Array.from({ length: n }, (_, i) => `<i style="--x:${(i * 37) % 88 + 6}%;--d:${(1.8 + ((i * 7) % 5) * 0.35).toFixed(2)}s;--k:${(i * 0.43).toFixed(2)}s;--s:${4 + (i * 5) % 7}px"></i>`).join('')

// posuda: maska oblika + tečnost koja raste do linije cilja (--ch = visina cilja u % posude)
export function posuda(oblik, { fa, fb = fa, klasa = '', mehura = 9, boja = '' } = {}) {
  const { d, ch, vb = '0 0 200 220' } = oblik
  const [, , w, h] = vb.split(' ').map(Number)
  const maska = `url('data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" preserveAspectRatio="none"><path d="${d}"/></svg>`)}')`
  const y = h - (h * ch) / 100
  return `<div class="posuda ${klasa}" style="--fa:${fa};--fb:${fb};--ch:${ch};aspect-ratio:${w}/${h};${boja ? `--boja:var(--${boja})` : ''}">
    <div class="posuda-unutra" style="-webkit-mask:${maska} 0 0/100% 100% no-repeat;mask:${maska} 0 0/100% 100% no-repeat"><div class="tecnost">${mehurici(mehura)}</div></div>
    <svg class="posuda-obris" viewBox="${vb}" preserveAspectRatio="none" aria-hidden="true"><path d="${d}"/><line class="cilj-crta" x1="0" x2="${w}" y1="${y}" y2="${y}"/></svg>
  </div>`
}

// ---------- delovi ekrana ----------
const NAV = [['kuca', 'Danas'], ['tikvica', 'Laboratorija'], ['kalendar', 'Kalendar'], ['namirnice', 'Namirnice'], ['prijatelji', 'Prijatelji'], ['profil', 'Profil']]
const traka = (t, aktivno) => `<header class="traka">
  <a class="traka-ime" href="#"><span class="traka-znak">${t.znak()}</span><span>Mouse's tracker</span></a>
  <nav aria-label="Glavna"><ul>${NAV.map(([i, n]) => `<li><a href="#" ${n === aktivno ? 'aria-current="page"' : ''}>${ik(i)}<span>${n}</span></a></li>`).join('')}</ul></nav>
</header>`

const nedelja = () => `<section class="panel nedelja-panel" aria-label="Nedelja">
  <div class="datum-red"><button class="dugme-ikona" aria-label="Prethodna nedelja">${ik('levo')}</button><p class="datum"><b>Četvrtak, 19. novembar</b><span>16 – 22. nov</span></p><button class="dugme-ikona" aria-label="Sledeća nedelja">${ik('desno')}</button></div>
  <ol class="nedelja">${NEDELJA.map(([d, n, s = 'buduci', k]) => `<li class="dan ${s}"><span class="dan-ime">${d}</span><span class="dan-br">${n}</span><span class="dan-znak">${s === 'ok' ? ik('check') : s === 'promasen' ? ik('x') : s === 'danas' ? `${ik('check', 'kad-pogodi')}<span class="tacka"></span>` : ''}</span>${k ? `<span class="dan-kcal">${br(k)}</span>` : ''}</li>`).join('')}</ol>
</section>`

const makro = (t, k, ime, a, b, cilj, jed = 'g') => {
  const gornja = Array.isArray(cilj) ? cilj[1] : cilj
  const ciljTxt = Array.isArray(cilj) ? `${cilj[0]}–${cilj[1]} ${jed}` : `~${cilj} ${jed}`
  return `<div class="makro makro-${k}">
    ${t.malaPosuda(k, proc(a, gornja), proc(b, gornja))}
    <p class="makro-tekst"><span class="makro-ime">${ime}</span><span class="makro-br"><b data-a="${a}" data-b="${b}">${a}</b> g</span><span class="makro-cilj">cilj ${ciljTxt}</span></p>
  </div>`
}
export const makroi = (t) => `<div class="makroi">${makro(t, 'p', 'Proteini', PRE[1], POSLE[1], CILJ.p)}${makro(t, 'uh', 'Ugljeni hidrati', PRE[2], POSLE[2], CILJ.uh)}${makro(t, 'm', 'Masti', PRE[3], POSLE[3], CILJ.m)}</div>`
export const brojke = () => `<div class="np-brojke">
  <h2 class="np-naslov">Dnevni napredak</h2>
  <p class="np-uneto"><span class="veliki" data-a="${PRE[0]}" data-b="${POSLE[0]}">${br(PRE[0])}</span><span class="od">/ ${br(CILJ.kcal)} kcal</span></p>
  <p class="np-ostalo"><span class="pre-txt">Ostalo <b data-a="${CILJ.kcal - PRE[0]}" data-b="${CILJ.kcal - POSLE[0]}">${br(CILJ.kcal - PRE[0])}</b> kcal do cilja</span><span class="posle-txt">Cilj pogođen, ${br(POSLE[0])} od ${br(CILJ.kcal)} kcal</span></p>
</div>`
export const pecat = (t) => `<div class="pecat" role="img" aria-label="Pečat: cilj kalorija pogođen">
  <svg viewBox="0 0 120 120" aria-hidden="true"><defs><path id="krug-${t.id}" d="M60 60m-47 0a47 47 0 1 1 94 0a47 47 0 1 1-94 0"/></defs><circle class="pecat-krug" cx="60" cy="60" r="56"/><circle class="pecat-unutra" cx="60" cy="60" r="38"/><text class="pecat-tekst"><textPath href="#krug-${t.id}" startOffset="0">CILJ POGOĐEN · 19. NOV · CILJ POGOĐEN · 19. NOV ·</textPath></text></svg>
  <img src="${MIS}slavi.webp" alt="" width="58" height="67">
</div>`
export const PODACI = { PRE, POSLE, CILJ, br, MIS }

const reci = (t) => `<section class="panel reci" aria-labelledby="reci-${t.id}">
  <div class="reci-mis">${t.mis('reci')}<p class="oblacic">Šta si jeo? Napiši mi, ja upisujem.</p></div>
  <h2 id="reci-${t.id}" class="panel-naslov">Reci mišu šta si jeo</h2>
  <form class="reci-forma" onsubmit="return false">
    <label class="sr" for="reci-polje-${t.id}">Šta si jeo</label>
    <textarea id="reci-polje-${t.id}" rows="3" class="polje">100 g junetine, 250 g testenine sa sosom, sok i malo čokolade</textarea>
    <div class="reci-dugmad"><button class="dugme dugme-glavno" type="button">Pročitaj ${ik('strelica')}</button><button class="dugme dugme-drugo" type="button">${ik('plus')} Ručno</button></div>
  </form>
</section>`

const red = (r, nov) => `<tr class="${nov ? 'nov' : ''}"><td class="t-ime"><span>${r[0]}</span><span class="t-kol-mob">${r[1]}</span></td><td class="t-kol num">${r[1]}</td><td class="num t-kcal">${br(r[2])}</td><td class="num mak">${r[3]}</td><td class="num mak">${r[4]}</td><td class="num mak">${r[5]}</td><td class="t-akcije"><button class="dugme-ikona malo" aria-label="Izmeni ${r[0]}">${ik('olovka')}</button><button class="dugme-ikona malo" aria-label="Obriši ${r[0]}">${ik('kanta')}</button></td></tr>`
const grupa = ([naziv, redovi], nov) => { const z = zbir([[naziv, redovi]]); return `<tbody class="${nov ? 'vecera' : ''}"><tr class="grupa"><th scope="rowgroup" colspan="2">${naziv}</th><td class="num">${br(z[0])}</td><td class="num mak" colspan="4"></td></tr>${redovi.map((r) => red(r, nov)).join('')}</tbody>` }
const tabela = (t) => `<section class="panel tabela-panel" aria-labelledby="tab-${t.id}">
  <h2 id="tab-${t.id}" class="panel-naslov">Unosi za dan</h2>
  <table class="tabela"><thead><tr><th scope="col">Namirnica</th><th scope="col" class="t-kol">Količina</th><th scope="col" class="num">kcal</th><th scope="col" class="num mak">P</th><th scope="col" class="num mak">UH</th><th scope="col" class="num mak">M</th><th scope="col"><span class="sr">Akcije</span></th></tr></thead>
  ${DAN.map((g) => grupa(g)).join('')}${grupa(VECERA, true)}
  <tfoot><tr><th scope="row" colspan="2">Ukupno</th><td class="num"><b data-a="${PRE[0]}" data-b="${POSLE[0]}">${br(PRE[0])}</b></td><td class="num mak" data-a="${PRE[1]}" data-b="${POSLE[1]}">${PRE[1]}</td><td class="num mak" data-a="${PRE[2]}" data-b="${POSLE[2]}">${PRE[2]}</td><td class="num mak" data-a="${PRE[3]}" data-b="${POSLE[3]}">${PRE[3]}</td><td></td></tr></tfoot></table>
</section>`

const pocetna = (t) => `${traka(t, 'Danas')}<main class="sadrzaj pocetna">${nedelja()}${t.napredak()}${reci(t)}${tabela(t)}</main>`

const oz = (o) => `<li class="oznaka oznaka-${o.split(' ')[1].toLowerCase()}">${o}</li>`
const lab = (t) => `${traka(t, 'Laboratorija')}<main class="sadrzaj lab">
  <div class="lab-uvod"><h1>Laboratorija</h1><p>Klikni miša i reci mu šta je u jelu. On izmeri, skuva i sačuva napitak, pa ga sledeći put upišeš jednim klikom.</p></div>
  <div class="lab-scena panel">
    <button class="lab-mis" type="button" aria-label="Otvori unos jela">${t.mis('lab')}<span class="oblacic">Šta kuvamo danas?</span></button>
    <div class="lab-sto">
      <ul class="sastojci" aria-hidden="true">${JELO.sastojci.map((s, i) => `<li style="--i:${i};--dx:${(i - 1.5) * 34}px">${s}</li>`).join('')}</ul>
      ${t.labPosuda()}
    </div>
    <div class="lab-desno">
      <div class="lab-savet"><p><b>Miš čeka.</b> Klikni ga da otvoriš unos jela.</p></div>
      <form class="lab-unos" onsubmit="return false"><label for="jelo-${t.id}">Šta je u jelu?</label><textarea id="jelo-${t.id}" class="polje" rows="3">${JELO.sastojci.join(', ')}</textarea><button class="dugme dugme-glavno skuvaj" type="button">Skuvaj ${ik('tikvica')}</button></form>
      <article class="napitak" aria-live="polite">
        <div class="napitak-glava">${t.napitakIkona(JELO)}<h2>${JELO.ime}</h2></div>
        <dl class="napitak-makroi"><div><dt>kcal</dt><dd>${JELO.kcal}</dd></div><div><dt>P</dt><dd>${JELO.p}<small> g</small></dd></div><div><dt>UH</dt><dd>${JELO.uh}<small> g</small></dd></div><div><dt>M</dt><dd>${JELO.m}<small> g</small></dd></div></dl>
        <ul class="oznake">${oznake(JELO).map(oz).join('')}</ul>
        <div class="napitak-dugmad"><button class="dugme dugme-glavno" type="button">Upiši u dan</button><button class="dugme dugme-drugo ponovo" type="button">Skuvaj drugo</button></div>
      </article>
    </div>
  </div>
  <section class="polica panel" aria-labelledby="polica-${t.id}"><h2 id="polica-${t.id}" class="panel-naslov">Tvoji napici</h2>
    <ul>${NAPICI.map((n) => `<li class="napitak-mali">${t.malaPosuda(n.boja, 70, 70, 'polica')}<div><b>${n.ime}</b><span class="num">${n.kcal} kcal · P ${n.p} · UH ${n.uh} · M ${n.m}</span><ul class="oznake">${oznake(n).map(oz).join('')}</ul></div><button class="dugme dugme-drugo malo" type="button">${ik('plus')} Upiši</button></li>`).join('')}</ul>
  </section>
</main>`

const rang = (t) => `${traka(t, 'Prijatelji')}<main class="sadrzaj rang">
  <div class="rang-uvod"><h1>Rang za danas</h1><p>Ko je bliže dnevnom cilju kalorija (do 100%).</p>
  <ul class="legenda"><li><span class="leg leg-p">${t.plamenP()}</span> pogođeni proteini</li><li><span class="leg leg-k">${t.plamenK()}</span> pogođene kalorije</li></ul></div>
  <ol class="rang-lista panel">${RANG.map((r, i) => { const f = Math.min(100, proc(r.kcal, r.cilj)); const k = f >= 95; return `<li class="rang-red${i === 0 ? ' prvi' : ''}">
    <span class="mesto num">${i + 1}</span>
    ${r.pehar ? `<img class="pehar" src="${MIS}pehar-${r.pehar}.webp" alt="${r.pehar} pehar" width="34" height="40">` : '<span class="pehar"></span>'}
    <span class="ime${r.p ? ' gori-p' : ''}${k ? ' gori-k' : ''}">${k ? `<span class="vatra" aria-hidden="true">${'<i></i>'.repeat(7)}</span>` : ''}${r.p ? `<span class="plamencic">${t.plamenP()}</span>` : ''}<span class="ime-tekst">${r.ime}</span>${r.p || k ? `<span class="sr">${[r.p && 'pogodio proteine', k && 'pogodio kalorije'].filter(Boolean).join(', ')}</span>` : ''}</span>
    <span class="rang-merac" style="--f:${f}" aria-hidden="true"><span class="merac-tecnost"></span></span>
    <span class="proc num">${Math.round(f)}%</span>
    <span class="rang-kcal num">${br(r.kcal)} / ${br(r.cilj)}</span>
  </li>` }).join('')}</ol>
</main>`

// ---------- stranica makete ----------
const okviri = (t, ekran, ime) => `<div class="okviri">
  <figure class="okvir racunar"><div class="ekran" data-ekran="${ime}">${ekran(t)}</div><figcaption>Računar · 1280 px</figcaption></figure>
  <figure class="okvir telefon"><div class="ekran" data-ekran="${ime}">${ekran(t)}</div><figcaption>Telefon · 380 px</figcaption></figure>
</div>`

const sistem = (t) => `<section class="sistem" aria-label="Sistem pravca">
  <div class="sis-blok sis-paleta"><h3>Paleta</h3><ul>${t.paleta.map(([n, v, h]) => `<li><span class="sw" style="background:var(--${v})"></span><b>${n}</b><code>${h}</code></li>`).join('')}</ul></div>
  <div class="sis-blok sis-font"><h3>Fontovi</h3><ul>${t.fontovi.map(([u, f, s, k]) => `<li><span class="${k}">${s}</span><small>${u} · ${f}</small></li>`).join('')}</ul></div>
  <div class="sis-blok sis-oblici"><h3>Oblici i kontrole</h3><div class="sis-kontrole"><button class="dugme dugme-glavno" type="button">Upiši ${ik('strelica')}</button><button class="dugme dugme-drugo" type="button">Otkaži</button><input class="polje" value="150 g obranog sira" aria-label="Primer polja"><ul class="oznake">${['HIGH PROTEIN', 'HIGH CALORIE', 'LOW FAT'].map(oz).join('')}</ul></div><p>${t.oblici}</p></div>
  <div class="sis-blok sis-ikone"><h3>Ikonice</h3><ul>${['kuca', 'tikvica', 'kalendar', 'namirnice', 'prijatelji', 'profil', 'pehar', 'plamen', 'check', 'olovka'].map((i) => `<li>${ik(i)}</li>`).join('')}</ul><p>${t.ikoneOpis}</p></div>
  <div class="sis-blok sis-anim"><h3>Žive animacije</h3><ol>${t.animacije.map((a) => `<li>${a}</li>`).join('')}</ol><p class="sitno">Sa <code>prefers-reduced-motion</code> sve staje i odmah se vidi krajnje stanje.</p></div>
</section>`

const JS = `
const ceka = (ms) => new Promise((r) => setTimeout(r, ms))
const mirno = matchMedia('(prefers-reduced-motion: reduce)').matches
const br = (n) => String(Math.round(n)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, '\\u202F')
function brojaj(koren, napred) {
  koren.querySelectorAll('[data-a]').forEach((el) => {
    const od = +el.dataset[napred ? 'a' : 'b'], do_ = +el.dataset[napred ? 'b' : 'a']
    if (mirno) { el.textContent = br(do_); return }
    const t0 = performance.now(), T = 1400
    const korak = (t) => { const x = Math.min(1, (t - t0) / T), e = 1 - Math.pow(1 - x, 4); el.textContent = br(od + (do_ - od) * e); if (x < 1) requestAnimationFrame(korak) }
    requestAnimationFrame(korak)
  })
}
document.querySelectorAll('[data-vecera]').forEach((d) => d.addEventListener('click', () => {
  const s = d.closest('.ekran-red'), napred = !s.classList.contains('posle')
  s.classList.toggle('posle', napred); brojaj(s, napred)
  d.textContent = napred ? 'Vrati na pre večere' : 'Dodaj večeru i pogodi cilj'
}))
async function kuvaj(l) {
  l.classList.remove('gotovo', 'kuva'); l.classList.add('otvoren')
  if (!mirno) await ceka(900)
  l.classList.add('kuva')
  if (!mirno) await ceka(3000)
  l.classList.add('gotovo')
}
document.querySelectorAll('.lab').forEach((l) => {
  l.querySelector('.lab-mis').addEventListener('click', () => { l.classList.remove('gotovo', 'kuva'); l.classList.toggle('otvoren') })
  l.querySelector('.skuvaj').addEventListener('click', () => kuvaj(l))
  l.querySelector('.ponovo').addEventListener('click', () => l.classList.remove('gotovo', 'kuva'))
})
document.querySelectorAll('[data-tok]').forEach((d) => d.addEventListener('click', () => d.closest('.ekran-red').querySelectorAll('.lab').forEach(kuvaj)))
const labRed = document.getElementById('laboratorija')
new IntersectionObserver((u, o) => { if (u[0].isIntersecting) { o.disconnect(); labRed.querySelectorAll('.lab').forEach(kuvaj) } }, { threshold: 0.3 }).observe(labRed)
`

function stranica(t) {
  return `<!doctype html>
<html lang="sr-Latn">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t.naslov} · Mouse's tracker</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${t.fontUrl}&display=swap">
<style>${OSNOVA}${t.css}</style>
</head>
<body class="tema-${t.id}">
<header class="maketa-glava">
  <a class="nazad" href="index.html">${ik('levo')} Sva tri pravca</a>
  <h1>${t.naslov}</h1>
  <p>${t.opis}</p>
</header>
${sistem(t)}
<section class="ekran-red" id="pocetna"><div class="red-glava"><h2>Početna</h2><p>${t.opisPocetna}</p><button class="dugme dugme-glavno" type="button" data-vecera>Dodaj večeru i pogodi cilj</button></div>${okviri(t, pocetna, 'pocetna')}</section>
<section class="ekran-red" id="laboratorija"><div class="red-glava"><h2>Laboratorija</h2><p>${t.opisLab}</p><button class="dugme dugme-glavno" type="button" data-tok>Pusti ceo tok ponovo</button></div>${okviri(t, lab, 'lab')}</section>
<section class="ekran-red" id="rang"><div class="red-glava"><h2>Rang lista</h2><p>${t.opisRang}</p></div>${okviri(t, rang, 'rang')}</section>
<script>${JS}</script>
</body>
</html>
`
}

// ---------- zajednički CSS: raspored, okviri, posude, stanja; boje i oblik daje tema ----------
const OSNOVA = `
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--strana);color:var(--tekst);font-family:var(--font-t);font-size:16px;line-height:1.45;font-variant-numeric:tabular-nums}
::selection{background:var(--akcent);color:var(--akcent-tekst)}
:focus-visible{outline:3px solid var(--fokus);outline-offset:2px}
h1,h2,h3,p{margin:0}
button,input,textarea{font:inherit;color:inherit}
button{cursor:pointer}
code{font-family:var(--font-m);font-size:.85em}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.num{font-variant-numeric:tabular-nums}
.ik{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:var(--potez,1.75);stroke-linecap:round;stroke-linejoin:round;flex:none}
img{display:block}

/* stranica makete */
.maketa-glava{max-width:1800px;margin:0 auto;padding:48px 32px 24px}
.maketa-glava .nazad{display:inline-flex;align-items:center;gap:6px;color:var(--strana-sivi);text-decoration:none;font-size:14px;margin-bottom:24px}
.maketa-glava .nazad:hover{color:var(--strana-tekst)}
.maketa-glava h1{font-family:var(--font-d);font-size:clamp(40px,5vw,72px);line-height:1;color:var(--strana-tekst);text-wrap:balance}
.maketa-glava p{max-width:68ch;margin-top:16px;color:var(--strana-sivi);font-size:18px}
.sistem{max-width:1800px;margin:0 auto;padding:16px 32px 48px;display:grid;grid-template-columns:1.2fr 1.4fr 1.5fr 1fr 1.2fr;gap:16px;color:var(--strana-tekst)}
.sis-blok{padding:20px;border-radius:var(--r);background:var(--strana-ploca);border:1px solid var(--strana-linija)}
.sis-blok h3{font-family:var(--font-d);font-size:18px;margin-bottom:14px}
.sis-blok ul,.sis-blok ol{margin:0;padding:0;list-style:none}
.sis-blok p{margin-top:12px;font-size:14px;color:var(--strana-sivi)}
.sis-paleta li{display:grid;grid-template-columns:28px 1fr auto;gap:10px;align-items:center;font-size:14px;padding:3px 0}
.sis-paleta .sw{width:28px;height:28px;border-radius:8px;box-shadow:inset 0 0 0 1px rgba(127,127,127,.35)}
.sis-paleta code{color:var(--strana-sivi)}
.sis-font li{display:flex;flex-direction:column;padding:6px 0;border-bottom:1px solid var(--strana-linija)}
.sis-font li:last-child{border:0}
.sis-font span{font-size:24px;line-height:1.15}
.sis-font small{color:var(--strana-sivi);font-size:13px}
.sis-kontrole{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.sis-kontrole .polje{width:100%}
.sis-ikone ul{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
.sis-ikone li{display:grid;place-items:center;aspect-ratio:1;border-radius:calc(var(--r) * .6);background:var(--strana-pod-ikone);color:var(--strana-tekst)}
.sis-ikone .ik{width:24px;height:24px}
.sis-anim ol{padding-left:20px;list-style:decimal;font-size:14px;display:grid;gap:8px}
.sitno{font-size:13px}

.ekran-red{max-width:1800px;margin:0 auto;padding:40px 32px 64px;border-top:1px solid var(--strana-linija)}
.red-glava{display:flex;flex-wrap:wrap;align-items:baseline;gap:12px 24px;margin-bottom:24px;color:var(--strana-tekst)}
.red-glava h2{font-family:var(--font-d);font-size:36px;line-height:1.05}
.red-glava p{flex:1 1 420px;max-width:72ch;color:var(--strana-sivi)}
.okviri{display:flex;flex-wrap:wrap;gap:32px;align-items:flex-start}
.okvir{margin:0}
.okvir figcaption{margin-top:10px;font-size:13px;color:var(--strana-sivi);font-family:var(--font-m)}
.ekran{container:ekran/inline-size;background:var(--pod);color:var(--tekst);overflow:hidden;position:relative}
.racunar .ekran{width:1280px;border-radius:14px;box-shadow:0 30px 80px -30px rgba(0,0,0,.45),0 0 0 1px var(--strana-linija)}
.telefon .ekran{width:380px;border-radius:40px;border:10px solid var(--telefon-ram);box-shadow:0 30px 60px -30px rgba(0,0,0,.5)}
@media (max-width:1760px){.okviri{gap:24px}}

/* aplikacija: traka */
.traka{display:flex;align-items:center;gap:24px;padding:0 24px;height:64px;background:var(--traka);color:var(--traka-tekst);border-bottom:1px solid var(--linija)}
.traka-ime{display:flex;align-items:center;gap:10px;color:inherit;text-decoration:none;font-family:var(--font-d);font-size:18px;white-space:nowrap}
.traka-znak{width:40px;height:40px;position:relative;flex:none}
.traka-znak .mis{width:40px}
.traka nav{margin-left:auto}
.traka ul{display:flex;gap:4px;margin:0;padding:0;list-style:none}
.traka nav a{display:flex;align-items:center;gap:8px;height:40px;padding:0 12px;border-radius:calc(var(--r) * .7);color:var(--traka-sivi);text-decoration:none;font-size:15px;font-weight:600}
.traka nav a:hover{color:var(--traka-tekst);background:var(--traka-hover)}
.traka nav a[aria-current]{color:var(--nav-aktivno-tekst);background:var(--nav-aktivno)}
.sadrzaj{padding:24px;display:grid;gap:20px}
.panel{background:var(--ploca);border-radius:var(--r);border:var(--okvir);box-shadow:var(--senka);padding:20px;position:relative}
.panel-naslov{font-family:var(--font-d);font-size:20px;line-height:1.15;margin-bottom:14px}

/* kontrole */
.dugme{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:48px;padding:0 18px;border-radius:var(--r-dugme);font-weight:700;border:var(--dugme-okvir);transition:transform .15s,background-color .2s,box-shadow .2s;white-space:nowrap}
.dugme.malo{height:38px;padding:0 12px;font-size:14px}
.dugme-glavno{background:var(--akcent);color:var(--akcent-tekst);box-shadow:var(--dugme-senka)}
.dugme-glavno:hover{background:var(--akcent-hover)}
.dugme-drugo{background:var(--ploca-2);color:var(--tekst)}
.dugme-drugo:hover{background:var(--hover)}
.dugme:active{transform:translateY(1px)}
.dugme-ikona{display:inline-grid;place-items:center;width:40px;height:40px;border-radius:calc(var(--r) * .6);border:0;background:transparent;color:var(--sivi)}
.dugme-ikona:hover{background:var(--hover);color:var(--tekst)}
.dugme-ikona.malo{width:34px;height:34px}
.dugme-ikona.malo .ik{width:17px;height:17px}
.polje{display:block;width:100%;min-height:48px;padding:12px 14px;border-radius:var(--r-polje);border:var(--polje-okvir);background:var(--polje);color:var(--tekst);resize:none;caret-color:var(--akcent)}
.polje:focus{outline:none;border-color:var(--akcent);box-shadow:0 0 0 3px var(--fokus-meko)}
.oznake{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}
.oznaka{font-family:var(--font-m);font-size:11px;font-weight:700;letter-spacing:.04em;padding:5px 8px;border-radius:var(--r-oznaka);line-height:1}
.oznaka-protein{background:var(--p-meko);color:var(--p-tekst)}
.oznaka-calorie{background:var(--m-meko);color:var(--m-tekst)}
.oznaka-fat{background:var(--kcal-meko);color:var(--kcal-tekst)}

/* nedelja */
.nedelja-panel{padding:16px 20px}
.datum-red{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.datum{flex:1;display:flex;align-items:baseline;gap:12px}
.datum b{font-family:var(--font-d);font-size:20px}
.datum span{color:var(--sivi);font-size:14px}
.nedelja{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin:0;padding:0;list-style:none}
.dan{display:grid;justify-items:center;gap:2px;padding:10px 4px;border-radius:calc(var(--r) * .7);background:var(--dan);position:relative}
.dan-ime{font-size:13px;color:var(--sivi);font-weight:600}
.dan-br{font-family:var(--font-d);font-size:22px;line-height:1.1}
.dan-znak{height:26px;display:grid;place-items:center}
.dan-znak .ik{width:22px;height:22px;stroke-width:2.6}
.dan.ok .dan-znak{color:var(--ok)}
.dan.promasen .dan-znak{color:var(--sivi)}
.dan-kcal{font-size:12px;color:var(--sivi)}
.dan.danas{background:var(--dan-danas);box-shadow:inset 0 0 0 2px var(--akcent)}
.dan.danas .kad-pogodi{display:none;color:var(--ok)}
.posle .dan.danas .kad-pogodi{display:block;animation:upis .6s cubic-bezier(.2,.9,.3,1.4)}
.posle .dan.danas .tacka{display:none}
.tacka{width:8px;height:8px;border-radius:50%;background:var(--akcent);animation:puls 1.6s ease-in-out infinite}
.dan.buduci{opacity:.55}

/* posude */
.posuda{position:relative;width:100%;--f:var(--fa)}
.posle .posuda,.kuva .lab-posuda .posuda{--f:var(--fb)}
.posuda-unutra{position:absolute;inset:0;background:var(--staklo-unutra)}
.tecnost{position:absolute;left:0;right:0;bottom:0;height:calc(min(var(--f),112) * var(--ch) * .01%);background:var(--boja,var(--kcal));transition:height 1.6s cubic-bezier(.16,1,.3,1),background-color 1.8s;overflow:hidden}
.tecnost::before{content:"";position:absolute;left:0;right:0;top:0;height:8px;background:var(--povrsina);opacity:.75}
.tecnost i{position:absolute;bottom:-12px;left:var(--x);width:var(--s);height:var(--s);border-radius:50%;background:var(--mehur);animation:mehur var(--d) linear var(--k) infinite}
@keyframes mehur{0%{transform:translateY(0) translateX(0);opacity:0}12%{opacity:.95}60%{transform:translateY(-140px) translateX(4px)}100%{transform:translateY(-320px) translateX(-3px);opacity:0}}
.posuda-obris{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.posuda-obris path{fill:none;stroke:var(--staklo-ivica);stroke-width:var(--staklo-debljina,3);vector-effect:non-scaling-stroke;stroke-linejoin:round}
.cilj-crta{stroke:var(--cilj-boja);stroke-width:2;stroke-dasharray:6 5;vector-effect:non-scaling-stroke}

/* napredak: zajedničko */
.np-naslov{font-size:15px;font-weight:700;color:var(--sivi);margin-bottom:4px}
.np-uneto{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.veliki{font-family:var(--font-broj);font-size:clamp(56px,7cqi,96px);line-height:.95;letter-spacing:-.02em}
.od{font-size:20px;color:var(--sivi);font-weight:600}
.np-ostalo{margin-top:8px;font-size:17px}
.np-ostalo b{font-family:var(--font-broj);font-weight:inherit}
.posle-txt{display:none;color:var(--ok);font-weight:700}
.posle .pre-txt{display:none}.posle .posle-txt{display:inline}
.makroi{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.makro{display:flex;align-items:flex-end;gap:12px;padding:12px;border-radius:calc(var(--r) * .8);background:var(--ploca-2)}
.makro .posuda{width:44px;flex:none}
.makro-tekst{display:grid;gap:1px;min-width:0}
.makro-ime{font-size:13px;color:var(--sivi);font-weight:600}
.makro-br{font-size:15px;color:var(--sivi)}
.makro-br b{font-family:var(--font-broj);font-size:28px;color:var(--tekst);line-height:1.05;font-weight:inherit}
.makro-cilj{font-size:12px;color:var(--sivi)}
.makro-p{--boja:var(--p)}.makro-uh{--boja:var(--uh)}.makro-m{--boja:var(--m)}

/* pečat */
.pecat{position:absolute;width:132px;height:132px;display:grid;place-items:center;opacity:0;transform:scale(1.8) rotate(-25deg);pointer-events:none;transition:opacity .25s,transform .45s cubic-bezier(.2,1.5,.4,1)}
.posle .pecat{opacity:1;transform:scale(1) rotate(-12deg);transition-delay:1.2s}
.pecat svg{position:absolute;inset:0;width:100%;height:100%}
.pecat img{position:relative;width:58px;height:auto;margin-top:6px}
.pecat-tekst{font-family:var(--font-m);font-size:10.5px;font-weight:700;letter-spacing:.12em}

/* reci mišu */
.reci{display:grid;gap:0;align-content:start}
.reci-mis{display:flex;align-items:center;gap:14px;margin-bottom:12px}
.reci-mis .mis{width:96px;flex:none}
.reci-mis .oblacic{text-align:left}
.mis{position:relative;width:120px;aspect-ratio:1}
.mis img{width:100%;height:auto}
.mis svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.oblacic{position:relative;font-size:13px;line-height:1.3;padding:8px 10px;border-radius:12px;background:var(--oblacic);color:var(--oblacic-tekst);text-align:center}
.reci-forma{display:grid;gap:10px}
.reci-dugmad{display:flex;gap:8px;flex-wrap:wrap}

/* tabela */
.tabela{width:100%;border-collapse:collapse;font-size:15px}
.tabela th,.tabela td{padding:9px 8px;text-align:left;border-bottom:1px solid var(--linija-tabela)}
.tabela thead th{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--sivi);font-weight:700}
.tabela .num{text-align:right}
.tabela .grupa th,.tabela .grupa td{padding-top:16px;font-family:var(--font-d);font-size:15px;color:var(--grupa-tekst);border-bottom-color:var(--grupa-linija)}
.tabela .grupa td{color:var(--sivi);font-family:var(--font-t)}
.tabela tbody tr:not(.grupa):hover{background:var(--hover)}
.t-akcije{width:80px;white-space:nowrap;text-align:right}
.t-kol-mob{display:none}
.t-kcal{font-weight:700}
.tabela tfoot th,.tabela tfoot td{border-bottom:0;padding-top:14px;font-weight:800;font-size:16px}
.vecera{display:none}
.posle .vecera{display:table-row-group}
.posle .vecera tr{animation:pojava .5s both}
.posle .vecera tr:nth-child(2){animation-delay:.08s}.posle .vecera tr:nth-child(3){animation-delay:.16s}.posle .vecera tr:nth-child(4){animation-delay:.24s}.posle .vecera tr:nth-child(5){animation-delay:.32s}.posle .vecera tr:nth-child(6){animation-delay:.4s}
@keyframes pojava{from{opacity:0;transform:translateY(-6px)}}

/* raspored početne na računaru */
.pocetna{grid-template-columns:420px 1fr}
.pocetna .nedelja-panel,.pocetna .napredak{grid-column:1/-1}
.reci,.tabela-panel{align-self:start}

/* laboratorija */
.lab-uvod{display:grid;gap:8px}
.lab-uvod h1,.rang-uvod h1{font-family:var(--font-d);font-size:40px;line-height:1.05}
.lab-uvod p,.rang-uvod p{max-width:62ch;color:var(--sivi)}
.lab-scena{display:grid;grid-template-columns:260px 1fr 380px;gap:24px;align-items:center;min-height:440px;overflow:hidden}
.lab-mis{display:flex;flex-direction:column;align-items:center;gap:10px;background:none;border:0;padding:12px;border-radius:var(--r);transition:transform .2s}
.lab-mis:hover{transform:translateY(-3px)}
.lab-mis .mis-lab{width:220px}
.lab-mis .mis-lab .mis{width:76%}
.otvoren .lab-mis .oblacic{background:var(--akcent);color:var(--akcent-tekst)}
.lab-sto{position:relative;display:grid;justify-items:center;align-items:end;padding-top:90px}
.lab-posuda{width:min(280px,100%);position:relative}
.sastojci{position:absolute;top:0;left:50%;margin:0;padding:0;list-style:none;z-index:2}
.sastojci li{position:absolute;left:0;top:20px;transform:translateX(-50%);white-space:nowrap;font-size:13px;font-weight:700;padding:6px 10px;border-radius:999px;background:var(--sastojak);color:var(--sastojak-tekst);box-shadow:0 6px 14px -6px rgba(0,0,0,.4);opacity:0}
.kuva .sastojci li{animation:upada 1.3s cubic-bezier(.5,0,.75,0) calc(var(--i) * .5s) both}
@keyframes upada{0%{opacity:0;transform:translate(calc(-50% + var(--dx)),-30px) rotate(-6deg)}18%{opacity:1;transform:translate(calc(-50% + var(--dx)),0) rotate(4deg)}100%{opacity:0;transform:translate(-50%,190px) scale(.35) rotate(28deg)}}
.lab-posuda .tecnost{--boja:var(--voda)}
.kuva .lab-posuda .tecnost{--boja:var(--napitak);transition-delay:0s,.6s}
.kuva .lab-posuda .tecnost i{animation-duration:calc(var(--d) * .45)}
.para{position:absolute;left:50%;bottom:100%;width:160px;height:120px;transform:translateX(-50%);pointer-events:none;opacity:.35;transition:opacity 1s}
.kuva .para{opacity:1}
.para span{position:absolute;bottom:0;width:36px;height:70px;border-radius:50%;background:var(--para);filter:blur(10px);animation:para 3.2s ease-out infinite}
.para span:nth-child(1){left:30px}.para span:nth-child(2){left:70px;animation-delay:1.1s}.para span:nth-child(3){left:100px;animation-delay:2.1s}
@keyframes para{0%{transform:translateY(20px) scale(.6);opacity:0}30%{opacity:.8}100%{transform:translateY(-90px) scale(1.5,1.2);opacity:0}}
.lab-desno{position:relative;min-height:300px;display:grid;align-items:center}
.lab-desno>*{grid-area:1/1}
.lab-savet,.lab-unos,.napitak{transition:opacity .35s,transform .45s cubic-bezier(.16,1,.3,1)}
.lab-savet{padding:20px;border-radius:var(--r);border:2px dashed var(--linija);color:var(--sivi)}
.lab-unos{display:grid;gap:10px;opacity:0;transform:translateY(12px);pointer-events:none}
.lab-unos label{font-weight:700}
.napitak{opacity:0;transform:scale(.92) translateY(10px);pointer-events:none;padding:20px;border-radius:var(--r);background:var(--napitak-pod);border:var(--okvir);box-shadow:var(--senka-jaka);display:grid;gap:14px}
.otvoren .lab-savet{opacity:0;transform:translateY(-8px)}
.otvoren .lab-unos{opacity:1;transform:none;pointer-events:auto}
.gotovo .lab-unos{opacity:0;transform:translateY(-12px);pointer-events:none}
.gotovo .napitak{opacity:1;transform:none;pointer-events:auto;animation:otkrij .9s cubic-bezier(.16,1,.3,1)}
@keyframes otkrij{0%{clip-path:circle(0% at 30% 30%)}100%{clip-path:circle(150% at 30% 30%)}}
.napitak-glava{display:flex;gap:14px;align-items:center}
.napitak-ik{width:50px;flex:none}
.napitak h2{font-family:var(--font-d);font-size:22px;line-height:1.15}
.napitak-makroi{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:0}
.napitak-makroi div{padding:8px;border-radius:calc(var(--r) * .6);background:var(--ploca-2)}
.napitak-makroi dt{font-size:12px;color:var(--sivi);font-weight:700}
.napitak-makroi dd{white-space:nowrap;margin:0;font-family:var(--font-broj);font-size:22px}
.napitak-makroi dd small{font-family:var(--font-t);font-size:14px;color:var(--sivi)}
.napitak-dugmad{display:flex;gap:8px;flex-wrap:wrap}
.polica ul{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.napitak-mali{display:flex;gap:12px;align-items:center;padding:12px;border-radius:calc(var(--r) * .8);background:var(--ploca-2)}
.napitak-mali>div{display:grid;gap:4px;flex:1;min-width:0}
.napitak-mali span{font-size:13px;color:var(--sivi)}
.napitak-mali .posuda{width:38px;flex:none}
.napitak-mali .oznake{margin-top:2px}

/* rang */
.rang-uvod{display:grid;gap:8px}
.legenda{display:flex;gap:20px;margin:6px 0 0;padding:0;list-style:none;font-size:14px;color:var(--sivi)}
.legenda li{display:flex;align-items:center;gap:6px}
.leg svg{width:18px;height:22px;display:block}
.rang-lista{margin:0;padding:8px 20px;list-style:none}
.rang-red{display:grid;grid-template-columns:32px 40px minmax(160px,1.1fr) 2fr 56px 120px;gap:16px;align-items:center;padding:16px 0;border-bottom:1px solid var(--linija-tabela)}
.rang-red:last-child{border:0}
.mesto{font-family:var(--font-broj);font-size:22px;color:var(--sivi);text-align:center}
.prvi .mesto{color:var(--tekst)}
.pehar{width:34px;height:auto}
.ime{position:relative;display:inline-flex;align-items:center;gap:6px;justify-self:start;font-family:var(--font-d);font-size:22px;line-height:1.2;padding:4px 10px;isolation:isolate}
.plamencic svg{width:18px;height:24px;display:block;animation:treperi .9s ease-in-out infinite alternate}
.gori-p .ime-tekst{color:var(--gori-p-tekst);text-shadow:var(--gori-p-sjaj)}
.vatra{position:absolute;inset:-6px -4px 0;z-index:-1;pointer-events:none}
.vatra i{position:absolute;bottom:0;width:30%;height:120%;border-radius:50% 50% 35% 35%/65% 65% 35% 35%;background:radial-gradient(ellipse at 50% 85%,var(--vatra-1) 0%,var(--vatra-2) 45%,transparent 72%);filter:blur(2px);transform-origin:50% 100%;animation:plamti var(--t,1s) ease-in-out infinite alternate}
.vatra i:nth-child(1){left:-6%;--t:.9s;height:95%}.vatra i:nth-child(2){left:10%;--t:1.2s}.vatra i:nth-child(3){left:26%;--t:.8s;height:135%}.vatra i:nth-child(4){left:42%;--t:1.1s}.vatra i:nth-child(5){left:58%;--t:.95s;height:130%}.vatra i:nth-child(6){left:74%;--t:1.25s}.vatra i:nth-child(7){left:86%;--t:.85s;height:100%}
@keyframes plamti{0%{transform:scaleY(.82) skewX(-4deg);opacity:.75}100%{transform:scaleY(1.12) skewX(5deg);opacity:1}}
@keyframes treperi{0%{transform:scale(.92) rotate(-4deg)}100%{transform:scale(1.06) rotate(3deg)}}
.rang-merac{position:relative}
.proc{font-family:var(--font-broj);font-size:20px;text-align:right}
.rang-kcal{font-size:14px;color:var(--sivi);text-align:right}

/* telefon (uski ekran) */
@container ekran (max-width:640px){
  .traka{padding:0 14px;height:56px;gap:8px}
  .traka-ime span:last-child{display:none}
  .traka nav a{padding:0;width:40px;justify-content:center}
  .traka nav a span{display:none}
  .traka ul{gap:0}
  .sadrzaj{padding:14px;gap:14px}
  .panel{padding:16px}
  .pocetna{grid-template-columns:1fr}
  .datum{flex-direction:column;gap:0;align-items:center}
  .datum b{font-size:17px}
  .nedelja{gap:4px}
  .dan{padding:8px 0}
  .dan-br{font-size:18px}
  .dan-kcal{display:none}
  .makroi{gap:8px}
  .makro{flex-direction:column;align-items:center;text-align:center;padding:10px 6px;gap:8px}
  .makro .posuda{width:34px}
  .makro-br b{font-size:22px}
  .makro-ime{font-size:12px}
  .makro-cilj{font-size:11px}
  .reci-mis .mis{width:72px}
  .t-kol,.mak{display:none}
  .t-kol-mob{display:block;font-size:12px;color:var(--sivi)}
  .t-ime{display:flex;flex-direction:column}
  .tabela{font-size:14px}
  .tabela th,.tabela td{padding:8px 4px}
  .t-akcije{width:68px}
  .lab-uvod h1,.rang-uvod h1{font-size:30px}
  .lab-scena{grid-template-columns:1fr;gap:10px;min-height:0}
  .lab-mis{flex-direction:row;padding:0;justify-self:start}
  .lab-mis .mis-lab{width:130px}
  .lab-sto{padding-top:70px}
  .lab-posuda{width:200px}
  .lab-desno{min-height:0}
  .napitak-makroi dd{font-size:18px}
  .polica ul{grid-template-columns:1fr}
  .legenda{flex-direction:column;gap:6px}
  .rang-lista{padding:4px 14px}
  .rang-red{grid-template-columns:22px 28px 1fr 46px;grid-template-areas:"m p i c" ". . r r";gap:6px 10px;padding:12px 0}
  .mesto{grid-area:m;font-size:18px}.pehar{grid-area:p;width:28px}.ime{grid-area:i;font-size:18px}.proc{grid-area:c;font-size:17px}.rang-merac{grid-area:r}
  .rang-kcal{display:none}
  .pecat{width:104px;height:104px}
  .pecat img{width:44px}
}

/* miš u mantilu */
.mis-lab{display:grid;justify-items:center}
.mis-lab .mis{position:relative;z-index:1}
.mantil{display:block;width:100%;margin-top:-26%}
@keyframes upis{0%{transform:scale(0) rotate(-30deg)}100%{transform:scale(1)}}
@keyframes puls{50%{transform:scale(1.5);opacity:.5}}

@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation:none!important;transition:none!important}
  .tecnost i,.para span{display:none}
}
`

// ---------- index ----------
function index() {
  const kartica = (t) => `<article class="kartica" style="${t.indexBoje}">
    <div class="pregled"><iframe src="${t.fajl}" title="Pregled: ${t.naslov}" tabindex="-1"></iframe></div>
    <div class="tekst"><h2>${t.naslov}</h2><p>${t.kratko}</p>
    <ul class="trake">${t.paleta.slice(0, 7).map(([n, , h]) => `<li style="background:${h}" title="${n} ${h}"></li>`).join('')}</ul>
    <p class="fontovi">${t.fontovi.map((f) => f[1]).join(' · ')}</p>
    <a href="${t.fajl}">Otvori maketu →</a></div>
  </article>`
  return `<!doctype html>
<html lang="sr-Latn"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Laboratorija · tri pravca</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#e8ebe9;color:#141815;font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
header{max-width:1680px;margin:0 auto;padding:48px 24px 24px}h1{margin:0;font-size:clamp(32px,4vw,52px);line-height:1.05}
header p{max-width:70ch;color:#4b524d;margin:12px 0 0}
main{max-width:1680px;margin:0 auto;padding:0 24px 64px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.kartica{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 20px 50px -30px rgba(0,0,0,.4);display:flex;flex-direction:column}
.pregled{position:relative;aspect-ratio:1280/1180;overflow:hidden;background:var(--k-pod)}
.pregled iframe{position:absolute;top:0;left:0;width:1360px;height:1240px;border:0;transform-origin:0 0;pointer-events:none}
.tekst{padding:20px 22px 24px;display:grid;gap:12px}
.tekst h2{margin:0;font-size:24px}.tekst p{margin:0;color:#3b423d}
.trake{display:flex;margin:0;padding:0;list-style:none;height:18px;border-radius:6px;overflow:hidden}.trake li{flex:1}
.fontovi{font-size:13px;color:#5d655f!important}
.tekst a{justify-self:start;font-weight:700;color:#0f3d00;text-decoration-thickness:2px;text-underline-offset:4px}
@media (max-width:1100px){main{grid-template-columns:1fr}}
</style></head><body>
<header><h1>Mouse's tracker: tri pravca laboratorije</h1><p>Isti ekrani i isti brojevi (cilj 3&#8239;200 kcal, P 130–160 g, M 70–90 g), tri sveta. Otvori svaki da vidiš Početnu, Laboratoriju i Rang listu na računaru i telefonu, sa živim animacijama.</p></header>
<main>${teme.map(kartica).join('')}</main>
<script>
const skala = () => document.querySelectorAll('.pregled').forEach((p) => p.querySelector('iframe').style.transform = 'scale(' + p.clientWidth / 1360 + ')')
addEventListener('resize', skala); skala()
</script>
</body></html>
`
}

for (const t of teme) writeFileSync(join(OVDE, t.fajl), stranica(t))
writeFileSync(join(OVDE, 'index.html'), index())
console.log('dan pre:', PRE, 'posle:', POSLE, 'oznake jela:', oznake(JELO))
