import { OBROCI, fmt, zbir } from '../lib/ishrana'
import type { PrijateljUnos } from '../lib/podaci'

const kol = (u: PrijateljUnos) => `${fmt(u.kolicina)} ${u.jedinica === '100g' ? 'g' : 'kom'}`

// Dan prijatelja, samo za čitanje: grupe po obroku kao u TabelaDana, bez izmene i brisanja.
// Klase su iste kao u TabelaDana (dan.css), pa tabela izgleda isto i na telefonu.
export default function TabelaPrijatelja({ unosi }: { unosi: PrijateljUnos[] }) {
  const ukupno = zbir(unosi)
  return (
    <table className="tabela num">
      <thead>
        <tr><th scope="col">Namirnica</th><th scope="col">Količina</th><th scope="col">kcal</th><th scope="col" className="mak">P</th><th scope="col" className="mak">UH</th><th scope="col" className="mak">M</th></tr>
      </thead>
      {OBROCI.map((o) => {
        const grupa = unosi.filter((u) => u.obrok === o.id)
        if (!grupa.length) return null
        return (
          <tbody key={o.id}>
            <tr className="grupa"><th scope="rowgroup" colSpan={2}>{o.naziv}</th><td colSpan={4}>{fmt(zbir(grupa).kcal)} kcal</td></tr>
            {grupa.map((u, i) => (
              <tr key={i} className="red">
                <td>{u.ime}<small className="mak-mob">P {fmt(u.proteini)} · UH {fmt(u.uh)} · M {fmt(u.masti)}</small></td>
                <td>{kol(u)}</td>
                <td>{fmt(u.kcal)}</td>
                <td className="mak">{fmt(u.proteini)}</td>
                <td className="mak">{fmt(u.uh)}</td>
                <td className="mak">{fmt(u.masti)}</td>
              </tr>
            ))}
          </tbody>
        )
      })}
      <tfoot>
        <tr>
          <th scope="row" colSpan={2}>Ukupno</th>
          <td>{fmt(ukupno.kcal)}<small className="jed-mob">kcal</small></td>
          <td className="mak">{fmt(ukupno.proteini)}</td><td className="mak">{fmt(ukupno.uh)}</td><td className="mak">{fmt(ukupno.masti)}</td>
        </tr>
      </tfoot>
    </table>
  )
}
