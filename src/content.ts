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
  cuerpo:
    'Cada semana sale un modelo nuevo y otra lista de trucos. Lo que separa a quien prueba de quien construye es un camino claro: un reto real, decisiones explicadas y un proyecto que puedes defender.',
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

export const cierre = {
  titulo: '¿Empezamos por el paso uno?',
  cta: 'Ver los recursos gratis',
  aviso: 'Demo de scroll cinematográfico. Escenario y personajes generados con IA.',
};
