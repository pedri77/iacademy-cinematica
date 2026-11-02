import {useEffect} from 'react';
import {Escenario} from './components/Escenario';
import {Gratis} from './components/Gratis';
import {Herramientas} from './components/Herramientas';
import {Intro} from './components/Intro';
import {Cabecera, Cierre} from './components/Marco';
import {Metodo} from './components/Metodo';
import {useMovimientoReducido} from './hooks/useMovimientoReducido';
import {iniciarScroll} from './lib/scroll';

export default function App() {
  const reducido = useMovimientoReducido();
  useEffect(() => iniciarScroll(reducido), [reducido]);

  return (
    <>
      <Cabecera />
      <main>
        <Escenario />
        <Intro />
        <Metodo />
        <Herramientas />
        <Gratis />
      </main>
      <Cierre />
    </>
  );
}
