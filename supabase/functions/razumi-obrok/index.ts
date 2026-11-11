// Edge Function: poruka "šta sam jeo" → spisak namirnica za pregled u app-u (docs/api.md).
// AI ključ živi samo ovde (Supabase secret GEMINI_API_KEY), nikad u klijentu.
// Čista logika (provera ulaza, prompt, provera odgovora) je u ../_shared/obrok.ts i ima testove.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { MAX_PROIZVODA, ocistiTekst, sredi, tekstIzOdgovora, zahtevZaAI, type ProizvodBaze } from '../_shared/obrok.ts'

// Pristup čuva token korisnika, ne kolačić, pa "*" ne otvara ništa; treba zbog web-a i Tauri-ja (drugi origin).
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const odgovor = (status: number, telo: unknown) =>
  new Response(JSON.stringify(telo), { status, headers: { ...CORS, 'Content-Type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return odgovor(405, { greska: 'metod' })

  try {
    // 1. Ko zove: samo ulogovan korisnik. Klijent radi sa njegovim tokenom, pa i ovde važi RLS.
    const auth = req.headers.get('Authorization') ?? ''
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY') ?? req.headers.get('apikey') ?? '',
      { global: { headers: { Authorization: auth } }, auth: { persistSession: false } },
    )
    const { data } = await supabase.auth.getUser(auth.replace(/^Bearer\s+/i, ''))
    if (!data?.user) return odgovor(401, { greska: 'prijava' })

    // 2. Ulaz: mali JSON sa kratkim tekstom
    const sirovo = await req.text()
    if (sirovo.length > 4000) return odgovor(400, { greska: 'tekst' })
    let telo: unknown
    try { telo = JSON.parse(sirovo) } catch { return odgovor(400, { greska: 'tekst' }) }
    const tekst = ocistiTekst((telo as { tekst?: unknown } | null)?.tekst)
    if (!tekst) return odgovor(400, { greska: 'tekst' })

    // 3. Dnevni limit po korisniku (broji baza, vidi migraciju ai_limit)
    const limit = await supabase.rpc('potrosi_ai_poziv')
    if (limit.error) return odgovor(500, { greska: 'server' })
    if (limit.data !== true) return odgovor(429, { greska: 'limit' })

    const kljuc = Deno.env.get('GEMINI_API_KEY')
    if (!kljuc) return odgovor(503, { greska: 'ai' })

    // 4. Zajednička baza proizvoda: AI bira iz nje, a vrednosti se posle uzimaju iz baze
    const baza = await supabase.from('proizvod')
      .select('id,ime,brend,jedinica,kcal,proteini,uh,masti').order('ime').limit(MAX_PROIZVODA)
    const proizvodi = (baza.data ?? []) as ProizvodBaze[]

    // 5. AI. Besplatni modeli povremeno javljaju preopterećenje (503) ili limit (429), pa tad probamo rezervni model.
    const modeli = [Deno.env.get('GEMINI_MODEL') ?? 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite']
    let r: Response | null = null
    for (const model of modeli) {
      r = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
        method: 'POST',
        headers: { 'x-goog-api-key': kljuc, 'Content-Type': 'application/json', 'Api-Revision': '2026-05-20' },
        body: JSON.stringify(zahtevZaAI(tekst, proizvodi, model)),
        signal: AbortSignal.timeout(20000),
      })
      if (r.ok) break
      console.error('AI status', model, r.status, (await r.text()).slice(0, 500))
      if (r.status !== 503 && r.status !== 429) break
    }
    if (!r?.ok) {
      const zauzet = r?.status === 503 || r?.status === 429
      return odgovor(zauzet ? 503 : 502, { greska: zauzet ? 'ai_limit' : 'ai' })
    }
    const izlaz = tekstIzOdgovora(await r.json())
    if (!izlaz) return odgovor(502, { greska: 'ai' })
    let ai: unknown
    try { ai = JSON.parse(izlaz) } catch { return odgovor(502, { greska: 'ai' }) }

    return odgovor(200, { stavke: sredi(ai, proizvodi) })
  } catch (e) {
    console.error('razumi-obrok', e instanceof Error ? e.message : e)
    return odgovor(500, { greska: 'server' })
  }
})
