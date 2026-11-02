# API (Korak 4)

Supabase automatski pravi REST API iz tabela; app ga zove preko `supabase-js`.
Nigde ne šaljemo `korisnik_id = ja` za čitanje: RLS u bazi sam filtrira redove.

## Nalog (Supabase Auth)
| Akcija | supabase-js |
|---|---|
| Registracija | `auth.signUp({ email, password })` |
| Login | `auth.signInWithPassword({ email, password })` |
| Odjava | `auth.signOut()` |
| Reset lozinke (email link) | `auth.resetPasswordForEmail(email)` |

## Profil
| Akcija | CRUD | HTTP | supabase-js |
|---|---|---|---|
| Učitaj profil | Read | GET | `from('profil').select().single()` |
| Sačuvaj profil i cilj | Update | PATCH | `from('profil').update({...}).eq('id', userId)` |

## Proizvod (zajednički)
| Akcija | CRUD | HTTP | supabase-js |
|---|---|---|---|
| Pretraga po imenu | Read | GET | `from('proizvod').select().ilike('ime', '%pile%')` |
| Dodaj proizvod | Create | POST | `from('proizvod').insert({...})` |
| Izmeni proizvod | Update | PATCH | `from('proizvod').update({...}).eq('id', id)` |
| Obriši proizvod (samo vlasnik) | Delete | DELETE | `from('proizvod').delete().eq('id', id)` |

Ako proizvoda nema u našoj bazi: pretraga na Open Food Facts (direktan `fetch`, bez ključa), korisnik potvrdi vrednosti, pa `insert` u `proizvod`.

## Unos (privatan)
| Akcija | CRUD | HTTP | supabase-js |
|---|---|---|---|
| Unosi za dan | Read | GET | `from('unos').select().eq('datum', datum)` |
| Dani sa unosima u mesecu (kalendar) | Read | GET | `from('unos').select('datum').gte('datum', od).lte('datum', do)` |
| Dodaj unos (sa snapshot vrednostima) | Create | POST | `from('unos').insert({...})` |
| Izmeni unos | Update | PATCH | `from('unos').update({...}).eq('id', id)` |
| Obriši unos | Delete | DELETE | `from('unos').delete().eq('id', id)` |

## Odluke
- **Dnevni zbir** računa frontend iz liste unosa za dan (lista je ionako potrebna za tabelu; baza je jedini izvor istine).
- **Nedeljni/mesečni prosek** (kasnije) računa baza (`sum`/`avg` ili view), da se ne vuku stotine redova.
