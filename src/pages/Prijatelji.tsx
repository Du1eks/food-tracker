import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Check, ChevronRight, Search, UserPlus, Users, X } from 'lucide-react'
import { danas } from '../lib/datum'
import { fmt } from '../lib/ishrana'
import {
  NADIMAK_PORUKA, mojiZahtevi, nadimakIspravan, nadjiPoNadimku, posaljiZahtev, prihvatiZahtev, ukloniPrijateljstvo, zbirZaDan,
  type Zahtev,
} from '../lib/podaci'
import { mesto, poRangu, type Zbir } from '../lib/rang'
import { useProfil } from '../components/useProfil'
import './dan.css'
import './prijatelji.css'

const GRESKA = 'Ne mogu da završim akciju. Proveri internet pa probaj ponovo.'

export default function Prijatelji() {
  const { profil } = useProfil()
  const [zbirovi, setZbirovi] = useState<Zbir[] | null>(null)
  const [zahtevi, setZahtevi] = useState<Zahtev[]>([])
  const [greska, setGreska] = useState('')

  const osvezi = useCallback(async () => {
    try {
      const [z, h] = await Promise.all([zbirZaDan(danas()), mojiZahtevi()])
      setZbirovi(z); setZahtevi(h); setGreska('')
    } catch {
      setGreska('Ne mogu da učitam prijatelje. Proveri internet pa osveži stranicu.')
    }
  }, [])

  useEffect(() => {
    osvezi()
  }, [osvezi])

  // Akcija nad zahtevom; posle nje se sve učita iznova (baza je izvor istine)
  const radnja = (posao: () => Promise<void>) => async () => {
    try {
      await posao()
      await osvezi()
    } catch {
      setGreska(GRESKA)
    }
  }

  const dolazni = zahtevi.filter((z) => z.status === 'na_cekanju' && !z.poslao_sam)
  const poslati = zahtevi.filter((z) => z.status === 'na_cekanju' && z.poslao_sam)

  return (
    <>
      <div className="dan-red"><h1>Prijatelji</h1></div>
      <main className="dan prijatelji">
        <div className="prijatelji-levo">
          {profil && !profil.nadimak && (
            <p className="poruka">
              Postavi nadimak u <Link to="/profil">profilu</Link> da te prijatelji mogu naći.
            </p>
          )}
          {greska && <p className="greska" role="alert">{greska}</p>}
          <Trazi zahtevi={zahtevi} onPoslato={osvezi} />
          {(dolazni.length > 0 || poslati.length > 0) && (
            <section className="panel" aria-labelledby="zahtevi-naslov">
              <h2 id="zahtevi-naslov" className="panel-glava"><span className="plocica svetla" aria-hidden><UserPlus size={20} strokeWidth={2.5} /></span>Zahtevi</h2>
              <ul className="lista">
                {dolazni.map((z) => (
                  <li key={z.drugi_id}>
                    <span><b>{z.drugi_nadimak}</b><small>želi da ti bude prijatelj</small></span>
                    <span className="lista-akcije">
                      <button className="plocica" aria-label={`Prihvati ${z.drugi_nadimak}`} onClick={radnja(() => prihvatiZahtev(z.drugi_id))}><Check size={20} strokeWidth={2.75} /></button>
                      <button className="plocica svetla" aria-label={`Odbij ${z.drugi_nadimak}`} onClick={radnja(() => ukloniPrijateljstvo(z.drugi_id))}><X size={20} strokeWidth={2.75} /></button>
                    </span>
                  </li>
                ))}
                {poslati.map((z) => (
                  <li key={z.drugi_id}>
                    <span><b>{z.drugi_nadimak}</b><small>čeka odgovor</small></span>
                    <button className="dugme tiho" onClick={radnja(() => ukloniPrijateljstvo(z.drugi_id))}>Povuci</button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <section className="dan-tabela" aria-labelledby="rang-naslov">
          <h2 id="rang-naslov" className="rang-naslov">Rang za danas</h2>
          <p className="tiho-tekst">Ko je bliže dnevnom cilju kalorija (do 100%).</p>
          {zbirovi === null ? (
            greska ? null : <p className="tiho-tekst" role="status">Učitavam…</p>
          ) : (
            <>
              <ol className="rang-lista">
                {poRangu(zbirovi).map((r) => {
                  const ja = r.id === profil?.id
                  const pct = Math.round(r.procenat * 100)
                  const sadrzaj = (
                    <>
                      <span className="rang-red-mesto num">{mesto(zbirovi, r)}.</span>
                      <span className="rang-red-ime">
                        <b>{ja ? 'Ti' : r.nadimak}</b>
                        <span className="merac" aria-hidden><i style={{ width: `${pct}%` }} /></span>
                      </span>
                      <span className="rang-red-broj num"><b>{pct}%</b><small>{fmt(r.kcal)} kcal</small></span>
                      {!ja && <ChevronRight size={20} aria-hidden />}
                    </>
                  )
                  return (
                    <li key={r.id} className={ja ? 'ja' : undefined}>
                      {ja ? <div className="rang-red">{sadrzaj}</div> : <Link className="rang-red" to={`/prijatelji/${r.id}`}>{sadrzaj}</Link>}
                    </li>
                  )
                })}
              </ol>
              {zbirovi.length === 1 && (
                <p className="prazno-dan tiho-tekst"><Users size={20} aria-hidden /> Još nemaš prijatelja. Nađi ih po nadimku.</p>
              )}
            </>
          )}
        </section>
      </main>
    </>
  )
}

function Trazi({ zahtevi, onPoslato }: { zahtevi: Zahtev[]; onPoslato: () => Promise<void> }) {
  const [upit, setUpit] = useState('')
  const [nadjen, setNadjen] = useState<{ id: string; nadimak: string } | 'nema' | null>(null)
  const [greska, setGreska] = useState('')
  const [radi, setRadi] = useState(false)

  async function trazi(e: React.FormEvent) {
    e.preventDefault()
    setNadjen(null); setGreska('')
    if (!nadimakIspravan(upit)) return setGreska(NADIMAK_PORUKA)
    setRadi(true)
    try {
      setNadjen((await nadjiPoNadimku(upit)) ?? 'nema')
    } catch {
      setGreska(GRESKA)
    }
    setRadi(false)
  }

  async function posalji(id: string) {
    setRadi(true); setGreska('')
    try {
      await posaljiZahtev(id)
      setNadjen(null); setUpit('')
      await onPoslato()
    } catch {
      setGreska(GRESKA)
    }
    setRadi(false)
  }

  const odnos = nadjen && nadjen !== 'nema' ? zahtevi.find((z) => z.drugi_id === nadjen.id) : undefined

  return (
    <section className="panel" aria-labelledby="trazi-naslov">
      <h2 id="trazi-naslov" className="panel-glava"><span className="plocica svetla" aria-hidden><Search size={20} strokeWidth={2.5} /></span>Dodaj prijatelja</h2>
      <div className="panel-telo">
        <form className="pretraga" onSubmit={trazi}>
          <input className="unos" aria-label="Nadimak prijatelja" placeholder="Nadimak (tačno kako je upisan)" maxLength={20} value={upit} onChange={(e) => setUpit(e.target.value)} />
          <button className="plocica" type="submit" aria-label="Traži" disabled={radi}><Search size={22} strokeWidth={2.5} /></button>
        </form>
        {greska && <p className="greska" role="alert">{greska}</p>}
        {nadjen === 'nema' && <p className="tiho-tekst" role="status">Nema korisnika sa tim nadimkom.</p>}
        {nadjen && nadjen !== 'nema' && (
          <div className="izabran">
            <span><b>{nadjen.nadimak}</b>
              {odnos && <small>{odnos.status === 'prihvaceno' ? 'Već ste prijatelji' : odnos.poslao_sam ? 'Zahtev je poslat' : 'Čeka tvoj odgovor u Zahtevima'}</small>}
            </span>
            {!odnos && (
              <button className="dugme" onClick={() => posalji(nadjen.id)} disabled={radi}>
                Pošalji zahtev
                <span className="plocica" aria-hidden><UserPlus size={20} strokeWidth={2.5} /></span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
