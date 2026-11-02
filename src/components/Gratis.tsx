import {useEffect, useRef} from 'react';
import {gratis} from '../content';
import {clamp, progresoFijado, tramo} from '../lib/math';
import {enCadaFotograma} from '../lib/scroll';

/**
 * Carrete horizontal fijado. La sección se fija y las tarjetas se deslizan de
 * lado con el scroll; la más cercana a la línea de foco se ve nítida, el resto
 * se atenúa, y el dibujo interior de cada tarjeta se desplaza contra su marco.
 *
 * Guion de scroll (p):
 *   0.04 – 0.96  el carrete recorre todo su ancho; barra y contador siguen
 */

const ALTO_VH = 340;

export function Gratis() {
  const raizRef = useRef<HTMLElement>(null);
  const pistaRef = useRef<HTMLOListElement>(null);
  const tarjetaRefs = useRef<HTMLLIElement[]>([]);
  const dibujoRefs = useRef<HTMLDivElement[]>([]);
  const personajeRefs = useRef<HTMLImageElement[]>([]);
  const barraRef = useRef<HTMLSpanElement>(null);
  const cuentaRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let pAnterior = -1;
    return enCadaFotograma(() => {
      const raiz = raizRef.current;
      const pista = pistaRef.current;
      if (!raiz || !pista) return;
      const {p, visible} = progresoFijado(raiz);
      if (!visible || Math.abs(p - pAnterior) < 0.00005) return;
      pAnterior = p;

      const vw = window.innerWidth;
      const k = tramo(p, 0.04, 0.96);
      // offsetLeft es la posición sin transformar: estable mientras movemos la pista.
      const recorrido = Math.max(0, pista.offsetLeft + pista.scrollWidth - vw * 0.94);
      pista.style.transform = `translate3d(${-k * recorrido}px, 0, 0)`;

      let cercana = 0;
      let mejor = Infinity;
      tarjetaRefs.current.forEach((t, i) => {
        const r = t.getBoundingClientRect();
        const desvio = (r.left + r.width / 2 - vw * 0.62) / vw;
        const a = clamp(Math.abs(desvio) * 1.6);
        t.style.opacity = String(1 - a * 0.55);
        t.style.transform = `scale(${1 - a * 0.06})`;
        dibujoRefs.current[i].style.transform = `translate3d(${desvio * -70}px, 0, 0)`;
        // El personaje se mueve menos que el fondo: queda «delante».
        const pj = personajeRefs.current[i];
        if (pj) pj.style.transform = `translate3d(${desvio * -22}px, 0, 0) scale(${1 + (1 - a) * 0.04})`;
        if (Math.abs(desvio) < mejor) {
          mejor = Math.abs(desvio);
          cercana = i;
        }
      });
      barraRef.current!.style.transform = `scaleX(${k})`;
      cuentaRef.current!.textContent = `0${cercana + 1}`;
    });
  }, []);

  return (
    <section ref={raizRef} id="gratis" aria-labelledby="gratis-titulo" className="relative bg-void" style={{height: `${ALTO_VH}svh`}}>
      <div className="sticky top-0 flex h-pantalla flex-col justify-center overflow-hidden pt-16 md:flex-row md:items-center md:justify-start md:pt-0">
        <div className="relative z-20 shrink-0 bg-void px-4 sm:px-6 md:w-[34vw] md:self-stretch md:flex md:flex-col md:justify-center md:pr-10 md:pl-[6vw] md:after:absolute md:after:inset-y-0 md:after:left-full md:after:w-24 md:after:bg-gradient-to-r md:after:from-void md:after:to-transparent">
          <p className="antetitulo text-rojo uppercase">{gratis.antetitulo}</p>
          <h2 id="gratis-titulo" className="mt-4 font-display text-display text-texto">
            {gratis.titulo}
          </h2>
          <p className="mt-5 max-w-[26rem] text-body text-texto-2 max-md:hidden">{gratis.cuerpo}</p>
          <p className="mt-2 text-[0.75rem] text-texto-3 max-md:hidden">{gratis.avisoPersonajes}</p>
          <div className="mt-8 flex items-center gap-4 antetitulo text-texto-3 uppercase max-md:hidden" aria-hidden="true">
            <span>
              <span ref={cuentaRef} className="font-cifra tabular-nums text-texto">
                01
              </span>{' '}
              / 0{gratis.recursos.length}
            </span>
            <span className="relative h-px w-32 bg-borde">
              <span ref={barraRef} className="absolute inset-0 origin-left bg-rojo" style={{transform: 'scaleX(0)'}} />
            </span>
          </div>
        </div>

        <ol ref={pistaRef} className="relative z-10 mt-8 flex gap-5 pl-4 will-change-transform sm:pl-6 md:mt-0 md:gap-7 md:pl-0">
          {gratis.recursos.map((r, i) => (
            <li
              key={r.titulo}
              ref={(el) => {
                if (el) tarjetaRefs.current[i] = el;
              }}
              className="w-[72vw] shrink-0 origin-bottom sm:w-[44vw] md:w-[clamp(16rem,24vw,22rem)]"
            >
              <a href={r.href} className="group block rounded-[16px] border border-borde bg-superficie p-3 transition-colors duration-200 hover:border-rojo">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] bg-void">
                  <div
                    ref={(el) => {
                      if (el) dibujoRefs.current[i] = el;
                    }}
                    aria-hidden="true"
                    className="absolute -inset-x-16 inset-y-0 will-change-transform"
                    style={{
                      background: `repeating-linear-gradient(${100 + i * 17}deg, oklch(21% 0.025 270) 0 1px, transparent 1px ${14 + i * 3}px), radial-gradient(70% 60% at ${30 + i * 12}% 30%, oklch(59% 0.24 27 / 0.28), transparent 70%)`,
                    }}
                  />
                  <span aria-hidden="true" className="absolute right-4 bottom-1 font-display text-[7rem] leading-none text-texto/10">
                    {i + 1}
                  </span>
                  <img
                    ref={(el) => {
                      if (el) personajeRefs.current[i] = el;
                    }}
                    src={`${import.meta.env.BASE_URL}personajes/${r.personaje}.webp`}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    // Mientras no exista la imagen, se oculta y queda el número.
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                    className="absolute bottom-0 left-1/2 h-[92%] w-auto max-w-none -translate-x-1/2 origin-bottom object-contain will-change-transform [filter:drop-shadow(0_12px_24px_oklch(8%_0.025_275/0.7))]"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-elevado px-3 py-1 antetitulo text-[0.625rem] text-texto uppercase">{r.etiqueta}</span>
                </div>
                <div className="px-1 pt-4 pb-2">
                  <span className="block font-display text-[1.25rem] text-texto">{r.titulo}</span>
                  <span className="mt-1.5 block text-[0.875rem] leading-relaxed text-texto-2">{r.cuerpo}</span>
                  <span className="mt-3 inline-block text-[0.875rem] font-semibold text-rojo">Descargar gratis →</span>
                </div>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
