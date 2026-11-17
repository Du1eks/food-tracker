// Na ostalim stranicama (ne na danu) miš proviri sa ivice ekrana i gleda te; strana zavisi od stranice, naizmenično po redu ikonica
// u zaglavlju (kalendar desno, namirnice levo, prijatelji desno, profil levo), pa pri prelasku miš pređe na drugu stranu.
// Miš se prevlači gore-dole duž ivice (mišem, prstom ili strelicama) i ostaje tu i na drugim stranicama.
// Klik: miš kaže nasumičnu rečenicu (ne istu dvaput zaredom): o cilju za danas i o stranici na kojoj si.
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { danas } from '../lib/datum'
import { zbir } from '../lib/ishrana'
import { unosiZaDan } from '../lib/podaci'
import { stanjeMisa, type CiljMisa } from '../lib/rang'

const GOVORI = 4000 // ms koliko oblačić stoji
const POMAK_ZA_KLIK = 6 // px: manji pomak je klik, veći je prevlačenje
let zapamcenVrh: number | null = null // gde je miš ostavljen, dok je aplikacija otvorena
// Vrh miša (px) ne sme ispod zaglavlja (56 px) ni ispod dna ekrana
const uEkranu = (vrh: number, visina: number) => Math.max(64, Math.min(window.innerHeight - visina - 8, vrh))
const SA_LEVE = /^\/(namirnice|profil|prijatelji\/.)/ // profil prijatelja levo, njegov spisak desno

const NIJE_ISPUNJEN = [
  'Jedi nešto, mišu!', 'Stomak mi kruli, a nije moj.', 'Cilj te čeka na početnoj.', 'Mišić se ne gradi na praznom stomaku.',
  'Ajde, još par zalogaja do cilja.', 'Proteini se sami neće pojesti.', 'Gladan miš je ljut miš.',
]
const ISPUNJEN = [
  'Svaka čast, nisi miš!', 'Cilj pogođen. Mljac!', 'Danas si pravi lav, ne miš.', 'Mišić ti klima glavom.',
  'E ovako se jede!', 'Sit si, ponosan sam.',
]
// Rečenice po stranici (prvi deo putanje)
const PO_STRANI: Record<string, string[]> = {
  kalendar: ['Gledam koliko si dana bio miš.', 'Zelena traka je dobra traka.', 'Svaki pun dan je mala pobeda.'],
  namirnice: ['Ovde mirišem sve namirnice.', 'Sir je takođe protein. Samo kažem.', 'Traži nešto sa puno proteina.'],
  prijatelji: ['Ko je danas miš, a ko nije?', 'Prestigni ih. Ja navijam za tebe.', 'Drugari jedu. Ti si na potezu.'],
  profil: ['Lepo izgledaš danas.', 'Cilj postavi realno, ja ću te terati.', 'Proveri da li su ti brojevi tačni.'],
}
let poslednja = ''
function recenica(ispunjen: boolean, putanja: string) {
  const lista = [...(ispunjen ? ISPUNJEN : NIJE_ISPUNJEN), ...(PO_STRANI[putanja.split('/')[1]] ?? [])].filter((r) => r !== poslednja)
  poslednja = lista[Math.floor(Math.random() * lista.length)]
  return poslednja
}

export default function MisViri({ cilj }: { cilj: CiljMisa | null }) {
  const [ispunjen, setIspunjen] = useState(false)
  const [kaze, setKaze] = useState<string | null>(null)
  const [vrh, setVrh] = useState(zapamcenVrh)
  const vuce = useRef<{ y: number; vrh: number; pomeren: boolean } | null>(null)
  const putanja = useLocation().pathname
  const levo = SA_LEVE.test(putanja)
  const reci = () => setKaze(recenica(ispunjen, putanja))

  useEffect(() => {
    let aktivan = true
    unosiZaDan(danas())
      .then((u) => aktivan && setIspunjen(stanjeMisa(zbir(u), cilj, new Date(), null).slavi))
      .catch(() => {}) // bez interneta miš samo kaže da jedeš
    return () => { aktivan = false }
  }, [cilj])

  useEffect(() => {
    if (!kaze) return
    const t = setTimeout(() => setKaze(null), GOVORI)
    return () => clearTimeout(t)
  }, [kaze])

  const pomeri = (novi: number, dugme: HTMLElement) => {
    const v = uEkranu(novi, dugme.offsetHeight)
    zapamcenVrh = v
    setVrh(v)
  }

  return (
    <div className={`mis-viri${levo ? ' levo' : ''}`} style={vrh == null ? undefined : { top: vrh }}>
      <p key={kaze} className="mis-viri-oblacic" role="status" hidden={!kaze}>{kaze}</p>
      <button type="button" className="mis-viri-dugme" aria-label="Miš viri sa ivice. Klikni da ti nešto kaže, prevuci ili strelicama pomeri gore-dole."
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          vuce.current = { y: e.clientY, vrh: e.currentTarget.getBoundingClientRect().top, pomeren: false }
        }}
        onPointerMove={(e) => {
          const v = vuce.current
          if (!v) return
          if (Math.abs(e.clientY - v.y) > POMAK_ZA_KLIK) v.pomeren = true
          if (v.pomeren) pomeri(v.vrh + e.clientY - v.y, e.currentTarget)
        }}
        onPointerUp={() => { if (vuce.current && !vuce.current.pomeren) reci(); vuce.current = null }}
        onPointerCancel={() => { vuce.current = null }}
        onKeyDown={(e) => {
          if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
          e.preventDefault()
          pomeri(e.currentTarget.getBoundingClientRect().top + (e.key === 'ArrowUp' ? -24 : 24), e.currentTarget)
        }}
        onClick={(e) => { if (e.detail === 0) reci() }}>
        {levo ? <img src="/maskota/viri-levo.webp" alt="" width={400} height={420} /> : <img src="/maskota/viri.webp" alt="" width={411} height={420} />}
      </button>
    </div>
  )
}
