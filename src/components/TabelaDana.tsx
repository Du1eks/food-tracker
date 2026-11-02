import { useState } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import { OBROCI, fmt, skaliraj, zbir, type Unos } from '../lib/ishrana'
import { izmeniUnos, obrisiUnos } from '../lib/podaci'

const kol = (u: Unos) => `${fmt(u.kolicina)} ${u.jedinica === '100g' ? 'g' : 'kom'}`

export default function TabelaDana({ unosi, onPromena }: { unosi: Unos[] | null; onPromena: () => void }) {
  const [menja, setMenja] = useState<string | null>(null)
  const [nova, setNova] = useState('')
  const [greska, setGreska] = useState('')

  if (!unosi) return <p className="tiho-tekst" role="status">Učitavam unose…</p>
  if (unosi.length === 0)
    return (
      <div className="prazno-dan">
        <p><b>Još nema unosa za ovaj dan.</b></p>
        <p>Potraži namirnicu i dodaj je, pa se ovde pojavljuje sa zbirom.</p>
      </div>
    )

  async function radi(posao: () => Promise<void>) {
    setGreska('')
    try {
      await posao()
      setMenja(null)
      onPromena()
    } catch {
      setGreska('Promena nije sačuvana. Proveri internet pa pokušaj ponovo.')
    }
  }

  function sacuvaj(u: Unos) {
    const k = Number(nova.replace(',', '.'))
    if (!(k > 0)) return setGreska('Količina mora biti veća od nule.')
    radi(() => izmeniUnos(u.id, { ...skaliraj(u, k), kolicina: k }))
  }

  const ukupno = zbir(unosi)
  return (
    <>
      {greska && <p className="greska" role="alert">{greska}</p>}
      <table className="tabela num">
        <thead>
          <tr><th scope="col">Namirnica</th><th scope="col">Količina</th><th scope="col">kcal</th><th scope="col" className="mak">P</th><th scope="col" className="mak">UH</th><th scope="col" className="mak">M</th><th scope="col"><span className="sr">Akcije</span></th></tr>
        </thead>
        {OBROCI.map((o) => {
          const grupa = unosi.filter((u) => u.obrok === o.id)
          if (!grupa.length) return null
          return (
            <tbody key={o.id}>
              <tr className="grupa"><th scope="rowgroup" colSpan={2}>{o.naziv}</th><td colSpan={5}>{fmt(zbir(grupa).kcal)} kcal</td></tr>
              {grupa.map((u) => (
                <tr key={u.id} className="red">
                  <td>{u.ime}<small className="mak-mob">P {fmt(u.proteini)} · UH {fmt(u.uh)} · M {fmt(u.masti)}</small></td>
                  <td>
                    {menja === u.id ? (
                      <input className="unos mali num" inputMode="decimal" aria-label={`Nova količina za ${u.ime}`} value={nova} autoFocus
                        onChange={(e) => setNova(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') sacuvaj(u); if (e.key === 'Escape') setMenja(null) }} />
                    ) : kol(u)}
                  </td>
                  <td>{fmt(u.kcal)}</td>
                  <td className="mak">{fmt(u.proteini)}</td>
                  <td className="mak">{fmt(u.uh)}</td>
                  <td className="mak">{fmt(u.masti)}</td>
                  <td className="akcije">
                    {menja === u.id ? (
                      <>
                        <button className="ikona" aria-label="Sačuvaj količinu" onClick={() => sacuvaj(u)}><Check size={18} aria-hidden /></button>
                        <button className="ikona" aria-label="Otkaži izmenu" onClick={() => setMenja(null)}><X size={18} aria-hidden /></button>
                      </>
                    ) : (
                      <>
                        <button className="ikona" aria-label={`Izmeni ${u.ime}`} onClick={() => { setMenja(u.id); setNova(String(u.kolicina)) }}><Pencil size={18} aria-hidden /></button>
                        <button className="ikona" aria-label={`Obriši ${u.ime}`} onClick={() => radi(() => obrisiUnos(u.id))}><Trash2 size={18} aria-hidden /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )
        })}
        <tfoot>
          <tr><th scope="row" colSpan={2}>Ukupno</th><td>{fmt(ukupno.kcal)}</td><td className="mak">{fmt(ukupno.proteini)}</td><td className="mak">{fmt(ukupno.uh)}</td><td className="mak">{fmt(ukupno.masti)}</td><td /></tr>
        </tfoot>
      </table>
    </>
  )
}
