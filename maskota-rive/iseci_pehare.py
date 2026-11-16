# Seče tablu pehara (izvor/pehari.png) u public/maskota/pehar-*.webp; deli po najređoj koloni oko svake četvrtine
from pathlib import Path
from PIL import Image
import numpy as np

OVDE = Path(__file__).parent
slika = Image.open(OVDE / 'izvor' / 'pehari.png').convert('RGBA')
alfa = np.array(slika)[:, :, 3] > 60
gustina, c = alfa.sum(axis=0), slika.width // 4
reze = [0] + [i * c - c // 4 + int(np.argmin(gustina[i * c - c // 4:i * c + c // 4])) for i in (1, 2, 3)] + [slika.width]
for ime, a, b in zip(['zlato', 'srebro', 'bronza', 'drvo'], reze, reze[1:]):
    ys, xs = np.where(alfa[:, a:b].any(axis=1))[0], np.where(alfa[:, a:b].any(axis=0))[0]
    deo = slika.crop((a + xs[0], ys[0], a + xs[-1] + 1, ys[-1] + 1))
    deo = deo.resize((round(deo.width * 200 / deo.height), 200), Image.LANCZOS)  # 84 px na ekranu, 200 za oštrinu
    deo.save(OVDE.parent / 'public' / 'maskota' / f'pehar-{ime}.webp', quality=88, method=6)
    print(ime, deo.size)
