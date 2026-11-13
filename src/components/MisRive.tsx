// Živi miš iz Rive-a. Učitava se lenjo (Maskota.tsx), pa ko ga ne vidi ne skida ni runtime.
// Ugovor sa public/maskota/mis.riv: mašina stanja "Mis" i view model sa cita/tuzan (bool) i jede/slavi/ljut/dodir (trigger).
import { useEffect, useState, type ReactElement } from 'react'
import {
  Alignment, Fit, Layout, RuntimeLoader, useRive, useViewModel, useViewModelInstance,
  useViewModelInstanceBoolean, useViewModelInstanceTrigger,
} from '@rive-app/react-canvas'
import wasm from '@rive-app/canvas/rive.wasm?url'
import wasmRezerva from '@rive-app/canvas/rive_fallback.wasm?url'
import type { Poza } from '../lib/rang'

// wasm ide iz našeg build-a, ne sa CDN-a: radi i u Tauri-ju bez interneta
RuntimeLoader.setWasmUrl(wasm)
RuntimeLoader.setWasmFallbackUrl(wasmRezerva)

export type MisProps = {
  poza: Poza; alt: string; rezerva: ReactElement; onGreska: () => void
  cita?: boolean; tuzan?: boolean; greska?: string
}

// Poza koju bira app (rang, upis, cilj) postaje kratka reakcija miša; "hoda" je mirovanje
const REAKCIJA: Partial<Record<Poza, 'jede' | 'slavi' | 'ljut'>> = { jede: 'jede', slavi: 'slavi', cilj: 'ljut' }

export default function MisRive({ poza, alt, rezerva, onGreska, cita = false, tuzan = false, greska }: MisProps) {
  const [spreman, setSpreman] = useState(false)
  const { rive, RiveComponent } = useRive({
    src: '/maskota/mis.riv', stateMachine: 'Mis', autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.BottomCenter }),
    onLoad: () => setSpreman(true), onLoadError: onGreska,
  })
  const vm = useViewModelInstance(useViewModel(rive, { useDefault: true }), { rive })
  const okidaci = {
    jede: useViewModelInstanceTrigger('jede', vm).trigger,
    slavi: useViewModelInstanceTrigger('slavi', vm).trigger,
    ljut: useViewModelInstanceTrigger('ljut', vm).trigger,
    dodir: useViewModelInstanceTrigger('dodir', vm).trigger,
  }
  const setCita = useViewModelInstanceBoolean('cita', vm).setValue
  const setTuzan = useViewModelInstanceBoolean('tuzan', vm).setValue

  useEffect(() => { if (vm) setCita(cita) }, [vm, cita, setCita])
  useEffect(() => { if (vm) setTuzan(tuzan) }, [vm, tuzan, setTuzan])
  const reakcija = REAKCIJA[poza]
  useEffect(() => { if (vm && reakcija) okidaci[reakcija]() }, [vm, reakcija]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (vm && greska) okidaci.ljut() }, [vm, greska]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {!spreman && rezerva}
      {/* dok se .riv ne učita, platno je nevidljivo i ne zauzima mesto; vidi se PNG */}
      <RiveComponent className={`maskota rive ${poza}`} role="img" aria-label={alt} onClick={okidaci.dodir}
        style={spreman ? undefined : { position: 'absolute', opacity: 0, pointerEvents: 'none' }} />
    </>
  )
}
