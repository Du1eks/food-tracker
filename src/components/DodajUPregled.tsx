// Pregled na početnoj: ručno dodaj namirnicu koju je miš preskočio (ili si je zaboravio). Traži samo u našoj bazi;
// izabrana namirnica ide kao novi red u isti pregled, sa podrazumevanom količinom (100 g ili 1 komad) koju korisnik menja.
// shortcut: bez Open Food Facts i bez pravljenja novog proizvoda; za to postoji pun ručni unos ("Unesi ručno").
import { useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { fmt, type Proizvod } from '../lib/ishrana'
import { pretraziProizvode } from '../lib/podaci'
import type { Stavka } from '../lib/razumi'

export const izProizvoda = (p: Proizvod): Stavka => ({
  ime: p.brend ? `${p.ime} (${p.brend})` : p.ime, kolicina: p.jedinica === '100g' ? 100 : 1, jedinica: p.jedinica,
  obrok: null, izvor: 'baza', proizvod_id: p.id ?? null, kcal: p.kcal, proteini: p.proteini, uh: p.uh, masti: p.masti,
})

export default function DodajUPregled({ onDodaj }: { onDodaj: (s: Stavka) => void }) {
  const [otvoren, setOtvoren] = useState(false)
  const [upit, setUpit] = useState('')
  const [lista, setLista] = useState<Proizvod[] | null>(null)
  const [trazi, setTrazi] = useState(false)
  const [greska, setGreska] = useState('')

  const zatvori = () => { setOtvoren(false); setUpit(''); setLista(null); setGreska('') }

  async function pretrazi() {
    if (!upit.trim() || trazi) return
    setTrazi(true); setGreska('')
    try {
      setLista(await pretraziProizvode(upit.trim()))
    } catch {
      setGreska('Pretraga nije uspela. Proveri internet.')
    } finally {
      setTrazi(false)
    }
  }

  if (!otvoren)
    return (
      <button type="button" className="dugme tiho dodaj-u-pregled" onClick={() => setOtvoren(true)}>
        <Plus size={18} strokeWidth={2.5} aria-hidden /> Dodaj namirnicu
      </button>
    )

  return (
    <div className="dodaj-u-pregled-telo">
      {/* nije <form>: stoji unutar forme pregleda, pa Enter ne sme da pošalje "Upiši" */}
      <div className="pretraga" role="search">
        <label className="sr" htmlFor="dodaj-u-pregled">Pretraži namirnicu</label>
        <input id="dodaj-u-pregled" className="unos" type="search" placeholder="npr. jogurt, hleb…" autoComplete="off" autoFocus
          value={upit} onChange={(e) => setUpit(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void pretrazi() } if (e.key === 'Escape') zatvori() }} />
        <button type="button" className="plocica" aria-label="Traži" disabled={trazi} onClick={pretrazi}><Search size={20} strokeWidth={2.5} aria-hidden /></button>
        <button type="button" className="plocica svetla" aria-label="Zatvori pretragu" onClick={zatvori}><X size={20} aria-hidden /></button>
      </div>
      {trazi && <p className="tiho-tekst" role="status">Tražim…</p>}
      {greska && <p className="greska" role="alert">{greska}</p>}
      {lista && !trazi && (
        <div className="rezultati">
          {lista.length === 0 && <p className="prazno">Nema „{upit}“ u bazi. Dodaj ga preko „Unesi ručno“.</p>}
          <ul>
            {lista.map((p) => (
              <li key={p.id}>
                <button type="button" onClick={() => { onDodaj(izProizvoda(p)); zatvori() }}>
                  <span><b>{p.ime}</b>{p.brend && <small>{p.brend}</small>}</span>
                  <span className="num">{fmt(p.kcal)} kcal<small>{p.jedinica === '100g' ? 'na 100 g' : 'po komadu'}</small></span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
