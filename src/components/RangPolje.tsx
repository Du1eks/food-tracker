import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ChevronRight, Users } from 'lucide-react'
import { danas } from '../lib/datum'
import { zbirZaDan } from '../lib/podaci'
import { rang, staKaze, sufiksMesta, type Zbir } from '../lib/rang'
import { useProfil } from './useProfil'
import Pehar from './Pehar'
import '../pages/prijatelji.css'

// Polje ranga na glavnom ekranu; pehar mesta stoji na njegovoj levoj ivici (pada pri svakom dolasku na stranu).
// Ćaskanje o rangu bira ovde, a izgovara ga miš u svom oblačiću (onGovor).
// `kljuc` se menja posle svakog unosa (uneto kcal), pa se rang preračuna.
// 1. zlatni, 2. srebrni, 3. bronzani, dalje (i bez drugara) "drvo": mutan maslinast napitak (stakleni pehar: components/Pehar)
const pehar = (mesto: number, sam: boolean) => (sam ? 'drvo' : (['zlato', 'srebro', 'bronza'][mesto - 1] ?? 'drvo'))
const UDAR = 645 // ms od pojave do dodira sa zemljom (kašnjenje 150 ms + 55% od 900 ms u pehar-pad)
// Varnice pri udaru: lepeza naviše i u stranu iz dna pehara; nasumično jednom, da crtanje ostane čisto
const VARNICE = Array.from({ length: 22 }, (_, i) => ({
  ugao: -100 + (200 * i) / 21 + (Math.random() - 0.5) * 8, // stepeni od uspravno
  dalj: 55 + Math.random() * 70, duz: 16 + Math.random() * 16, kasni: Math.random() * 60,
}))

export default function RangPolje({ kljuc, onGovor }: { kljuc: number; onGovor: (recenica: string | null) => void }) {
  const { profil } = useProfil()
  const [redovi, setRedovi] = useState<Zbir[] | 'greska' | null>(null)
  const [udar, setUdar] = useState(false)
  const palo = useRef(false)

  useEffect(() => {
    let aktivan = true
    zbirZaDan(danas())
      .then((r) => aktivan && setRedovi(r))
      .catch(() => aktivan && setRedovi('greska'))
    return () => { aktivan = false }
  }, [kljuc])

  const r = Array.isArray(redovi) && profil ? rang(redovi, profil.id) : null
  const ja = Array.isArray(redovi) ? redovi.find((x) => x.id === profil?.id) : undefined
  const recenice = r && ja ? staKaze(r, ja) : []
  const recKljuc = recenice.join('|')

  // Nasumično ćaskanje: prvi put posle 2,5 s, pa na 9–16 s, oblačić stoji 4,5 s; ćuti dok je tab sakriven
  useEffect(() => {
    if (!recKljuc) return
    const lista = recKljuc.split('|')
    let sledeci: number, gasi: number
    const reci = () => {
      if (!document.hidden) {
        onGovor(lista[Math.floor(Math.random() * lista.length)])
        gasi = window.setTimeout(() => onGovor(null), 4500)
      }
      sledeci = window.setTimeout(reci, 9000 + Math.random() * 7000)
    }
    sledeci = window.setTimeout(reci, 2500)
    return () => { clearTimeout(sledeci); clearTimeout(gasi); onGovor(null) }
  }, [recKljuc, onGovor])

  // Pehar padne jednom po dolasku na stranu (ne dok si na njoj); u trenutku dodira varnice, talas i potres polja.
  // palo se postavlja tek kad tajmer okine, jer StrictMode u razvoju pokrene efekat dvaput.
  const vrsta = r ? pehar(r.mesto, r.ukupno === 1) : null
  useEffect(() => {
    if (!vrsta || palo.current) return
    const t1 = setTimeout(() => { palo.current = true; setUdar(true) }, UDAR)
    const t2 = setTimeout(() => setUdar(false), UDAR + 700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [vrsta])

  if (redovi === null) return <div className="rang-omot"><div className="rang" aria-hidden /></div>

  const sam = !r || r.ukupno === 1
  const procenat = Math.round(Number(ja?.procenat ?? 0) * 100)
  // Na polju je samo broj i kratak poziv; ceo opis ide čitaču ekrana
  const opis = sam
    ? 'Dodaj prijatelje i takmiči se ko bliže stiže do dnevnog cilja'
    : `Rang za danas: ${r.mesto}. mesto od ${r.ukupno}${profil?.cilj_kcal ? `, ${procenat}% dnevnog cilja` : ', postavi dnevni cilj u profilu'}. Pogledaj leaderboard`

  return (
    <div className={`rang-omot pehar-${vrsta ?? 'nema'}${udar ? ' udar' : ''}`}>
      {/* ukras, mesto je u opisu polja; bez ključa, pa novo mesto samo promeni sliku, bez novog pada */}
      {vrsta && <Pehar vrsta={vrsta} />}
      {udar && VARNICE.map((v, i) => (
        <span key={i} className="varnica" aria-hidden
          style={{ '--ugao': `${v.ugao}deg`, '--dalj': `${v.dalj}px`, height: v.duz, animationDelay: `${v.kasni}ms` } as React.CSSProperties} />
      ))}
      {redovi === 'greska' ? (
        <p className="rang rang-prazno">Rang trenutno nije dostupan.</p>
      ) : (
        <Link to="/prijatelji" className="rang" aria-label={opis}>
          {sam ? (
            <span className="plocica rang-mesto" aria-hidden><Users size={30} strokeWidth={2.5} /></span>
          ) : (
            <span key={r.mesto} className="rang-mesto num" aria-hidden>{r.mesto}<sup>{sufiksMesta(r.mesto)}</sup></span>
          )}
          <span className="rang-poziv" aria-hidden>{sam ? 'Dodaj prijatelje' : 'Pogledaj leaderboard'}</span>
          <span className="plocica rang-strelica" aria-hidden><ChevronRight size={22} strokeWidth={2.75} /></span>
        </Link>
      )}
    </div>
  )
}
