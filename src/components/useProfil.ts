import { useOutletContext } from 'react-router'
import type { Profil } from '../lib/podaci'
import type { Zbir } from '../lib/rang'

// rang: današnji zbirovi ja + prijatelji (null dok se učitava); Okvir ih drži jer rang stoji u gornjoj traci na svakoj strani,
// a početna javlja osveziRang() posle svakog unosa.
export type OkvirKontekst = {
  profil: Profil | null
  osveziProfil: () => Promise<void>
  rang: Zbir[] | 'greska' | null
  osveziRang: () => void
}
export const useProfil = () => useOutletContext<OkvirKontekst>()
