// Posle npm install (i na Vercelu, pre build-a): klipovi miša iz paketa mis-figura idu u public/klipovi,
// jer ih pregledač traži sa sajta. Zato public/klipovi nije u git-u; novi tag paketa sam donese svoje klipove.
import { cpSync, existsSync, rmSync } from 'node:fs'

const iz = 'node_modules/mis-figura/dist/klipovi'
const u = 'public/klipovi'
if (!existsSync(iz)) {
  console.warn(`kopiraj-klipove: nema ${iz} (mis-figura nije instaliran), preskačem`)
} else {
  rmSync(u, { recursive: true, force: true }) // stari klipovi ne smeju da ostanu pored novih
  cpSync(iz, u, { recursive: true })
  console.log(`kopiraj-klipove: ${iz} → ${u}`)
}
