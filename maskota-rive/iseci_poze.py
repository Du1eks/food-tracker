# Seče table celih poza (izvor/poze1.png, izvor/poze2.png) u zasebne PNG-ove za Rive (poze/).
# Sve poze dobijaju isti okvir, centriran na stopala, sa zajedničkom visinom: stopala ostaju na istom mestu pa se poze poklapaju pri prelazu.
from pathlib import Path
from PIL import Image
import numpy as np
from scipy import ndimage

OVDE = Path(__file__).parent
IMENA = {'poze1': ['mirno', 'slavi', 'tuzan', 'ljut'], 'poze2': ['trepce', 'jede', 'mase', 'spava']}
PRAG = 60  # alfa prag: viši od blage izmaglice koju model ostavlja oko krzna
RUB = 12   # px slobodnog prostora oko najšire poze


def figure(tabla: str):
    """Za svaku od 4 figure: (slika, okvir, x sredine stopala)."""
    slika = Image.open(OVDE / 'izvor' / f'{tabla}.png').convert('RGBA')
    alfa = np.array(slika)[:, :, 3] > PRAG
    # Uši susednih figura se ponekad dodiruju, pa se table dele po najređoj koloni oko svake četvrtine, ne po spojenim oblicima
    gustina, c = alfa.sum(axis=0), slika.width // 4
    reze = [0] + [i * c - c // 4 + int(np.argmin(gustina[i * c - c // 4:i * c + c // 4])) for i in (1, 2, 3)] + [slika.width]
    rez = []
    for a, b in zip(reze, reze[1:]):
        redovi, kolone = np.where(alfa[:, a:b].any(axis=1))[0], np.where(alfa[:, a:b].any(axis=0))[0]
        ys, xs = slice(redovi[0], redovi[-1] + 1), slice(a + kolone[0], a + kolone[-1] + 1)
        noge = alfa[ys.stop - (ys.stop - ys.start) // 10:ys.stop, xs]  # donjih 10% figure = stopala
        k = np.where(noge.any(axis=0))[0]
        rez.append((slika, (ys, xs), xs.start + (k[0] + k[-1]) // 2))
    return rez


svi = [(ime, f) for t in IMENA for ime, f in zip(IMENA[t], figure(t))]
gore = min(f[1][0].start for _, f in svi)
dole = max(f[1][0].stop for _, f in svi)
pola = max(max(s - f[1][1].start, f[1][1].stop - s) for _, f in svi for s in [f[2]]) + RUB
(OVDE / 'poze').mkdir(exist_ok=True)
for ime, (slika, (ys, xs), s) in svi:
    figura = Image.new('RGBA', slika.size)  # samo ova figura, bez delova susedne
    figura.paste(slika.crop((xs.start, ys.start, xs.stop, ys.stop)), (xs.start, ys.start))
    deo = figura.crop((s - pola, gore - RUB, s + pola, dole + RUB))
    deo = deo.resize((deo.width // 2, deo.height // 2), Image.LANCZOS)  # u aplikaciji je miš mali; pola rezolucije drži .riv malim
    deo.save(OVDE / 'poze' / f'{ime}.png', optimize=True)
    print(f'{ime}: {deo.size}, stopala na x={s}')
