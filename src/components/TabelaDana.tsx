import { useState } from 'react'
import { Check, ChevronDown, Pencil, Plus, Trash2, X } from 'lucide-react'
import { OBROCI, fmt, poJedinici, skaliraj, uBroj, zaKolicinu, zbir, type Makrosi, type Unos } from '../lib/ishrana'
import { dodajProizvod, izmeniUnos, obrisiUnos } from '../lib/podaci'

const kol = (u: Unos) => `${fmt(u.kolicina)} ${u.jedinica === '100g' ? 'g' : 'kom'}`
const POLJA = [['kcal', 'kcal'], ['proteini', 'P'], ['uh', 'UH'], ['masti', 'M']] as const
type Vrednosti = Record<keyof Makrosi, string>
const dobar = (s: string) => s.trim() !== '' && Number.isFinite(uBroj(s)) && uBroj(s) >= 0
const tekst = (n: number) => String(n).replace('.', ',')

export default function TabelaDana({ unosi, onPromena }: { unosi: Unos[] | null; onPromena: () => void }) {
  const [menja, setMenja] = useState<string | null>(null)
  const [nova, setNova] = useState('')
  // Vrednosti po jedinici dok se menjaju; null = unos je iz baze, menja se samo količina
  const [v, setV] = useState<Vrednosti | null>(null)
  const [zauzet, setZauzet] = useState(false)
  const [greska, setGreska] = useState('')
  const [zatvoreni, setZatvoreni] = useState<string[]>([])

  if (!unosi) return <p className="tiho-tekst" role="status">Učitavam unose…</p>
  if (unosi.length === 0)
    return (
      <div className="prazno-dan">
        <p><b>Još nema unosa za ovaj dan.</b></p>
        <p>Napiši mišu šta si jeo, pa se ovde pojavljuje sa zbirom.</p>
      </div>
    )

  async function radi(posao: () => Promise<void>) {
    if (zauzet) return
    setGreska(''); setZauzet(true)
    try {
      await posao()
      setMenja(null)
      onPromena()
    } catch {
      setGreska('Promena nije sačuvana. Proveri internet pa pokušaj ponovo.')
    } finally {
      setZauzet(false)
    }
  }

  function otvori(u: Unos) {
    setMenja(u.id); setNova(tekst(u.kolicina)); setGreska('')
    const p = poJedinici(u)
    setV(u.proizvod_id ? null : { kcal: tekst(p.kcal), proteini: tekst(p.proteini), uh: tekst(p.uh), masti: tekst(p.masti) })
  }

  function sacuvaj(u: Unos) {
    const k = uBroj(nova)
    if (!(k > 0)) return setGreska('Količina mora biti veća od nule.')
    if (!v) return radi(() => izmeniUnos(u.id, { ...skaliraj(u, k), kolicina: k }))
    if (!POLJA.every(([p]) => dobar(v[p]))) return setGreska('Vrednosti moraju biti brojevi, nula ili više.')
    const p = { kcal: uBroj(v.kcal), proteini: uBroj(v.proteini), uh: uBroj(v.uh), masti: uBroj(v.masti) }
    radi(() => izmeniUnos(u.id, { ...zaKolicinu({ ...p, jedinica: u.jedinica }, k), kolicina: k }))
  }

  // Procena postaje proizvod u zajedničkoj bazi, a unos se veže za njega (sledeći put miš je uzima "iz baze")
  const uBazu = (u: Unos) => radi(async () => {
    const p = await dodajProizvod({ ime: u.ime, brend: null, jedinica: u.jedinica, ...poJedinici(u) })
    await izmeniUnos(u.id, { proizvod_id: p.id! })
  })

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
            <tbody key={o.id} className={zatvoreni.includes(o.id) ? 'zatvoren' : undefined}>
              <tr className="grupa"><th scope="rowgroup" colSpan={2}>
                {/* Skupljanje radi samo na telefonu (CSS); na računaru je dugme bez efekta */}
                <button type="button" className="grupa-dugme" aria-expanded={!zatvoreni.includes(o.id)}
                  onClick={() => setZatvoreni(zatvoreni.includes(o.id) ? zatvoreni.filter((x) => x !== o.id) : [...zatvoreni, o.id])}>
                  {o.naziv}<ChevronDown size={18} strokeWidth={2.75} aria-hidden />
                </button>
              </th><td colSpan={5}>{fmt(zbir(grupa).kcal)} kcal</td></tr>
              {grupa.flatMap((u) => [
                <tr key={u.id} className="red">
                  <td>
                    {u.ime}
                    {!u.proizvod_id && menja !== u.id && (
                      <button type="button" className="izvor u-bazu" disabled={zauzet} aria-label={`Sačuvaj ${u.ime} u bazu namirnica`} onClick={() => uBazu(u)}>
                        <Plus size={13} strokeWidth={3} aria-hidden />U bazu
                      </button>
                    )}
                    <small className="mak-mob">P {fmt(u.proteini)} · UH {fmt(u.uh)} · M {fmt(u.masti)}</small>
                  </td>
                  <td>
                    {menja === u.id ? (
                      <input className="unos mali num" inputMode="decimal" aria-label={`Nova količina za ${u.ime}`} value={nova} autoFocus
                        aria-invalid={!(uBroj(nova) > 0)}
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
                        <button className="ikona" aria-label="Sačuvaj izmenu" disabled={zauzet} onClick={() => sacuvaj(u)}><Check size={18} aria-hidden /></button>
                        <button className="ikona" aria-label="Otkaži izmenu" onClick={() => setMenja(null)}><X size={18} aria-hidden /></button>
                      </>
                    ) : (
                      <>
                        <button className="ikona" aria-label={`Izmeni ${u.ime}`} onClick={() => otvori(u)}><Pencil size={18} aria-hidden /></button>
                        <button className="ikona" aria-label={`Obriši ${u.ime}`} disabled={zauzet} onClick={() => radi(() => obrisiUnos(u.id))}><Trash2 size={18} aria-hidden /></button>
                      </>
                    )}
                  </td>
                </tr>,
                menja === u.id && v && (
                  <tr key={`${u.id}-v`} className="red-vrednosti">
                    <td colSpan={7}>
                      <fieldset className="pregled-vrednosti">
                        <legend className="tiho-tekst">{u.jedinica === '100g' ? 'Vrednosti na 100 g' : 'Vrednosti za 1 komad'}</legend>
                        {POLJA.map(([k, naziv]) => (
                          <label key={k} className="polje">
                            <span>{naziv}</span>
                            <input className="unos mali num" inputMode="decimal" value={v[k]} aria-invalid={!dobar(v[k])}
                              onChange={(e) => setV({ ...v, [k]: e.target.value })}
                              onKeyDown={(e) => { if (e.key === 'Enter') sacuvaj(u); if (e.key === 'Escape') setMenja(null) }} />
                          </label>
                        ))}
                      </fieldset>
                    </td>
                  </tr>
                ),
              ])}
            </tbody>
          )
        })}
        <tfoot>
          <tr>
            <th scope="row" colSpan={2}>Ukupno</th>
            <td>{fmt(ukupno.kcal)}<small className="jed-mob">kcal</small></td>
            <td className="mak">{fmt(ukupno.proteini)}</td><td className="mak">{fmt(ukupno.uh)}</td><td className="mak">{fmt(ukupno.masti)}</td>
            {/* Na telefonu kolone P/UH/M nema, pa zbir proteina stoji u slobodnoj koloni akcija, pored kcal */}
            <td className="p-mob"><span>{fmt(ukupno.proteini)}<small className="jed-mob">g proteina</small></span></td>
          </tr>
        </tfoot>
      </table>
    </>
  )
}
