import type { Proizvod } from './ishrana'

// Besplatno, bez ključa. Limit je ~10 pretraga u minuti, zato se traži samo na klik.
type OffProizvod = {
  product_name?: string
  brands?: string
  nutriments?: Record<string, number | undefined>
}

export async function pretraziOFF(upit: string): Promise<Proizvod[]> {
  const url = new URL('https://world.openfoodfacts.org/cgi/search.pl')
  url.search = new URLSearchParams({
    search_terms: upit,
    search_simple: '1',
    json: '1',
    page_size: '10',
    fields: 'product_name,brands,nutriments',
  }).toString()

  const res = await fetch(url)
  if (!res.ok) throw new Error('Open Food Facts trenutno ne odgovara. Pokušaj za minut.')
  const { products = [] } = (await res.json()) as { products?: OffProizvod[] }

  // Podatke unose dobrovoljci: preskačemo one bez imena ili kalorija.
  return products
    .filter((p) => p.product_name && typeof p.nutriments?.['energy-kcal_100g'] === 'number')
    .map((p) => ({
      ime: p.product_name!.trim(),
      brend: p.brands?.split(',')[0]?.trim() || null,
      jedinica: '100g' as const,
      kcal: Math.round(p.nutriments!['energy-kcal_100g']!),
      proteini: p.nutriments!.proteins_100g ?? 0,
      uh: p.nutriments!.carbohydrates_100g ?? 0,
      masti: p.nutriments!.fat_100g ?? 0,
    }))
}
