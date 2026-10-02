"""
Perkecil foto undangan supaya cepat dimuat.

Cara pakai (di folder yang berisi folder "images"):
    pip install pillow
    python compress_images.py

Hasil ada di folder "images_kecil" (file asli TIDAK diubah).
Lalu unggah isi "images_kecil" ke folder images di GitHub (replace file lama).
"""
from pathlib import Path
from PIL import Image, ImageOps

SRC, OUT = Path("images"), Path("images_kecil")
MAX_SIDE = 1600          # sisi terpanjang (px), cukup tajam untuk HP & laptop
TARGET_KB = 350          # batas ukuran per foto
OUT.mkdir(exist_ok=True)

def save(im, path, q):
    im.save(path, "JPEG", quality=q, optimize=True, progressive=True)

for p in sorted(SRC.iterdir()):
    if p.suffix.lower() not in (".jpg", ".jpeg"):
        continue
    im = ImageOps.exif_transpose(Image.open(p)).convert("RGB")   # perbaiki rotasi dari kamera
    im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
    out, q = OUT / (p.stem + ".jpg"), 82                          # nama otomatis jadi .jpg huruf kecil
    save(im, out, q)
    while out.stat().st_size > TARGET_KB * 1024 and q > 60:
        q -= 5
        save(im, out, q)
    print(f"{p.name}: {p.stat().st_size // 1024} KB -> {out.stat().st_size // 1024} KB")
print("Selesai. Unggah isi folder images_kecil ke GitHub.")
