import {intro} from '../content';
import {useAparecer} from '../hooks/useAparecer';

/** Pausa entre escenarios: texto plano que entra al verse. */
export function Intro() {
  const ref = useAparecer<HTMLElement>();
  return (
    <section ref={ref} aria-labelledby="intro-titulo" className="relative bg-void px-4 pt-[8svh] pb-[6svh] sm:px-6 md:px-[6vw]">
      <div className="mx-auto max-w-4xl">
        <p data-aparece className="antetitulo text-rojo uppercase">
          {intro.antetitulo}
        </p>
        <h2 id="intro-titulo" data-aparece style={{'--i': 1} as React.CSSProperties} className="mt-4 font-display text-display text-texto">
          {intro.titulo}
        </h2>
        <p data-aparece style={{'--i': 2} as React.CSSProperties} className="mt-8 max-w-[42rem] text-lead text-texto-2">
          {intro.cuerpo}
        </p>
      </div>
    </section>
  );
}
