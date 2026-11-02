import {useEffect, useRef} from 'react';
import {herramientas} from '../content';
import {clamp, easeOutCubic, lerp, progresoFijado, tramo} from '../lib/math';
import {enCadaFotograma} from '../lib/scroll';

/**
 * Convergencia: los logos llegan dispersos, grandes y desenfocados, y se
 * ordenan en una rejilla con el scroll, uno tras otro. La rejilla es la
 * posición natural del DOM; cada logo solo deshace su desplazamiento inicial.
 *
 * Guion de scroll (p):
 *   0.00 – 0.12  título y texto aparecen
 *   0.05 – 0.72  los logos convergen escalonados (≈ 0.012 entre uno y otro)
 *   al encajar   cada logo pasa de monocromo a su color y su casilla se tiñe
 *   0.60 – 0.80  el contador llega a N y la rejilla se ilumina
 */

const ALTO_VH = 320;
const N = herramientas.logos.length;

// Desplazamientos iniciales deterministas, en un anillo amplio alrededor de la rejilla.
let semilla = 23;
const azar = () => (semilla = (semilla * 16807) % 2147483647) / 2147483647;
const INICIO = Array.from({length: N}, (_, i) => {
  const ang = (i / N) * Math.PI * 2 + azar() * 0.6;
  const radio = 0.55 + azar() * 0.35;
  return {dx: Math.cos(ang) * radio * 70, dy: Math.sin(ang) * radio * 55, escala: 1.6 + azar() * 1.6, giro: (azar() - 0.5) * 60};
});

export function Herramientas() {
  const raizRef = useRef<HTMLElement>(null);
  const logoRefs = useRef<HTMLLIElement[]>([]);
  const textoRef = useRef<HTMLDivElement>(null);
  const cuentaRef = useRef<HTMLSpanElement>(null);
  const rejillaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let pAnterior = -1;
    return enCadaFotograma(() => {
      const raiz = raizRef.current;
      if (!raiz) return;
      const {p, visible} = progresoFijado(raiz);
      if (!visible || Math.abs(p - pAnterior) < 0.00005) return;
      pAnterior = p;

      const t = easeOutCubic(tramo(p, 0, 0.12));
      textoRef.current!.style.opacity = String(t);
      textoRef.current!.style.transform = `translate3d(0, ${(1 - t) * 24}px, 0)`;

      let llegados = 0;
      logoRefs.current.forEach((el, i) => {
        const a = 0.05 + i * 0.012;
        const k = easeOutCubic(tramo(p, a, a + 0.4));
        const dentro = k > 0.98;
        if (dentro) llegados++;
        el.classList.toggle('encajado', dentro);
        const o = INICIO[i];
        el.style.transform = `translate3d(${o.dx * (1 - k)}vw, ${o.dy * (1 - k)}vh, 0) scale(${lerp(o.escala, 1, k)}) rotate(${o.giro * (1 - k)}deg)`;
        el.style.opacity = String(lerp(0.35, 1, k));
        el.style.filter = k < 0.99 ? `blur(${(1 - k) * 3}px)` : '';
      });
      cuentaRef.current!.textContent = String(llegados);
      rejillaRef.current!.style.setProperty('--brillo', String(clamp(tramo(p, 0.6, 0.8))));
    });
  }, []);

  return (
    <section ref={raizRef} aria-labelledby="herr-titulo" className="relative bg-void" style={{height: `${ALTO_VH}svh`}}>
      <div className="sticky top-0 flex h-pantalla flex-col items-center justify-center gap-8 overflow-hidden px-4 pt-16 sm:px-6 md:flex-row md:gap-16 md:px-[6vw] md:pt-0">
        <div ref={textoRef} className="relative z-10 max-w-[30rem] md:w-[34vw]" style={{opacity: 0}}>
          <p className="antetitulo text-rojo uppercase">{herramientas.antetitulo}</p>
          <h2 id="herr-titulo" className="mt-4 font-display text-display text-texto">
            {herramientas.titulo}
          </h2>
          <p className="mt-5 text-body text-texto-2 max-md:hidden">{herramientas.cuerpo}</p>
          <p className="mt-6 antetitulo text-texto-3 uppercase">
            <span ref={cuentaRef} className="font-cifra tabular-nums text-[1.25rem] text-texto">
              0
            </span>{' '}
            / {N} en su sitio
          </p>
        </div>

        <div
          ref={rejillaRef}
          className="relative rounded-[16px] border border-borde bg-superficie/60 p-4 md:p-6"
          style={{boxShadow: '0 0 calc(var(--brillo, 0) * 60px) oklch(59% 0.24 27 / calc(var(--brillo, 0) * 0.18))'}}
        >
          <ul className="grid grid-cols-4 gap-3 md:grid-cols-6 md:gap-4">
            {herramientas.logos.map(([fichero, nombre, color], i) => (
              <li
                key={fichero}
                ref={(el) => {
                  if (el) logoRefs.current[i] = el;
                }}
                className="logo-herramienta group flex size-[17vw] max-h-24 max-w-24 flex-col items-center justify-center gap-1.5 rounded-[8px] border border-transparent bg-elevado will-change-transform md:size-[6.2vw]"
                style={{'--marca': color} as React.CSSProperties}
                title={nombre}
              >
                <img
                  src={`${import.meta.env.BASE_URL}herramientas/${fichero}.svg`}
                  alt={nombre}
                  width={24}
                  height={24}
                  loading="lazy"
                  className="logo-herramienta__img size-[38%]"
                />
                <span className="logo-herramienta__nombre hidden text-center text-[0.625rem] leading-tight text-texto-3 md:block">{nombre}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
