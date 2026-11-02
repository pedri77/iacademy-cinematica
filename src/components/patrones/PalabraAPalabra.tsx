import {useEffect, useRef} from 'react';
import {useMovimientoReducido} from '../../hooks/useMovimientoReducido';
import {lerp, progresoFijado, tramo} from '../../lib/math';
import {enCadaFotograma} from '../../lib/scroll';

/**
 * Patrón 16: frase fijada que se enciende palabra a palabra. Una promesa o tesis de 12–30 palabras,
 * grande, en el centro; todas visibles desde el principio en gris tenue (se lee la forma entera) y el
 * scroll las enciende en orden. Las marcadas con *asteriscos* se encienden en el color de acento.
 *
 * Guion de scroll (p):
 *   0.08 – 0.82  palabra i de N: se enciende en [a, a + 2.5/N·ventana] con a = 0.08 + i/N·0.74
 *                (cada palabra tarda ~2,5 palabras en encenderse: el frente es un degradado, no un salto)
 *   0.85 – 1.00  la línea de firma (opcional) aparece debajo
 *
 * Opacidad 0.16 → 1 y nada más: sin desenfoque ni desplazamiento, que en párrafos grandes marea.
 * El texto real va entero en el h2 (aria-label); los span son decoración.
 */

type Props = {
  /** Frase; las palabras entre *asteriscos* van en acento. */
  frase: string;
  firma?: string;
  etiqueta: string;
  altoVh?: number;
};

const APAGADA = 0.16;

export function PalabraAPalabra({frase, firma, etiqueta, altoVh = 260}: Props) {
  const raizRef = useRef<HTMLElement>(null);
  const palabraRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const firmaRef = useRef<HTMLParagraphElement>(null);
  const reducido = useMovimientoReducido();
  const reducidoRef = useRef(reducido);
  reducidoRef.current = reducido;
  // *acento* puede abarcar varias palabras: se abre en la que empieza por * y se cierra en la que lo lleva al final.
  let abierto = false;
  const palabras = frase.split(/\s+/).map((w) => {
    const abre = w.startsWith('*');
    const cierra = /\*[.,;:!?»]*$/.test(w) && (w.length > 1 || abierto);
    const acento = abierto || abre;
    if (abre) abierto = true;
    if (cierra) abierto = false;
    return {texto: w.replace(/\*/g, ''), acento};
  });
  const limpia = palabras.map((w) => w.texto).join(' ');

  useEffect(() => {
    const N = palabras.length;
    let pAnterior = -1;
    return enCadaFotograma(() => {
      const raiz = raizRef.current;
      if (!raiz) return;
      const {p, visible} = progresoFijado(raiz);
      if (!visible) return;
      const q = reducidoRef.current ? 1 : p;
      if (Math.abs(q - pAnterior) < 0.0002) return;
      pAnterior = q;
      const ventana = (2.5 / N) * 0.74;
      palabraRefs.current.forEach((el, i) => {
        if (!el) return;
        const a = 0.08 + (i / N) * 0.74;
        el.style.opacity = String(lerp(APAGADA, 1, tramo(q, a, a + ventana)));
      });
      if (firmaRef.current) firmaRef.current.style.opacity = String(tramo(q, 0.85, 1));
    });
  }, [frase]);

  return (
    <section ref={raizRef} aria-label={etiqueta} className="relative" style={{height: `${altoVh}svh`}}>
      <div className="sticky top-0 flex h-pantalla flex-col items-center justify-center overflow-hidden bg-void px-[6vw]">
        <h2 aria-label={limpia} className="max-w-5xl text-center font-display text-display text-texto [text-wrap:balance]">
          {palabras.map((w, i) => (
            <span key={i} aria-hidden="true">
              <span
                ref={(el) => {
                  palabraRefs.current[i] = el;
                }}
                className={w.acento ? 'text-rojo' : undefined}
                style={{opacity: APAGADA}}
              >
                {w.texto}
              </span>{' '}
            </span>
          ))}
        </h2>
        {firma && (
          <p ref={firmaRef} className="mt-[4svh] text-etiqueta uppercase text-texto-2" style={{opacity: 0}}>
            {firma}
          </p>
        )}
      </div>
    </section>
  );
}
