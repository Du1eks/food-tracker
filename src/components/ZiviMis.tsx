// Živi miš iz Masko-a: canvas "Miš u aplikaciji" (stanja i prelaze bira Masko player), a app samo javlja šta se dešava (useMouseMascot).
// Učitava se lenjo (ReciMisu), pa ko ga ne vidi ne skida ni player.
import { useState, type ReactElement } from 'react'
import { MaskoPlayer, type MaskoHandle } from '@masko/player/react'
import { useMouseMascot, type StanjeMisa } from './useMouseMascot'

// Ključ aplikacije sme u kod: Masko ga pravi za ugrađivanje u app, čita samo objavljene canvase ovog miša (docs: player/app-keys).
const CANVAS = 'https://api.masko.ai/v1/canvases/70035d46-c087-455a-83da-3077aa739123/delivery'
const APP_KEY = 'masko_app_434dad1fce66b8845b28f4cf720c73479b80a06bb24b3e936e5749d5d8532845'

export default function ZiviMis({ rezerva, alt, ...stanje }: StanjeMisa & { rezerva: ReactElement; alt: string }) {
  const [mis, setMis] = useState<MaskoHandle | null>(null)
  const [spreman, setSpreman] = useState(false)
  const [pao, setPao] = useState(false)
  useMouseMascot(spreman ? mis : null, stanje)

  // Bez interneta ili kad Masko ne radi: obična slika. Osvežavanje linkova player sam ponavlja posle 30 s, to nije pad.
  // Dok se učitava, mesto stoji prazno (bez stare slike), a kad je prva poza spremna miš iskoči (dan.css: mis-pojava).
  if (pao) return rezerva
  return (
    <>
      <div className={`maskota ziv${spreman ? ' spreman' : ''}`} role="img" aria-label={alt} onClick={() => mis?.fire('action::click', { instant: true })}
        style={spreman ? undefined : { opacity: 0, pointerEvents: 'none' }}>
        <MaskoPlayer ref={setMis} url={CANVAS} appKey={APP_KEY} sound={false} style={{ width: '100%', height: '100%' }}
          onPose={() => setSpreman(true)} onError={(e) => { if (e.code !== 'refresh_failed') setPao(true) }} />
      </div>
    </>
  )
}
