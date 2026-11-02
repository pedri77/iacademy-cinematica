# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow>=10", "numpy>=1.26"]
# ///
"""Genera con fal las imágenes reales del piloto: capas del escenario y personajes.

  uv run scripts/generar_ia.py presupuesto          # no llama a nada, solo calcula
  uv run scripts/generar_ia.py personajes           # 5 personas 3D estilo Nora
  uv run scripts/generar_ia.py capas                # render base + 5 capas
  uv run scripts/generar_ia.py capas --solo atril   # generar una sola pieza
  uv run scripts/generar_ia.py personajes --solo rrhh --rehacer   # borrar lo guardado y volver a generar

La clave se lee de la variable de entorno FAL_KEY y nunca se imprime.
Cada pieza ya generada en ia/ se reutiliza: repetir el comando no vuelve a pagar.
--max-usd corta antes de pasarse del tope (por defecto, el del presupuesto).
Precios publicados por fal (02-11-2026): Nano Banana Pro 0,15 $ a 1K/2K, 0,30 $ a 4K;
BiRefNet v2 0 $ por segundo de cómputo. Pueden cambiar.
"""
import argparse
import base64
import io
import json
import os
import sys
import time
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
IA = RAIZ / "ia"
NORA = Path.home() / "Dev/Claude_proyectos/Claude/personajes/piloto-nora/raw/base.png"

T2I = "fal-ai/nano-banana-pro"
EDIT = "fal-ai/nano-banana-pro/edit"
BIREFNET = "fal-ai/birefnet/v2"
PRECIO = {"1K": 0.15, "2K": 0.15, "4K": 0.30}

# ---------------------------------------------------------------- personajes
ESTILO = (
    "Use the reference image ONLY as the art-style reference (high-quality stylised 3D cartoon render, "
    "Pixar-like, soft subsurface skin, clean shapes, slightly exaggerated proportions). Create a NEW, "
    "clearly different fictional person, not the one in the reference: {d}. Half-body portrait from the "
    "waist up, body slightly turned, looking at the camera with a warm, confident expression. Plain flat "
    "light grey background (#cfcfcf), soft studio light, no text, no logos, no watermark."
)
PERSONAJES = {
    "docentes": "a teacher in her late forties with short silver hair and round glasses, mustard cardigan over a white blouse, holding a stack of notebooks and a tablet against her chest",
    "legal": "a lawyer in his early forties with a neatly trimmed dark beard and medium-brown skin, navy suit and open-collar white shirt, holding a thick folder of documents",
    "autonomos": "a freelancer in her late twenties with curly copper hair in a loose bun, denim shirt with rolled sleeves, a laptop under one arm and a takeaway coffee cup in the other hand",
    "rrhh": "a human-resources manager in his mid thirties, East Asian, friendly smile, light grey knit sweater, a lanyard with a plain blank badge card (no text, no letters, no photo on it), holding a clipboard",
    "claude": "a young tech trainer in her early thirties with long dark braids and warm brown skin, burgundy hoodie, holding a tablet that shows a simple chat interface with no readable text",
}

# ---------------------------------------------------------------- capas
BASE = (
    "Cinematic stylised 3D illustration of a dark, quiet old library at night, seen from the centre aisle, "
    "symmetrical composition, 16:9. Centre: a tall gothic arched window with dark mullions and warm light "
    "(cream fading to soft red at the bottom) glowing through the glass. Left and right edges: tall dark "
    "wooden bookshelves full of books framing the view, each occupying about the outer 22% of the image, "
    "from top to bottom. Lower centre: a wooden reading desk with an open book and a small desk lamp with a "
    "red shade casting a warm pool of light. Foreground: dark wooden floorboards in perspective. Keep the "
    "upper-centre area above and around the top of the window calm for a headline, and leave clear empty "
    "floor to the left of the desk for a standing character. Palette: deep blue-violet night shadows "
    "(#0f0f18, #1a1a2e, #2a2a3d), warm cream light, red accents (#EF4444) used sparingly. Soft volumetric "
    "light, a little dust in the air. No people, no text, no logos."
)
SOLO = (
    "Same image, exactly the same framing, camera, perspective and lighting. Keep ONLY {x}, pixel-aligned "
    "where it already is. Replace absolutely everything else with flat pure chroma green #00FF00, with no "
    "shadows or gradients on the green."
)
CAPAS = {
    "fondo": (
        "Same image, exactly the same framing, camera and perspective. Remove the bookshelves, the desk, the "
        "book and the lamp, and extend the back wall, the window wall and the floor naturally where they were. "
        "Make the window UNLIT: dark night-blue glass with only a faint cold glow, no warm light. Keep the "
        "window frame and everything else in the same place.",
        False,
    ),
    "ventanal": (SOLO.format(x="the gothic window: its frame, mullions and the warm glowing glass"), True),
    "estanterias": (SOLO.format(x="the bookshelves on the left and right edges with their books"), True),
    "atril": (SOLO.format(x="the reading desk with the open book, the lamp and the pool of light on the desk"), True),
    "suelo": (SOLO.format(x="the dark wooden floorboards in the foreground, from the base of the shelves to the bottom edge"), True),
}

# Presupuesto: piezas × precio × factor de reintentos razonable.
PRESUPUESTO = {
    "personajes": {"llamadas": len(PERSONAJES), "res": "1K", "reintentos": 1.0, "tope": 10},
    "capas": {"llamadas": 1 + len(CAPAS), "res": "4K", "reintentos": 0.5, "tope": 10},
}


class Gasto:
    def __init__(self, maximo: float):
        self.maximo, self.total = maximo, 0.0

    def antes(self, usd: float, que: str):
        if self.total + usd > self.maximo + 1e-9:
            sys.exit(f"Tope alcanzado: {self.total:.2f} $ gastados, «{que}» costaría {usd:.2f} $ (máx. {self.maximo:.2f} $).")
        self.total += usd
        print(f"  … {que}: {usd:.2f} $ (acumulado {self.total:.2f} $)")


def clave() -> str:
    k = os.environ.get("FAL_KEY")
    if not k:
        sys.exit("Falta FAL_KEY en el entorno de este comando.")
    return k


def pedir(url: str, datos: dict | None = None) -> dict:
    req = urllib.request.Request(url, method="POST" if datos is not None else "GET")
    req.add_header("Authorization", f"Key {clave()}")
    if datos is not None:
        req.add_header("Content-Type", "application/json")
        req.data = json.dumps(datos).encode()
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read())


def fal(modelo: str, entrada: dict) -> dict:
    sub = pedir(f"https://queue.fal.run/{modelo}", entrada)
    estado, respuesta = sub["status_url"], sub["response_url"]
    for _ in range(180):
        s = pedir(estado)
        if s.get("status") == "COMPLETED":
            return pedir(respuesta)
        if s.get("status") not in ("IN_QUEUE", "IN_PROGRESS"):
            sys.exit(f"fal devolvió estado {s.get('status')} para {modelo}")
        time.sleep(3)
    sys.exit(f"Tiempo agotado esperando a {modelo}")


def data_uri(p: Path) -> str:
    return "data:image/png;base64," + base64.b64encode(p.read_bytes()).decode()


def descargar(url: str) -> Image.Image:
    if url.startswith("data:"):
        return Image.open(io.BytesIO(base64.b64decode(url.split(",", 1)[1])))
    with urllib.request.urlopen(url, timeout=120) as r:
        return Image.open(io.BytesIO(r.read()))


def croma(img: Image.Image) -> Image.Image:
    """Quita el verde #00FF00 con borde suave y elimina el reflejo verde."""
    a = np.asarray(img.convert("RGB")).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    dominio = g - np.maximum(r, b)
    alfa = 1 - np.clip((dominio - 40) / 90, 0, 1)
    g = np.where(dominio > 0, np.maximum(r, b), g)  # quita el reflejo verde de los bordes
    rgba = np.dstack([r, g, b, alfa * 255]).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def presupuesto():
    total = tope = 0.0
    print(f"{'tarea':<12}{'llamadas':>9}{'res':>5}{'típico':>9}{'tope':>8}")
    for t, c in PRESUPUESTO.items():
        precio = PRECIO[c["res"]]
        tipico = c["llamadas"] * (1 + c["reintentos"]) * precio
        maximo = c["tope"] * precio
        total += tipico
        tope += maximo
        print(f"{t:<12}{c['llamadas']:>9}{c['res']:>5}{tipico:>8.2f}${maximo:>7.2f}$")
    print(f"{'total':<26}{total:>8.2f}${tope:>7.2f}$")
    print("Recorte de fondo (BiRefNet) y verde: 0 $. Precios de fal a 02-11-2026.")


def personajes(gasto: Gasto, solo: str | None):
    if not NORA.exists():
        sys.exit(f"No encuentro la referencia de estilo {NORA}")
    crudos, salida = IA / "personajes", RAIZ / "public/personajes"
    crudos.mkdir(parents=True, exist_ok=True)
    salida.mkdir(parents=True, exist_ok=True)
    for nombre, desc in PERSONAJES.items():
        if solo and nombre != solo:
            continue
        crudo = crudos / f"{nombre}.png"
        if not crudo.exists():
            gasto.antes(PRECIO["1K"], f"personaje {nombre}")
            r = fal(EDIT, {"prompt": ESTILO.format(d=desc), "image_urls": [data_uri(NORA)], "aspect_ratio": "4:5", "resolution": "1K", "output_format": "png"})
            descargar(r["images"][0]["url"]).save(crudo)
        recorte = crudos / f"{nombre}-recorte.png"
        if not recorte.exists():
            r = fal(BIREFNET, {"image_url": data_uri(crudo)})
            descargar(r["image"]["url"]).convert("RGBA").save(recorte)
        im = Image.open(recorte)
        im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 16 else 0).getbbox())
        im.thumbnail((720, 900), Image.LANCZOS)
        im.save(salida / f"{nombre}.webp", "WEBP", quality=82, method=6)
        print(f"✓ {nombre}: public/personajes/{nombre}.webp {im.size}")


def capas(gasto: Gasto, solo: str | None):
    crudos, listas = IA / "capas", IA / "capas-png"
    crudos.mkdir(parents=True, exist_ok=True)
    listas.mkdir(parents=True, exist_ok=True)
    base = crudos / "base.png"
    if not base.exists():
        gasto.antes(PRECIO["4K"], "render base")
        r = fal(T2I, {"prompt": BASE, "aspect_ratio": "16:9", "resolution": "4K", "output_format": "png"})
        descargar(r["images"][0]["url"]).save(base)
        print(f"✓ base: {base}. Revísalo antes de seguir si quieres (Ctrl+C ahora y vuelve a lanzar).")
    tam = Image.open(base).size
    for nombre, (prompt, transparente) in CAPAS.items():
        if solo and nombre != solo:
            continue
        crudo = crudos / f"{nombre}.png"
        if not crudo.exists():
            gasto.antes(PRECIO["4K"], f"capa {nombre}")
            r = fal(EDIT, {"prompt": prompt, "image_urls": [data_uri(base)], "aspect_ratio": "16:9", "resolution": "4K", "output_format": "png"})
            descargar(r["images"][0]["url"]).save(crudo)
        im = Image.open(crudo)
        if im.size != tam:
            im = im.resize(tam, Image.LANCZOS)
        (croma(im) if transparente else im.convert("RGBA")).save(listas / f"{nombre}.png")
        print(f"✓ {nombre}: {listas / (nombre + '.png')}")
    print("Siguiente: uv run ~/.agents/skills/web-cinematica/scripts/capas.py ia/capas-png public/capas")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("tarea", choices=["presupuesto", "personajes", "capas"])
    ap.add_argument("--solo", help="trabajar solo con esta pieza")
    ap.add_argument("--rehacer", action="store_true", help="con --solo: borra lo guardado de esa pieza y la vuelve a generar")
    ap.add_argument("--max-usd", type=float)
    a = ap.parse_args()
    if a.tarea == "presupuesto":
        return presupuesto()
    c = PRESUPUESTO[a.tarea]
    if a.rehacer:
        if not a.solo:
            sys.exit("--rehacer necesita --solo <pieza>, para no volver a pagar todo.")
        carpeta = IA / ("personajes" if a.tarea == "personajes" else "capas")
        for p in carpeta.glob(f"{a.solo}*.png"):
            p.unlink()
            print(f"  borrado {p.relative_to(RAIZ)}")
    gasto = Gasto(a.max_usd if a.max_usd is not None else c["tope"] * PRECIO[c["res"]])
    (personajes if a.tarea == "personajes" else capas)(gasto, a.solo)
    print(f"Gasto de esta ejecución: {gasto.total:.2f} $")


if __name__ == "__main__":
    main()
