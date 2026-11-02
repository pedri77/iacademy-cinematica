import {useEffect} from 'react';
import {Escenario} from './components/Escenario';
import {Gratis} from './components/Gratis';
import {Herramientas} from './components/Herramientas';
import {Intro} from './components/Intro';
import {Cabecera, Cierre} from './components/Marco';
import {Metodo} from './components/Metodo';
import {Dial} from './components/patrones/Dial';
import {PalabraAPalabra} from './components/patrones/PalabraAPalabra';
import {SecuenciaFijada} from './components/patrones/SecuenciaFijada';
import {Triptico} from './components/patrones/Triptico';
import {cifrasGratis, entrada, tesis, triptico} from './content';
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
        <SecuenciaFijada
          etiqueta={entrada.etiqueta}
          base={`${import.meta.env.BASE_URL}secuencias/entrada/d`}
          baseMovil={`${import.meta.env.BASE_URL}secuencias/entrada/m`}
          recorteMovil={entrada.recorteMovil}
          n={entrada.n}
          capitulos={entrada.capitulos}
          anclas={entrada.anclas}
          altoVh={440}
        />
        <Metodo />
        <Herramientas />
        <Triptico etiqueta={triptico.etiqueta} base={`${import.meta.env.BASE_URL}secuencias/triptico/d`} n={triptico.n} titulo={triptico.titulo} texto={triptico.texto} figuras={triptico.personajes.map((x) => `${import.meta.env.BASE_URL}personajes/${x}.webp`)} rotulos={triptico.rotulos} />
        <Dial etiqueta="Recursos gratuitos en cifras" titulo={cifrasGratis.titulo} principal={cifrasGratis.principal} maximo={cifrasGratis.maximo} divisiones={6} ficha={cifrasGratis.ficha} altoVh={260} />
        <Gratis />
      </main>
      <Cierre />
    </>
  );
}
