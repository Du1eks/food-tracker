import Pehar from './Pehar'

// Žive makete za uputstvo: čist HTML/CSS u stilu sajta, bez pravih podataka i bez poziva ka bazi. Svaka maketa igra jednom
// kad se korak prikaže (animacije su u uputstvo.css, samo bez prefers-reduced-motion); bez animacije je prikazan završni kadar.
// --k je redni broj elementa, po njemu kasni pojavljivanje.
const k = (n: number) => ({ '--k': n }) as React.CSSProperties
const v = (o: Record<string, number | string>) => o as React.CSSProperties

// 1. Profil i cilj: polja se popune, pa se pojavi dnevni cilj
export function MaketaProfil() {
  return (
    <div className="um um-profil">
      <div className="um-polja">
        <span className="um-polje" style={k(0)}><small>Težina</small><b className="num">73 kg</b></span>
        <span className="um-polje" style={k(1)}><small>Visina</small><b className="num">177 cm</b></span>
        <span className="um-polje" style={k(2)}><small>Cilj</small><b>Bulk</b></span>
      </div>
      <div className="um-cilj" style={k(4)}>
        <small>Dnevni cilj</small>
        <b className="num">3.200 kcal</b>
        <span className="num">Proteini 150 g</span>
      </div>
    </div>
  )
}

// 2. Dodaj hranu: kuca se tekst, pa nastaju redovi pregleda
export function MaketaUnos() {
  return (
    <div className="um um-unos">
      <div className="um-pisi">
        <img src="/maskota/mis.webp" alt="" width={160} height={214} />
        <span className="um-tekst"><span>Pojeo sam 2 jaja i ovsene pahuljice</span></span>
      </div>
      <ul className="um-redovi">
        <li style={k(0)}><span>Jaja <small>2 kom</small></span><b className="num">144 kcal</b></li>
        <li style={k(1)}><span>Ovsene pahuljice <small>60 g</small></span><b className="num">228 kcal</b></li>
      </ul>
    </div>
  )
}

// 3. Epruveta: tečnost se puni do crte cilja i postane zlatna, kartice proteina i masti puknu
export function MaketaEpruveta() {
  return (
    <div className="um um-cev">
      <p className="um-cev-broj num"><b>3.050</b><small>/ 3.000 kcal</small></p>
      <div className="um-cev-staklo">
        <div className="um-cev-tecnost"><i /><i /><i /></div>
        <span className="um-cev-cilj" />
      </div>
      <div className="um-kartice">
        <span className="um-kartica um-kartica-p" style={k(0)}>Proteini <b className="num">152 g</b></span>
        <span className="um-kartica um-kartica-m" style={k(1)}>Masti <b className="num">81 g</b></span>
      </div>
    </div>
  )
}

// 4. Laboratorija: sastojci upadaju u jelo, jelo se posle bira na početnoj ("Uzmi svoje jelo")
export function MaketaLab() {
  return (
    <div className="um um-lab">
      <div className="um-sastojci">
        <span style={k(0)}>Piletina <small>150 g</small></span>
        <span style={k(1)}>Pirinač <small>80 g</small></span>
        <span style={k(2)}>Brokoli <small>100 g</small></span>
      </div>
      <div className="um-jelo" style={k(4)}>
        <span><b>Piletina sa pirinčem</b><small className="num">480 kcal</small></span>
        <span className="um-jelo-dugme">Uzmi</span>
      </div>
    </div>
  )
}

// 5. Kalendar i grafik: dani sa trakom do cilja i naslagani stubići makroa po nedelji
const DANI = [90, 100, 40, 100, 75, 0, 60, 100, 100, 55, 20, 0, 0, 0]
const STUBICI = [[40, 90, 25], [55, 100, 30], [20, 60, 15], [50, 110, 35], [45, 80, 28], [0, 0, 0], [35, 70, 20]]
export function MaketaKalendar() {
  return (
    <div className="um um-kal">
      <div className="um-mreza">
        {DANI.map((p, i) => (
          <span key={i} className="um-dan" style={{ ...k(i), '--p': `${p}%` } as React.CSSProperties}><b className="num">{i + 1}</b><i /></span>
        ))}
      </div>
      <div className="um-stubici">
        {STUBICI.map(([p, uh, m], i) => (
          <span key={i} className="um-stubic" style={k(i)}>
            {p + uh + m > 0 ? <>
              <i style={v({ '--h': m, '--b': 'var(--masti-boja)' })} />
              <i style={v({ '--h': uh, '--b': 'var(--uh-boja)' })} />
              <i style={v({ '--h': p, '--b': 'var(--proteini-boja)' })} />
            </> : <i className="um-prazan" />}
          </span>
        ))}
      </div>
    </div>
  )
}

// 6. Prijatelji i rang: rang za danas i strelica na ivici koja izvuče kartu sa mestom
export function MaketaRang() {
  return (
    <div className="um um-rang">
      <ul className="um-lista">
        <li style={k(0)}><b>1.</b><span>Marko</span><i style={v({ '--p': '100%' })} /></li>
        <li className="um-ja" style={k(1)}><b>2.</b><span>Ti</span><i style={v({ '--p': '83%' })} /></li>
        <li style={k(2)}><b>3.</b><span>Ana</span><i style={v({ '--p': '50%' })} /></li>
      </ul>
      <div className="um-strelica">
        <div className="um-karta">
          <Pehar vrsta="srebro" />
          <span><b className="num">2.</b> mesto među prijateljima</span>
        </div>
        <span className="um-tab" aria-hidden>›</span>
      </div>
    </div>
  )
}
