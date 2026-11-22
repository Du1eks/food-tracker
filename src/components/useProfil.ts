import { useOutletContext } from 'react-router'
import type { Profil } from '../lib/podaci'

export type OkvirKontekst = { profil: Profil | null; osveziProfil: () => Promise<void> }
export const useProfil = () => useOutletContext<OkvirKontekst>()
