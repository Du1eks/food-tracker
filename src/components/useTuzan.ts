import { useEffect, useState } from 'react'
import { danas } from '../lib/datum'
import { poslednjiUnos } from '../lib/podaci'
import { tuzan } from '../lib/rang'

// Da li je miš tužan (3 dana bez unosa). `kljuc` se menja posle unosa, pa se ponovo pita baza.
export function useTuzan(kljuc: unknown): boolean {
  const [t, setT] = useState(false)
  useEffect(() => {
    let aktivan = true
    poslednjiUnos()
      .then((d) => aktivan && setT(tuzan(d, danas())))
      .catch(() => {}) // bez interneta miš samo nije tužan
    return () => { aktivan = false }
  }, [kljuc])
  return t
}
