import {gratis} from '../content';
import {Abanico} from './patrones/Abanico';

/**
 * Recursos gratuitos como abanico de cartas (patrón 17 de web-cinematica): el scroll gira la mano y la
 * carta enfocada se levanta. Clic en otra carta la enfoca; clic en la enfocada abre el recurso.
 * Cada carta lleva su personaje de profesión (generado con IA, aviso visible en la cabecera).
 */
export function Gratis() {
  const base = import.meta.env.BASE_URL;
  return (
    <Abanico
      id="gratis"
      etiqueta={gratis.titulo}
      altoVh={420}
      tamano="h-[min(50svh,30rem)] w-[min(66vw,34svh,19rem)]"
      cabecera={
        <>
          <p className="antetitulo text-rojo uppercase">{gratis.antetitulo}</p>
          <h2 className="mt-3 font-display text-display text-texto">{gratis.titulo}</h2>
          <p className="mt-2 text-[0.75rem] text-texto-3">{gratis.avisoPersonajes}</p>
        </>
      }
      cartas={gratis.recursos.map((r, i) => ({
        id: r.personaje,
        etiqueta: `${r.titulo}: ${r.cuerpo}`,
        href: r.href,
        contenido: (
          <span className="flex size-full flex-col">
            <span className="relative block flex-1 overflow-hidden bg-void">
              <span
                aria-hidden="true"
                className="absolute inset-0"
                style={{background: `radial-gradient(70% 60% at ${30 + i * 12}% 30%, oklch(59% 0.24 27 / 0.28), transparent 70%)`}}
              />
              <img
                src={`${base}personajes/${r.personaje}.webp`}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                onError={(e) => (e.currentTarget.style.display = 'none')}
                className="absolute bottom-0 left-1/2 h-[94%] w-auto max-w-none -translate-x-1/2 object-contain [filter:drop-shadow(0_12px_24px_oklch(8%_0.025_275/0.7))]"
              />
              <span className="absolute top-3 left-3 rounded-full bg-elevado px-3 py-1 antetitulo text-[0.625rem] text-texto uppercase">{r.etiqueta}</span>
            </span>
            <span className="block px-4 pt-3 pb-4">
              <span className="block font-display text-[1.15rem] leading-tight text-texto">{r.titulo}</span>
              <span className="mt-1 block text-[0.8125rem] leading-snug text-texto-2">{r.cuerpo}</span>
              <span className="mt-2 inline-block text-[0.8125rem] font-semibold text-rojo">Descargar gratis →</span>
            </span>
          </span>
        ),
      }))}
    />
  );
}
