import {useEffect, useRef, useState} from 'react';
import {metodo, robot} from '../content';
import {clamp, easeOutCubic, progresoFijado, tramo} from '../lib/math';
import {enCadaFotograma} from '../lib/scroll';

/**
 * El método, dibujado al hacer scroll. La sección se fija mientras una línea
 * sube de un paso al siguiente; cada nodo se enciende al llegar y un punto
 * recorre el tramo que se está trazando: la cabeza del robot hace de guía.
 *
 * Guion de scroll (p):
 *   0.06 – 0.92  siete tramos, uno por paso (u = 0…7)
 *   en cada tramo: la línea se traza, el nodo se enciende, cambia el texto
 */

const ALTO_VH = 420;
const VENTANA = [0.06, 0.92] as const;
const N = metodo.pasos.length;

// Nodos en una escalera suave de abajo a la izquierda a arriba a la derecha.
const NODOS = Array.from({length: N}, (_, i) => ({x: 90 + i * 170, y: 430 - i * 58 + (i % 2 ? -22 : 22)}));
const INICIO = {x: 10, y: 470};

const TRAMOS = NODOS.map((b, i) => {
  const a = i === 0 ? INICIO : NODOS[i - 1];
  const mx = (a.x + b.x) / 2;
  return `M${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
});

export function Metodo() {
  const raizRef = useRef<HTMLElement>(null);
  const tramoRefs = useRef<SVGPathElement[]>([]);
  const nodoRefs = useRef<SVGCircleElement[]>([]);
  const puntoRef = useRef<SVGGElement>(null);
  const [paso, setPaso] = useState(0);

  useEffect(() => {
    let pAnterior = -1;
    let actual = 0;
    return enCadaFotograma(() => {
      const raiz = raizRef.current;
      if (!raiz) return;
      const {p, visible} = progresoFijado(raiz);
      if (!visible || Math.abs(p - pAnterior) < 0.00005) return;
      pAnterior = p;

      const u = tramo(p, ...VENTANA) * N;
      const s = clamp(Math.floor(u), 0, N - 1);
      if (s !== actual) {
        actual = s;
        setPaso(s);
      }
      tramoRefs.current.forEach((path, i) => {
        const k = easeOutCubic(clamp(u - i));
        path.style.strokeDashoffset = String(1 - k);
        nodoRefs.current[i].style.opacity = k > 0.98 ? '1' : '0.25';
        if (i === s) {
          const pt = path.getPointAtLength(path.getTotalLength() * k);
          puntoRef.current!.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
        }
      });
    });
  }, []);

  const p = metodo.pasos[paso];

  return (
    <section ref={raizRef} id="metodo" aria-labelledby="metodo-titulo" className="relative bg-void" style={{height: `${ALTO_VH}svh`}}>
      <div className="sticky top-0 flex h-pantalla flex-col overflow-hidden px-4 pt-20 pb-8 sm:px-6 md:px-[6vw] md:pt-24">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="antetitulo text-rojo uppercase">{metodo.antetitulo}</p>
            <h2 id="metodo-titulo" className="mt-3 max-w-[22ch] font-display text-display text-texto">
              {metodo.titulo}
            </h2>
          </div>
          <p className="antetitulo text-texto-3 uppercase">{metodo.nota}</p>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center">
          <svg viewBox="0 0 1200 520" className="h-auto max-h-full w-full" role="img" aria-label={`Los ${N} pasos del método, unidos por una línea que sube.`}>
            <defs>
              <radialGradient id="halo">
                <stop offset="0" stopColor="oklch(59% 0.24 27)" stopOpacity="0.45" />
                <stop offset="1" stopColor="oklch(59% 0.24 27)" stopOpacity="0" />
              </radialGradient>
            </defs>
            {TRAMOS.map((d, i) => (
              <path key={`f${i}`} d={d} fill="none" stroke="oklch(95% 0 0)" strokeOpacity="0.08" strokeWidth="1.5" strokeDasharray="3 7" />
            ))}
            {TRAMOS.map((d, i) => (
              <path
                key={i}
                ref={(el) => {
                  if (el) tramoRefs.current[i] = el;
                }}
                d={d}
                pathLength={1}
                fill="none"
                stroke={i === N - 1 ? 'oklch(59% 0.24 27)' : 'oklch(95% 0 0)'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="1 1"
                strokeDashoffset="1"
              />
            ))}
            {NODOS.map((n, i) => (
              <g key={`n${i}`}>
                <circle
                  ref={(el) => {
                    if (el) nodoRefs.current[i] = el;
                  }}
                  cx={n.x}
                  cy={n.y}
                  r="9"
                  fill="oklch(14% 0.03 275)"
                  stroke="oklch(59% 0.24 27)"
                  strokeWidth="2"
                  style={{opacity: 0.25, transition: 'opacity 0.3s'}}
                />
                <text x={n.x} y={n.y + 38} textAnchor="middle" fontFamily="Inter Tight, Inter, sans-serif" fontWeight="700" fontSize="18" fill={i === paso ? 'oklch(95% 0 0)' : 'oklch(50% 0.02 275)'}>
                  {i + 1}
                </text>
              </g>
            ))}
            <g ref={puntoRef} transform={`translate(${INICIO.x} ${INICIO.y})`}>
              <circle r="22" fill="url(#halo)" />
              <circle r="5" fill="oklch(95% 0 0)" />
              <image href={`${import.meta.env.BASE_URL}${robot.cabeza}`} x={-34} y={-74} width={68} height={53} />
            </g>
          </svg>
        </div>

        <div className="grid gap-4 border-t border-borde pt-5 md:grid-cols-[auto_1fr_auto] md:items-end md:gap-10">
          <p className="antetitulo text-rojo uppercase">
            Paso <span className="font-cifra tabular-nums">{paso + 1}</span> de {N}
          </p>
          <div key={paso} className="animate-[entra-paso_0.5s_cubic-bezier(0.2,0.7,0.1,1)]" aria-live="polite">
            <h3 className="font-display text-[1.375rem] text-texto md:text-[1.75rem]">{p.titulo}</h3>
            <p className="mt-1.5 max-w-[40rem] text-body text-texto-2">{p.cuerpo}</p>
          </div>
          <div className="flex gap-1.5" aria-hidden="true">
            {metodo.pasos.map((_, i) => (
              <span key={i} className={`h-1 w-6 rounded-full transition-colors duration-500 ${i <= paso ? 'bg-rojo' : 'bg-elevado'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
