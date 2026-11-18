// Pregled stavki koje je miš pročitao: količina, izbaci, izmena procene. Deli ga unos na početnoj (ReciMisu) i Kuhinja.
import { Pencil, X } from 'lucide-react'
import { fmt, poJedinici as izSnimka, uBroj, zaKolicinu, type Makrosi, type StavkaJela } from '../lib/ishrana'
import type { Stavka } from '../lib/razumi'

const POLJA = [['kcal', 'kcal'], ['proteini', 'P'], ['uh', 'UH'], ['masti', 'M']] as const
type Vrednosti = Record<keyof Makrosi, string>

// Red u pregledu: brojevi su tekst dok se kucaju.
// v su vrednosti po jedinici (na 100 g ili po komadu); menjaju se samo za procene, za proizvod iz baze važi baza.
export type RedPregleda = Stavka & { id: number; kol: string; v: Vrednosti; otvoren: boolean }

const dobar = (s: string) => s.trim() !== '' && Number.isFinite(uBroj(s)) && uBroj(s) >= 0
export const kolicina = (r: RedPregleda) => uBroj(r.kol)
const poJedinici = (r: RedPregleda): Makrosi =>
  r.izvor === 'baza' ? r : { kcal: uBroj(r.v.kcal), proteini: uBroj(r.v.proteini), uh: uBroj(r.v.uh), masti: uBroj(r.v.masti) }
export const ispravna = (r: RedPregleda) =>
  dobar(r.kol) && kolicina(r) > 0 && (r.izvor === 'baza' || POLJA.every(([k]) => dobar(r.v[k])))
const tekstBroja = (n: number) => String(n).replace('.', ',')

// Makrosi reda za upisanu količinu (snimak kao u unos)
export const makrosiReda = (r: RedPregleda) => zaKolicinu({ ...poJedinici(r), jedinica: r.jedinica }, kolicina(r))

export const uRed = (s: Stavka, id: number): RedPregleda => ({
  ...s, id, kol: tekstBroja(s.kolicina), otvoren: false,
  v: { kcal: tekstBroja(s.kcal), proteini: tekstBroja(s.proteini), uh: tekstBroja(s.uh), masti: tekstBroja(s.masti) },
})

// Stavka sačuvanog jela nosi vrednosti za količinu; pregled radi sa vrednostima po jedinici (Laboratorija i unos na početnoj)
export const izStavke = (s: StavkaJela, id: number) =>
  uRed({ ...s, ...izSnimka(s), obrok: null, izvor: s.proizvod_id ? 'baza' : 'procena' }, id)

export default function PregledStavki<R extends RedPregleda>({ redovi, izmeni, izbaci }: {
  redovi: R[]; izmeni: (id: number, izmena: Partial<R>) => void; izbaci: (id: number) => void
}) {
  return (
    <ul className="pregled-lista">
      {redovi.map((r, i) => {
        const m = ispravna(r) ? makrosiReda(r) : null
        const mera = r.jedinica === '100g' ? 'g' : 'kom'
        const procena = r.izvor === 'procena'
        return (
          <li key={r.id} style={{ '--i': i } as React.CSSProperties}>
            <span className="pregled-ime">
              <b>{r.ime}</b>
              <small className="num">
                <span className={`izvor ${r.izvor}`}>{procena ? 'procena' : 'iz baze'}</span>
                {m ? `${fmt(m.kcal)} kcal · P ${fmt(m.proteini)} · UH ${fmt(m.uh)} · M ${fmt(m.masti)}` : 'proveri brojeve'}
              </small>
            </span>
            <label className="pregled-kol">
              <span className="sr">Količina za {r.ime} ({mera})</span>
              <input className="unos mali num" inputMode="decimal" value={r.kol} aria-invalid={!(dobar(r.kol) && kolicina(r) > 0)}
                onChange={(e) => izmeni(r.id, { kol: e.target.value } as Partial<R>)} />
              <span aria-hidden>{mera}</span>
            </label>
            <span className="pregled-akcije">
              {procena && (
                <button type="button" className={`ikona${r.otvoren ? ' aktivna' : ''}`} aria-expanded={r.otvoren}
                  aria-label={`Izmeni vrednosti za ${r.ime}`} onClick={() => izmeni(r.id, { otvoren: !r.otvoren } as Partial<R>)}>
                  <Pencil size={18} aria-hidden />
                </button>
              )}
              <button type="button" className="ikona" aria-label={`Izbaci ${r.ime}`} onClick={() => izbaci(r.id)}>
                <X size={20} aria-hidden />
              </button>
            </span>
            {procena && r.otvoren && (
              <fieldset className="pregled-vrednosti">
                <legend className="tiho-tekst">{r.jedinica === '100g' ? 'Vrednosti na 100 g' : 'Vrednosti za 1 komad'}</legend>
                {POLJA.map(([k, naziv]) => (
                  <label key={k} className="polje">
                    <span>{naziv}</span>
                    <input className="unos mali num" inputMode="decimal" value={r.v[k]} aria-invalid={!dobar(r.v[k])}
                      onChange={(e) => izmeni(r.id, { v: { ...r.v, [k]: e.target.value } } as Partial<R>)} />
                  </label>
                ))}
              </fieldset>
            )}
          </li>
        )
      })}
    </ul>
  )
}
