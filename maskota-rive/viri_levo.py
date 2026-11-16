# Skida naslikanu šahovsku pozadinu sa izvor/viri-levo-sah.webp (miš viri sa LEVE ivice) i pravi public/maskota/viri-levo.webp.
# Pozadina = tamnosivi bez boje pikseli povezani sa ivicom slike; dlaka miša je svetlija, zenice nisu povezane sa ivicom.
from pathlib import Path
from PIL import Image, ImageFilter
import numpy as np
from scipy import ndimage

OVDE = Path(__file__).parent
im = Image.open(OVDE / 'izvor' / 'viri-levo-sah.webp').convert('RGB')
a = np.array(im).astype(int)
siva = (a.max(axis=2) - a.min(axis=2) < 14) & (a.max(axis=2) < 118)
oznake, _ = ndimage.label(siva)
ivica = set(np.unique(np.concatenate([oznake[0], oznake[-1], oznake[:, 0], oznake[:, -1]]))) - {0}
pozadina = np.isin(oznake, list(ivica))
pozadina = ndimage.binary_dilation(pozadina, iterations=1)  # pojede tamni rub na granici
alfa = Image.fromarray(np.where(pozadina, 0, 255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.2))
rgba = im.convert('RGBA'); rgba.putalpha(alfa)
ys, xs = np.where(np.array(alfa) > 60)
rgba = rgba.crop((0, ys.min() - 8, xs.max() + 8, ys.max() + 8))  # leva ivica ostaje ravna, uz ivicu ekrana
rgba = rgba.resize((round(rgba.width * 420 / rgba.height), 420), Image.LANCZOS)
rgba.save(OVDE.parent / 'public' / 'maskota' / 'viri-levo.webp', quality=88, method=6)
print(rgba.size, 'ivicnih komponenti:', len(ivica))
