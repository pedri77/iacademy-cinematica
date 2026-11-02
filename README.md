# IAcademy · De la niebla al método

Demo de scroll cinematográfico de [IAcademy](https://iacedemy.com): una biblioteca a oscuras aparece al disipar la niebla, el robot de IAcademy saluda, el método de 7 pasos se dibuja con el scroll, 24 herramientas encajan en su sitio y un carrete muestra los [recursos gratuitos](https://iacedemy.com/free/).

```bash
npm install
npm run dev        # http://localhost:3007
npm run build      # dist/
```

Se despliega solo en GitHub Pages con cada push a `main` (`.github/workflows/pages.yml`).

## Secciones

| Sección | Qué pasa al hacer scroll |
|---|---|
| Escenario | 5 capas en parallax, niebla con partículas, titular letra a letra, robot con bocadillo, HUD |
| Método | La línea de los 7 pasos se dibuja tramo a tramo; la cabeza del robot hace de guía |
| Herramientas | 24 logos llegan dispersos, encajan en la rejilla y se colorean |
| Recursos gratis | Carrete horizontal con un personaje por profesión |

## Estructura

```
src/lib/scroll.ts               bucle único Lenis + requestAnimationFrame
src/lib/math.ts                 tramo, lerp, curvas, progresoFijado
src/components/*.tsx            una sección por componente, con su guion de scroll en la cabecera
src/content.ts                  todo el texto
public/capas/{d,m}/             capas del escenario (WebP, escritorio y móvil)
scripts/generar_ia.py           genera render base, sala vacía y personajes con fal (FAL_KEY en el entorno)
scripts/componer_capas.py       recorta las capas en local a partir del render y la sala vacía
```

Stack: Vite 6 · React 19 · TypeScript · Tailwind CSS 4 · Lenis. Hecha con la skill `web-cinematica`.

## Créditos y avisos

- **Imágenes generadas con IA**: el escenario de la biblioteca y los cinco personajes de las tarjetas (Nano Banana Pro vía fal). Los personajes son ficticios y no representan a personas reales.
- Robot: mascota de IAcademy. Logos de herramientas: Simple Icons (CC0); las marcas pertenecen a sus titulares.
- Fuentes DM Serif Display, Inter, Inter Tight y JetBrains Mono (OFL 1.1, ver `public/fonts/`).
- Técnica de scroll inspirada en la plantilla gratuita *Selene* de Scrolltide; código reescrito, sin textos ni imágenes suyos.
