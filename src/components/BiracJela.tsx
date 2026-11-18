// Unos na početnoj: dugme "Moja jela" otvara spisak sačuvanih jela iz Laboratorije (sa pretragom, jer ih može biti mnogo).
// Izabrano jelo ide u pregled ReciMisu. Native <dialog>: fokus ostaje u njemu, Escape i klik van zatvaraju.
import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { FlaskConical, Search, X } from 'lucide-react'
import { fmt, zbir, type Jelo } from '../lib/ishrana'
import './moja-jela.css'

export default function BiracJela({ jela, onIzaberi }: { jela: Jelo[]; onIzaberi: (j: Jelo) => void }) {
  const dijalog = useRef<HTMLDialogElement>(null)
  const [upit, setUpit] = useState('')

  if (!jela.length) return <Link to="/kuhinja" className="moja-jela-link"><FlaskConical size={18} aria-hidden /> Napravi jelo u Laboratoriji</Link>

  const nadjena = jela.filter((j) => j.ime.toLowerCase().includes(upit.trim().toLowerCase()))
  const izaberi = (j: Jelo) => { dijalog.current?.close(); onIzaberi(j) }

  return (
    <>
      <button type="button" className="dugme moja-jela-dugme"
        onClick={() => { setUpit(''); dijalog.current?.showModal() }}>
        <span className="unos-izbor-tekst"><FlaskConical size={22} aria-hidden /> Uzmi svoje jelo</span>
        <span className="moja-jela-broj num" aria-label={`${jela.length} sačuvanih`}>{jela.length}</span>
      </button>
      {/* klik na pozadinu (sam <dialog>, ne njegov sadržaj) zatvara */}
      <dialog ref={dijalog} className="moja-jela-dijalog" aria-labelledby="moja-jela-naslov"
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close() }}>
        <div className="panel-glava">
          <h2 id="moja-jela-naslov">Moja jela</h2>
          <button type="button" className="plocica svetla" aria-label="Zatvori" onClick={() => dijalog.current?.close()}>
            <X size={22} strokeWidth={2.5} aria-hidden />
          </button>
        </div>
        <div className="moja-jela-telo">
          {jela.length > 5 && (
            <label className="moja-jela-trazi">
              <Search size={18} aria-hidden />
              <span className="sr">Traži jelo</span>
              <input className="unos" placeholder="Traži po imenu" value={upit} onChange={(e) => setUpit(e.target.value)} />
            </label>
          )}
          {nadjena.length ? (
            <ul>
              {nadjena.map((j) => {
                const z = zbir(j.stavke)
                return (
                  <li key={j.id}>
                    <button type="button" className="moje-jelo" onClick={() => izaberi(j)}>
                      <span className="moje-jelo-ime"><b>{j.ime}</b><small>{j.stavke.map((s) => s.ime).join(', ')}</small></span>
                      <span className="moje-jelo-brojevi num">
                        <b>{fmt(z.kcal)} kcal</b>
                        <small>P {fmt(z.proteini)} · UH {fmt(z.uh)} · M {fmt(z.masti)}</small>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : <p className="tiho-tekst">Nema jela sa tim imenom.</p>}
          <Link to="/kuhinja" className="moja-jela-link"><FlaskConical size={18} aria-hidden /> Napravi novo jelo u Laboratoriji</Link>
        </div>
      </dialog>
    </>
  )
}
