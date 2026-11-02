import {useEffect, useRef} from 'react';
import {useMovimientoReducido} from '../../hooks/useMovimientoReducido';
import {clamp, easeOutCubic, lerp, progresoFijado, tramo} from '../../lib/math';
import {enCadaFotograma} from '../../lib/scroll';
import {ajustarLienzo, cargarSecuencia, cubrir} from '../../lib/secuencia';

/**
 * Patrón 14: tríptico de un plano. Tres paneles altos, separados, que enseñan cada uno un tercio del
 * MISMO plano (secuencia de fotos o una imagen si n = 1). Mientras la secuencia avanza, los paneles se
 * desplazan a ritmos distintos; al final se juntan y el plano se ve entero: los tres eran uno.
 *
 * Guion de scroll (p):
 *   0.00 – 0.18  los paneles suben escalonados (0, 0.04, 0.08) desde 40 vh
 *   0.05 – 0.90  la secuencia avanza (foto = p reescalado)
 *   0.15 – 0.80  desfase vertical: lateral ±9 vh contra el central, con signo opuesto
 *   0.78 – 0.94  los huecos se cierran y el desfase vuelve a 0: plano entero
 *   0.90 – 1.00  el texto final aparece debajo
 *   figuras      (opcional) un recorte con transparencia por panel, anclado abajo: sube en
 *                0.14 + i·0.06 … +0.24 y se desfasa al 40 % del panel y en sentido contrario
 *                (parallax: queda «delante» del plano). Al juntarse, los tres quedan lado a lado.
 *
 * Cada panel encaja SU tercio del plano (cover del tercio sobre el panel). Como los tres paneles y los tres
 * tercios miden lo mismo, la escala es la misma y al juntarse casan. En móvil los paneles son muy estrechos:
 * un cover del plano entero sobre el ancho total enseñaría solo el centro en los tres; por tercios, cada
 * panel conserva lo suyo (compón el plano con un motivo centrado en cada tercio).
 */

type Props = {
  base: string;
  n: number;
  ext?: string;
  altoVh?: number;
  titulo: string;
  texto: string;
  etiqueta: string;
  /** Un recorte PNG/WebP con transparencia por panel (personaje, producto), anclado abajo. */
  figuras?: string[];
  /** Una etiqueta corta por panel (arriba a la izquierda). */
  rotulos?: string[];
};

export function Triptico({base, n, ext = 'webp', altoVh = 360, titulo, texto, etiqueta, figuras, rotulos}: Props) {
  const raizRef = useRef<HTMLElement>(null);
  const marcoRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lienzoRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const figuraRefs = useRef<(HTMLImageElement | null)[]>([]);
  const textoRef = useRef<HTMLDivElement>(null);
  const reducido = useMovimientoReducido();
  const reducidoRef = useRef(reducido);
  reducidoRef.current = reducido;

  useEffect(() => {
    const sec = cargarSecuencia(base, n, ext);
    let ultima = '';
    return enCadaFotograma(() => {
      const raiz = raizRef.current;
      const marco = marcoRef.current;
      if (!raiz || !marco) return;
      const {p, visible} = progresoFijado(raiz);
      if (!visible) return;
      const red = reducidoRef.current;
      const W = marco.clientWidth;
      const H = marco.clientHeight;
      const ranura = W / 3;
      const junta = easeOutCubic(tramo(p, 0.78, 0.94));
      const hueco = red ? 0 : lerp(Math.min(28, W * 0.025), 0, junta);
      const desfase = red ? 0 : Math.sin(tramo(p, 0.15, 0.8) * Math.PI) * 9 * (1 - junta);

      panelRefs.current.forEach((el, i) => {
        if (!el) return;
        const sube = red ? 1 : easeOutCubic(tramo(p, i * 0.04, 0.1 + i * 0.04));
        const dy = lerp(40, 0, sube) + (i === 1 ? -desfase : desfase);
        // El hueco se reparte hacia fuera: el central no se mueve en x.
        const dx = (i - 1) * hueco;
        el.style.transform = `translate3d(${dx}px, ${dy}vh, 0)`;
        el.style.opacity = String(clamp(sube * 1.5));
        const fig = figuraRefs.current[i];
        if (fig) {
          const a = 0.14 + i * 0.06;
          const sale = red ? 1 : easeOutCubic(tramo(p, a, a + 0.24));
          const contra = (i === 1 ? desfase : -desfase) * 0.4;
          fig.style.transform = `translate3d(0, calc(${(1 - sale) * 35}% + ${contra}vh), 0)`;
          fig.style.opacity = String(clamp(sale * 1.4));
        }
      });

      const f = red ? n - 1 : Math.round(tramo(p, 0.05, 0.9) * (n - 1));
      const img = sec.foto(f);
      if (img && img.naturalWidth) {
        const clave = `${img.src}|${W}x${H}`;
        if (clave !== ultima) {
          ultima = clave;
          const tercio = img.naturalWidth / 3;
          const e = cubrir(tercio, img.naturalHeight, ranura, H);
          lienzoRefs.current.forEach((c, i) => {
            if (!c) return;
            const dpr = ajustarLienzo(c);
            const ctx = c.getContext('2d')!;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.drawImage(img, i * tercio, 0, tercio, img.naturalHeight, e.x, e.y, e.w, e.h);
          });
        }
      }
      const t = red ? 1 : tramo(p, 0.9, 1);
      textoRef.current!.style.opacity = String(t);
      textoRef.current!.style.transform = `translate3d(0, ${(1 - t) * 3}vh, 0)`;
    });
  }, [base, n, ext]);

  return (
    <section ref={raizRef} aria-label={etiqueta} className="relative" style={{height: `${altoVh}svh`}}>
      <div className="sticky top-0 flex h-pantalla flex-col items-center justify-center overflow-hidden bg-void px-[4vw]">
        {/* Alto limitado por el ancho: cada panel (un tercio) no baja de 0,42 de proporción, así en móvil
            enseña al menos el 70 % de su tercio (que mide 0,6 en un 16:9). En escritorio manda el 60svh (deja sitio a la cabecera y al texto). */}
        <div ref={marcoRef} className="relative grid w-full max-w-6xl grid-cols-3" style={{height: 'min(60svh, calc((min(100vw, 72rem) - 8vw) / 3 / 0.42))'}}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              className="relative h-full overflow-hidden rounded-[2px] will-change-transform"
              style={{opacity: 0}}
            >
              <canvas
                ref={(el) => {
                  lienzoRefs.current[i] = el;
                }}
                aria-hidden="true"
                className="absolute inset-0 size-full"
              />
              {figuras?.[i] && (
                <>
                  <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-void/80 to-transparent" />
                  <img
                    ref={(el) => {
                      figuraRefs.current[i] = el;
                    }}
                    src={figuras[i]}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-x-0 bottom-0 h-[64%] w-full object-contain object-bottom will-change-transform [filter:drop-shadow(0_14px_26px_oklch(8%_0.025_275/0.75))]"
                    style={{opacity: 0}}
                  />
                </>
              )}
              {rotulos?.[i] && (
                <span className="absolute top-3 left-3 rounded-full bg-elevado/90 px-2.5 py-1 antetitulo text-[0.5625rem] text-texto uppercase md:text-[0.625rem]">{rotulos[i]}</span>
              )}
            </div>
          ))}
        </div>
        <div ref={textoRef} className="mt-[4svh] max-w-xl text-center" style={{opacity: 0}}>
          <h2 className="font-display text-display text-texto">{titulo}</h2>
          <p className="mt-2 text-body text-texto-2">{texto}</p>
        </div>
      </div>
    </section>
  );
}
