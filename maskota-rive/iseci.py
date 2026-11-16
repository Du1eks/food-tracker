# Seče Higgsfield table (izvor/telo2.png, izvor/lice2.png; prva verzija bez broja je ostala kao arhiva) u zasebne providne PNG-ove za Rive (delovi/).
# Delovi se nalaze po providnosti: blago proširena maska spaja bliske komade (npr. tri brka), pa se iseca okvir.
import sys
from pathlib import Path
from PIL import Image
import numpy as np
from scipy import ndimage

OVDE = Path(__file__).parent
# Imena po redu čitanja (red po red, sleva nadesno)
IMENA = {
    'telo': ['glava', 'uvo_l', 'uvo_d', 'trup', 'marama', 'ruka_l', 'ruka_d', 'noga_l', 'noga_d', 'rep'],
    'lice': ['oko_l', 'oko_d', 'oko_zatvoreno', 'oko_pospano',
             'obrva_l', 'obrva_d', 'nos', 'brkovi_l', 'brkovi_d',
             'usta_osmeh', 'usta_srecna', 'usta_tuzna', 'usta_ljuta', 'usta_o'],
}
PRAG, SIRENJE, RED = 40, 10, 150  # alfa prag, px širenja maske, visina "reda" za sortiranje (za tablu od 1024 px; množi se razmerom)


def iseci(tabla: str) -> None:
    slika = Image.open(OVDE / 'izvor' / f'{tabla}2.png').convert('RGBA')
    k = slika.width // 1024
    alfa = np.array(slika)[:, :, 3]
    maska = ndimage.binary_dilation(alfa > PRAG, iterations=SIRENJE * k)
    oznake, _ = ndimage.label(maska)
    okviri = [o for o in ndimage.find_objects(oznake) if (o[0].stop - o[0].start) * (o[1].stop - o[1].start) > 1500 * k * k]
    okviri.sort(key=lambda o: (((o[0].start + o[0].stop) // 2) // (RED * k), o[1].start))
    imena = IMENA[tabla]
    assert len(okviri) == len(imena), f'{tabla}: nađeno {len(okviri)} delova, očekivano {len(imena)}'
    (OVDE / 'delovi').mkdir(exist_ok=True)
    for ime, (ys, xs) in zip(imena, okviri):
        deo = slika.crop((xs.start, ys.start, xs.stop, ys.stop))
        deo = deo.resize((deo.width // k, deo.height // k), Image.LANCZOS)  # u Rive-u se delovi crtaju umanjeni, pa je 1k dovoljno (manji .riv)
        deo.save(OVDE / 'delovi' / f'{ime}.png')
        print(f'{ime}: {deo.size} na ({xs.start},{ys.start})')


for t in sys.argv[1:] or IMENA:
    iseci(t)
