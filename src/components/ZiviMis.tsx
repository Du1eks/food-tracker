// Živi miš u panelu "Dodaj hranu": video miš iz mis-figura. App javlja stanje i događaje mozgu, a mozak bira klip
// po prioritetu (kratka reakcija > jede > slavi > ljut > spava > miruje).
import { useEffect, useRef } from 'react'
import { MisFigura } from 'mis-figura/react'
import { bezPokreta, useMozak } from './useMis'

export type StanjeMisa = {
  unosi: boolean // u polju je tekst ili pregled obroka: jede
  slavi: boolean // upravo upisano ili cilj ispunjen
  ljut: boolean // dugo nisi jeo (gladan)
  spava: boolean // noć
  greska: string // greška pri unosu: miš se kratko naljuti
  brojUnosa: number | null // null dok se unosi učitavaju; novi unos = miš grickne
}

export default function ZiviMis({ unosi, slavi, ljut, spava, greska, brojUnosa }: StanjeMisa) {
  const mozak = useMozak()
  useEffect(() => { mozak?.postavi({ unosi, cilj: slavi, gladan: ljut, noc: spava }) }, [mozak, unosi, slavi, ljut, spava])
  useEffect(() => { if (greska) mozak?.javi('greska') }, [mozak, greska])

  // Novi unos ručno preko + (upis iz poruke mišu ide u slavlje): miš grickne, pa se vraća na stanje koje traje
  const prosliBroj = useRef<number | null>(null)
  useEffect(() => {
    if (brojUnosa == null) return
    if (mozak && !slavi && prosliBroj.current != null && brojUnosa > prosliBroj.current) mozak.javi('novUnos')
    prosliBroj.current = brojUnosa
  }, [mozak, brojUnosa, slavi])

  if (!mozak) return <div className="maskota ziv" aria-hidden />
  return <MisFigura mozak={mozak} miran={bezPokreta()} className="maskota ziv" onClick={() => mozak.javi('klik')} />
}
