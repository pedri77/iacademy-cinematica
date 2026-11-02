import {useEffect} from 'react';
import {Escenario} from './components/Escenario';
import {Gratis} from './components/Gratis';
import {Herramientas} from './components/Herramientas';
import {Intro} from './components/Intro';
import {Cabecera, Cierre} from './components/Marco';
import {Metodo} from './components/Metodo';
import {Dial} from './components/patrones/Dial';
import {PalabraAPalabra} from './components/patrones/PalabraAPalabra';
import {cifrasGratis, tesis} from './content';
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
        <PalabraAPalabra etiqueta="La tesis del método" frase={tesis.frase} firma={tesis.firma} altoVh={240} />
        <Metodo />
        <Herramientas />
        <Dial etiqueta="Recursos gratuitos en cifras" titulo={cifrasGratis.titulo} principal={cifrasGratis.principal} maximo={cifrasGratis.maximo} divisiones={6} ficha={cifrasGratis.ficha} altoVh={260} />
        <Gratis />
      </main>
      <Cierre />
    </>
  );
}
