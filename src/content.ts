/**
 * Todo el texto de la página. Demo de scroll cinematográfico de IAcademy:
 * los pasos del método son los del expediente (metodo-v1) y los recursos
 * enlazan a guías gratuitas reales de iacedemy.com/free.
 */

const WEB = 'https://iacedemy.com';

export const marca = {
  nombre: 'IAcademy',
  web: WEB,
  gratis: `${WEB}/free/`,
};

export const nav = [
  {texto: 'Método', href: '#metodo'},
  {texto: 'Gratis', href: '#gratis'},
];

/** Capas del escenario, de la más lejana a la más cercana. Mismo encuadre en todas. */
export const capas = ['fondo', 'ventanal', 'suelo', 'estanterias', 'atril'] as const;
export type Capa = (typeof capas)[number];
/** Extensión de las capas: `webp` (renders con IA, ver scripts/componer_capas.py); las SVG provisionales están en ia/svg-provisionales. */
export const extCapas = 'webp';

export const escenario = {
  antetitulo: 'Una demo de IAcademy',
  titulo: 'Aprende IA',
  destacado: 'con método',
  invitacion: 'Desliza para disipar la niebla',
  lugar: 'iacedemy.com · Madrid',
  saludo: 'Hola. Te acompaño en los siete pasos.',
};

/** La mascota de IAcademy (assets/img/robot-ia-sin-fondo.png de iacedemy-web). */
export const robot = {
  cuerpo: 'robot/robot.webp',
  cabeza: 'robot/cabeza.webp',
  alt: 'El robot de IAcademy saluda con la mano',
};

export const intro = {
  antetitulo: 'El problema',
  titulo: 'Tienes herramientas. Te falta un método.',
  cuerpo: 'Cada semana sale un modelo nuevo y otra lista de trucos. Lo que separa a quien prueba de quien construye es un camino claro.',
};

/** Patrón 16: la tesis se enciende palabra a palabra. *palabra* = acento. */
export const tesis = {
  frase: 'Un *reto real*, decisiones explicadas y un proyecto que puedes *defender*: eso separa a quien prueba de quien construye.',
  firma: 'El método IAcademy',
};

export const metodo = {
  antetitulo: 'El método',
  titulo: 'Siete pasos para pasar de la idea al impacto.',
  nota: 'La IA ayuda en cada paso. Las decisiones son tuyas.',
  pasos: [
    {titulo: 'Diagnosticar el reto', cuerpo: 'Analizas un reto real, exploras el contexto y detectas oportunidades con IA.'},
    {titulo: 'Elegir el proyecto', cuerpo: 'Seleccionas un proyecto con impacto, alineado con tus intereses y con oportunidades reales.'},
    {titulo: 'Diseñar la solución', cuerpo: 'Defines la propuesta de valor, el enfoque y el plan de trabajo con apoyo de IA.'},
    {titulo: 'Construir el MVP', cuerpo: 'Desarrollas un prototipo funcional, simple y validable con herramientas de IA.'},
    {titulo: 'Integrar herramientas', cuerpo: 'Conectas y configuras las herramientas de IA más adecuadas para tu solución.'},
    {titulo: 'Evaluar y mejorar', cuerpo: 'Mides resultados, recibes comentarios e iteras para aumentar el impacto.'},
    {titulo: 'Presentar y defender', cuerpo: 'Comunicas tu proyecto con una narrativa clara, datos y una visión de futuro.'},
  ],
};

export const herramientas = {
  antetitulo: 'Paso 5 · Integrar herramientas',
  titulo: 'Las herramientas, en su sitio.',
  cuerpo: 'Hay cientos y cada semana salen más. El método no consiste en coleccionarlas, sino en elegir las que resuelven tu reto y conectarlas bien.',
  /** Fichero de public/herramientas (Simple Icons, CC0), nombre visible y color de marca. */
  logos: [
    ['claude', 'Claude', '#D97757'], ['cloudflare', 'Cloudflare', '#F38020'], ['ollama', 'Ollama', '#E8E8EC'], ['huggingface', 'Hugging Face', '#FFD21E'],
    ['n8n', 'n8n', '#EA4B71'], ['make', 'Make', '#6D00CC'], ['zapier', 'Zapier', '#FF4F00'], ['dify', 'Dify', '#5B7CFF'],
    ['langchain', 'LangChain', '#7FC8FF'], ['pydantic', 'Pydantic', '#E92063'], ['crewai', 'CrewAI', '#FF5A50'], ['modelcontextprotocol', 'MCP', '#E8E8EC'],
    ['python', 'Python', '#3776AB'], ['fastapi', 'FastAPI', '#009688'], ['react', 'React', '#61DAFB'], ['nextdotjs', 'Next.js', '#E8E8EC'],
    ['supabase', 'Supabase', '#3FCF8E'], ['postgresql', 'PostgreSQL', '#4169E1'], ['qdrant', 'Qdrant', '#DC244C'], ['docker', 'Docker', '#2496ED'],
    ['cursor', 'Cursor', '#E8E8EC'], ['githubcopilot', 'GitHub Copilot', '#E8E8EC'], ['notion', 'Notion', '#E8E8EC'], ['obsidian', 'Obsidian', '#7C3AED'],
  ] as const,
};

export const gratis = {
  antetitulo: 'Empieza hoy',
  titulo: 'Recursos gratuitos para dar el primer paso.',
  cuerpo: 'Prompts y plantillas listos para copiar, organizados por profesión.',
  /** Personajes ficticios generados con IA (public/personajes/<slug>.webp). */
  avisoPersonajes: 'Personajes ficticios generados con IA.',
  recursos: [
    {personaje: 'docentes', etiqueta: 'Docentes', titulo: 'Kit IA para profesores', cuerpo: '12 prompts y 3 plantillas de evaluación.', href: `${WEB}/free/ia-para-profesores/`},
    {personaje: 'legal', etiqueta: 'Legal', titulo: 'Kit IA para abogados', cuerpo: '10 prompts y una lista de comprobación RGPD.', href: `${WEB}/free/ia-para-abogados/`},
    {personaje: 'autonomos', etiqueta: 'Autónomos', titulo: 'IA para autónomos', cuerpo: '30 prompts para facturas, presupuestos y clientes.', href: `${WEB}/free/ia-para-autonomos/`},
    {personaje: 'rrhh', etiqueta: 'Personas', titulo: 'Plantillas IA para RRHH', cuerpo: '9 plantillas: selección, acogida y evaluación.', href: `${WEB}/free/ia-para-rrhh/`},
    {personaje: 'claude', etiqueta: 'Claude', titulo: 'Guía maestra de Claude', cuerpo: 'Del chat al sistema: proyectos, MCP y skills.', href: `${WEB}/free/guia-maestra-claude/`},
  ],
};

/**
 * Patrones 12 y 13: un plano de 8 s (Kling v3 Pro a partir del render de las capas, ver
 * scripts/generar_ia.py video) convertido en 120 fotos. Las anclas van en coordenadas de la foto de
 * escritorio (0–1), medidas sobre las fotos 1, 30, 60, 90 y 120.
 */
export const entrada = {
  etiqueta: 'Entra en la biblioteca',
  n: 120,
  recorteMovil: [0.4027, 0.3146] as [number, number],
  capitulos: [
    {desde: 0.04, hasta: 0.32, titulo: 'Un sitio sin ruido', texto: 'Fuera se quedan las listas de trucos. Dentro, solo lo que necesitas para trabajar.'},
    {desde: 0.36, hasta: 0.64, titulo: 'Las herramientas, a mano', texto: 'No hace falta tenerlas todas: basta con saber dónde están y cuál usar.'},
    {desde: 0.68, hasta: 0.96, titulo: 'Tu mesa, tu proyecto', texto: 'Al final del pasillo te espera un reto real. Ahí empieza el paso uno.'},
  ],
  anclas: [
    {id: 'ventanal', etiqueta: 'La idea', detalle: 'todo empieza por un reto real', claves: [[4, 0.5, 0.35], [29, 0.51, 0.36], [59, 0.51, 0.36], [89, 0.51, 0.34], [110, 0.5, 0.35]]},
    {id: 'estanterias', etiqueta: 'Herramientas', detalle: 'las justas, bien elegidas', claves: [[2, 0.85, 0.42], [29, 0.9, 0.42], [50, 0.95, 0.42]]},
    {id: 'proyecto', etiqueta: 'Tu proyecto', detalle: 'el que vas a defender', claves: [[60, 0.605, 0.663], [89, 0.567, 0.648], [119, 0.533, 0.65]]},
  ] as {id: string; etiqueta: string; detalle: string; claves: [number, number, number][]}[],
};

/**
 * Patrón 15: las cifras de los recursos gratis, sumadas de `gratis.recursos`:
 * prompts 12 + 10 + 30; plantillas 3 + 9; kits por profesión: docentes, legal, autónomos y RRHH.
 */
export const cifrasGratis = {
  titulo: 'Todo esto, gratis.',
  principal: {etiqueta: 'listos para copiar', valor: 52, unidad: 'prompts'},
  maximo: 60,
  ficha: [
    {etiqueta: 'Kits por profesión', valor: 4, unidad: ''},
    {etiqueta: 'Plantillas', valor: 12, unidad: ''},
    {etiqueta: 'Guía de Claude', valor: 1, unidad: ''},
    {etiqueta: 'Precio', valor: 0, unidad: '€'},
  ],
};

export const cierre = {
  titulo: '¿Empezamos por el paso uno?',
  cta: 'Ver los recursos gratis',
  aviso: 'Demo de scroll cinematográfico. Escenario, vídeo y personajes generados con IA.',
};
