import { CourseData, InteractiveGame } from '../types';

const escapeRoomGame: InteractiveGame = {
    type: 'escape_room',
    title: 'Escape Room Digital: El Desafío del Analista',
    instruction: 'Estás atrapado en la sala de monitoreo digital. La puerta está bloqueada con un código de 4 dígitos. Resuelve los siguientes acertijos sobre herramientas tecnológicas SARLAFT para encontrar cada dígito y escapar.',
    escapeRoomSolution: '2423',
    escapeRoomPuzzles: [
      {
        id: 1,
        title: 'Acertijo 1: Monitoreo Transaccional',
        prompt: 'Un software de monitoreo ha marcado 4 patrones. Solo uno es un claro indicio de "pitufeo". ¿Cuál es?',
        options: [
          { id: 1, text: 'Un cliente recibe su salario de $5M y paga el arriendo de $2M.' },
          { id: 2, text: 'Un cliente realiza 15 depósitos de $950.000 en 3 oficinas distintas en un solo día.' },
          { id: 3, text: 'Un cliente compra un vehículo por $80M con un crédito aprobado.' },
          { id: 4, text: 'Un cliente recibe un giro de su hermano desde España por $1M.' },
        ],
        correctOptionId: 2,
        solutionHint: 'El primer dígito del código es: 2'
      },
      {
        id: 2,
        title: 'Acertijo 2: Listas Restrictivas',
        prompt: "Tu software cruza un nuevo cliente contra varias fuentes. ¿Cuál de estas es MÁS probable que genere un 'Falso Positivo' (una alerta para alguien que no es la persona buscada) debido a nombres comunes?",
        options: [
          { id: 1, text: 'Base de datos de Cédulas Bloqueadas por la Registraduría.' },
          { id: 4, text: 'Búsqueda en archivos de noticias y medios de comunicación.' },
          { id: 9, text: 'Coincidencia biométrica facial con una base de datos interna.' },
        ],
        correctOptionId: 4,
        solutionHint: 'El segundo dígito del código es: 4'
      },
      {
        id: 3,
        title: 'Acertijo 3: Inteligencia Artificial',
        prompt: "Un sistema de IA aprende que un cliente siempre recibe 20 giros pequeños de diferentes estudiantes porque administra una residencia. Al ver este patrón repetirse, la IA deja de alertarlo. ¿Qué está demostrando la IA?",
        options: [
          { id: 8, text: 'Un error, ya que siempre debe alertar.' },
          { id: 2, text: "Comprensión del 'contexto' para reducir falsos positivos." },
          { id: 5, text: 'Que el cliente debe ser bloqueado inmediatamente.' },
        ],
        correctOptionId: 2,
        solutionHint: 'El tercer dígito del código es: 2'
      },
      {
        id: 4,
        title: 'Acertijo 4: El Factor Humano',
        prompt: 'Una herramienta tecnológica es fundamental para generar alertas, pero la decisión final de si una operación es sospechosa y debe ser reportada a la UIAF la toma siempre...',
        options: [
          { id: 1, text: 'El software de monitoreo automáticamente.' },
          { id: 3, text: 'El analista humano con su juicio experto.' },
          { id: 7, text: 'El gerente de la oficina que conoce al cliente.' },
        ],
        correctOptionId: 3,
        solutionHint: 'El cuarto y último dígito es: 3'
      }
    ]
};

const crosswordGame: InteractiveGame = {
    type: 'crossword',
    title: 'Crucigrama de Debida Diligencia',
    instruction: 'Completa el crucigrama con los conceptos clave de la Debida Diligencia. Haz clic en una celda para empezar y usa las flechas para moverte.',
    crosswordPuzzles: [
        {
            id: 1,
            clue: "Proceso de conocimiento del asociado para prevenir el LA/FT.",
            answer: "DILIGENCIA",
            position: { x: 1, y: 5 },
            direction: 'across',
        },
        {
            id: 2,
            clue: "Se debe identificar al ______ final, la persona natural que realmente controla.",
            answer: "BENEFICIARIO",
            position: { x: 4, y: 0 },
            direction: 'down',
        },
        {
            id: 3,
            clue: "Acrónimo del principio 'Conozca a su Cliente' (en inglés).",
            answer: "KYC",
            position: { x: 8, y: 3 },
            direction: 'down',
        }
    ]
};

const reportMatchGame: InteractiveGame = {
  type: 'match',
  title: "Emparejando Conceptos de Reportes",
  instruction: "Arrastra la definición correcta a cada término clave sobre los reportes a la UIAF.",
  pairs: [
    { term: "ROS", definition: "Informe enviado a la UIAF sobre una operación sin justificación aparente." },
    { term: "Tipping Off", definition: "Delito de alertar al asociado que está siendo reportado." },
    { term: "SIREL", definition: "Plataforma en línea para el envío seguro de reportes a la UIAF." },
    { term: "Reporte de Efectivo", definition: "Informe objetivo sobre transacciones que superan un monto específico." },
    { term: "Confidencialidad", definition: "Principio que exige absoluto secreto sobre los reportes enviados." }
  ]
};

const decisionSimulatorGame: InteractiveGame = {
  type: 'decision_simulator',
  title: "Simulador de Decisiones: Las Consecuencias de SARLAFT",
  instruction: "Eres el Oficial de Cumplimiento. Enfrenta tres escenarios críticos y elige la acción correcta. Tus decisiones tendrán consecuencias directas para la entidad, para ti y para la reputación de la cooperativa.",
  decisionScenarios: [
    {
      id: 1,
      title: 'Decisión 1: La Presión Interna',
      prompt: 'Un analista te presenta una operación inusual de un asociado antiguo y muy importante. Tu gerente te sugiere "no reportar para no incomodar al asociado". ¿Qué haces?',
      options: [
        { id: 1, text: 'Hacer caso al gerente y no reportar.', consequence: 'CONSECUENCIA: La Supersolidaria podría sancionar a la entidad y a los administradores por omisión de control. Esta es una falta grave.', isCorrect: false },
        { id: 2, text: 'Documentar el caso, desestimar la sugerencia del gerente y seguir el procedimiento para determinar si es una operación sospechosa.', consequence: 'CONSECUENCIA: Has actuado con diligencia, protegiendo a la entidad de posibles sanciones administrativas y cumpliendo con tu deber.', isCorrect: true },
        { id: 3, text: 'Reportar directamente sin análisis para cubrirte las espaldas.', consequence: 'CONSECUENCIA: Reportar sin un análisis debido puede erosionar la credibilidad de tus reportes ante la UIAF. El análisis interno es un paso crucial.', isCorrect: false }
      ]
    },
    {
      id: 2,
      title: 'Decisión 2: El Favor a un Amigo',
      prompt: 'Un amigo cercano te pide que le ayudes a vincular a un "inversionista" a la cooperativa de forma rápida, omitiendo algunos documentos "para agilizar". Te asegura que es de confianza. ¿Qué haces?',
      options: [
        { id: 1, text: 'Aceptar y agilizar el trámite. Es un amigo de confianza.', consequence: 'CONSECUENCIA: Podrías ser cómplice de lavado de activos. La omisión de la debida diligencia tiene consecuencias penales, incluyendo la cárcel.', isCorrect: false },
        { id: 2, text: 'Explicarle a tu amigo que TODOS deben cumplir el 100% del proceso de debida diligencia, sin excepción.', consequence: 'CONSECUENCIA: Has protegido tu integridad y a la entidad de un riesgo penal grave. La amistad no puede estar por encima de la ley.', isCorrect: true }
      ]
    },
    {
      id: 3,
      title: 'Decisión 3: El Rumor en la Prensa',
      prompt: 'Un periodista te contacta sobre un rumor de que la cooperativa está siendo investigada por LA/FT y te pide una declaración inmediata para calmar a los asociados. ¿Qué haces?',
      options: [
        { id: 1, text: 'Negar todo categóricamente para cortar el rumor de raíz.', consequence: 'CONSECUENCIA: Si el rumor es cierto, una mentira puede destruir completamente la credibilidad de la entidad cuando la verdad salga a la luz.', isCorrect: false },
        { id: 2, text: 'Confirmar que están colaborando con las autoridades para ser transparentes.', consequence: 'CONSECUENCIA: Una confirmación prematura puede causar pánico financiero, retiros masivos y un daño reputacional irreparable.', isCorrect: false },
        { id: 3, text: 'Agradecer la llamada, no confirmar ni negar, y dirigir al periodista al canal de comunicación oficial de la entidad.', consequence: 'CONSECUENCIA: Has manejado la crisis correctamente, evitando declaraciones impulsivas y protegiendo la reputación de la entidad mientras se gestiona la situación internamente.', isCorrect: true }
      ]
    }
  ]
};

const timedQuizGame: InteractiveGame = {
  type: 'timed_quiz',
  title: "Rally Tecnológico: ¡Contra el Reloj!",
  instruction: "Responde 3 preguntas sobre herramientas tecnológicas SARLAFT antes de que el tiempo se acabe. ¡Cada segundo cuenta!",
  timeLimit: 15,
  timedQuizQuestions: [
    {
      id: 1,
      question: "Un software de monitoreo transaccional es crucial porque...",
      options: [
        "Reemplaza completamente al analista humano.",
        "Analiza miles de operaciones en tiempo real para detectar patrones inusuales.",
        "Solo sirve para generar reportes para la gerencia.",
        "Bloquea automáticamente a todos los clientes nuevos."
      ],
      correctOptionIndex: 1,
      feedback: "Incorrecto. Su poder radica en analizar grandes volúmenes de datos para encontrar anomalías que un humano no podría, pero no reemplaza el juicio del analista."
    },
    {
      id: 2,
      question: "¿Cuál es el propósito principal de cruzar automáticamente la base de datos de asociados contra listas restrictivas (ONU, OFAC, etc.)?",
      options: [
        "Aumentar la cantidad de papeleo para los clientes.",
        "Cumplir un requisito, aunque rara vez encuentra algo.",
        "Asegurar que la entidad no tenga relaciones con personas o empresas sancionadas por terrorismo, narcotráfico, etc.",
        "Verificar la dirección de residencia de los asociados."
      ],
      correctOptionIndex: 2,
      feedback: "Incorrecto. Es una obligación crítica para evitar que la entidad se relacione con actores vinculados a delitos graves a nivel nacional e internacional."
    },
    {
      id: 3,
      question: "La gran ventaja de la Inteligencia Artificial (IA) en SARLAFT sobre los sistemas de reglas tradicionales es que puede...",
      options: [
        "Aprobar créditos de forma más rápida.",
        "Enviar los reportes a la UIAF sin intervención humana.",
        "Aprender patrones de comportamiento complejos y detectar anomalías sutiles, reduciendo falsos positivos.",
        "Chatear con los clientes para resolver sus dudas."
      ],
      correctOptionIndex: 2,
      feedback: "Incorrecto. La IA va más allá de reglas fijas. Aprende del comportamiento 'normal' para identificar desviaciones complejas y sutiles, haciendo la detección más inteligente y eficiente."
    }
  ]
};

const interactiveGameIdeas: InteractiveGame[] = [
  {
    type: 'match',
    title: "Relaciona el Concepto",
    instruction: "Arrastra la definición correcta a cada término de SARLAFT.",
    pairs: [
      { term: "SARLAFT", definition: "Sistema de Administración del Riesgo de Lavado de Activos y de la Financiación del Terrorismo." },
      { term: "UIAF", definition: "Unidad de Información y Análisis Financiero, encargada de centralizar, sistematizar y analizar información sobre operaciones sospechosas." },
      { term: "Debida Diligencia", definition: "Proceso de conocimiento del cliente/asociado para prevenir el LA/FT." },
      { term: "ROS", definition: "Reporte de Operación Sospechosa que se envía a la UIAF." },
      { term: "Segmentación", definition: "Proceso de agrupar factores de riesgo en grupos con características similares." },
      { term: "Riesgo Reputacional", definition: "Posibilidad de pérdida por desprestigio, mala imagen o publicidad negativa." }
    ]
  },
  {
    type: 'drag_drop',
    title: "Fases de la Gestión de Riesgo",
    instruction: "Ordena las cuatro fases de la gestión de riesgo en la secuencia correcta.",
    items: ["Identificación", "Medición", "Control", "Monitoreo"]
  },
  {
    type: 'quiz',
    title: "Identifica la Señal de Alerta",
    instruction: "Lee el escenario y decide si constituye una señal de alerta potencial.",
  },
  {
    type: 'drag_drop',
    title: "Etapas del Lavado de Activos",
    instruction: "Ordena las tres etapas del lavado de activos en la secuencia correcta.",
    items: ["Colocación", "Estratificación", "Integración"]
  },
  {
    type: 'memory',
    title: "Juego de Memoria: Señales de Alerta",
    instruction: "Encuentra los pares correctos en cada set para reforzar tu conocimiento sobre las señales de alerta.",
    memorySets: [
        {
            title: "Ejercicio 1: Conceptos Clave",
            pairs: [
                { term: "Pitufeo", definition: "Fraccionar depósitos para evitar reportes." },
                { term: "Operación Inusual", definition: "Transacción que no coincide con el perfil del cliente." },
                { term: "Tipping Off", definition: "Alertar al cliente sobre un reporte a la UIAF." },
                { term: "Beneficiario Final", definition: "Persona natural que realmente posee o controla una cuenta." },
            ]
        },
        {
            title: "Ejercicio 2: Tipos de Alerta",
            pairs: [
                { term: "Alerta Transaccional", definition: "Uso excesivo de efectivo." },
                { term: "Alerta Comportamental", definition: "Cliente renuente a dar información." },
                { term: "Alerta Documental", definition: "Presentación de soportes falsos o inconsistentes." },
                { term: "Alerta por Jurisdicción", definition: "Transferencias desde un paraíso fiscal sin justificación." },
            ]
        },
        {
            title: "Ejercicio 3: Escenarios Prácticos",
            pairs: [
                { term: "Escenario: Múltiples consignaciones pequeñas en varias oficinas.", definition: "Posible Pitufeo." },
                { term: "Escenario: Cliente se molesta al pedirle soportes de ingresos.", definition: "Alerta Comportamental." },
                { term: "Escenario: Un PEP realiza transacciones muy altas para su salario.", definition: "Requiere Debida Diligencia Intensificada." },
                { term: "Escenario: Empresa fachada recibe giros del exterior.", definition: "Posible ocultamiento del Beneficiario Final." },
            ]
        }
    ]
  },
  {
    type: 'word_search',
    title: "Sopa de Letras: Elementos del SARLAFT",
    instruction: "Encuentra los 5 elementos clave del sistema SARLAFT en la sopa de letras. Haz clic y arrastra para seleccionar una palabra.",
    words: ["Politicas", "Procedimientos", "Documentacion", "Tecnologia", "Divulgacion"]
  },
  escapeRoomGame,
  crosswordGame,
  reportMatchGame,
  decisionSimulatorGame,
  timedQuizGame,
];


export const courseData: CourseData = {
  modules: [
    {
      id: 1,
      title: "Fundamentos de SARLAFT",
      description: "Introducción a los conceptos básicos del Lavado de Activos y Financiación del Terrorismo.",
      submodules: [
        { id: "1-1", title: "¿Qué es el Lavado de Activos (LA)?", content: "El lavado de activos es el proceso mediante el cual se busca dar apariencia de legalidad a recursos de origen ilícito. Involucra tres etapas: colocación, estratificación e integración.", multimedia: { audioScript: "Resumen del concepto y etapas del lavado de activos.", videoConcept: { title: "El Ciclo del Lavado de Activos", script: "" } } },
        { id: "1-2", title: "¿Qué es la Financiación del Terrorismo (FT)?", content: "La financiación del terrorismo es cualquier forma de apoyo económico o material a grupos terroristas. No siempre proviene de fuentes ilícitas, pero su fin siempre lo es.", multimedia: { audioScript: "Explicación de la financiación del terrorismo y sus diferencias con el LA.", videoConcept: { title: "Fuentes de la Financiación del Terrorismo", script: "Infografía animada mostrando diversas fuentes, lícitas e ilícitas, que pueden financiar actividades terroristas." } } },
        { id: "1-3", title: "Impacto en el Sector Solidario", content: "Las entidades solidarias son vulnerables por su base social amplia y su rol de confianza. El LA/FT puede generar riesgo reputacional, legal, operativo y de contagio.", multimedia: { audioScript: "Impactos negativos del LA/FT en cooperativas y fondos de empleados.", videoConcept: { title: "Efecto Dominó", script: "Animación que muestra cómo un caso de LA/FT en una cooperativa afecta su reputación, finanzas y la confianza de sus asociados." } } },
      ],
      slides: [
        { title: "Definición de SARLAFT", points: ["Sistema de Administración", "Riesgo de LA/FT", "Prevención y Control"], imageConcept: "Diagrama de SARLAFT como un escudo protector para la entidad." },
        { title: "Etapas del Lavado de Activos", points: ["1. Colocación", "2. Estratificación", "3. Integración"], imageConcept: "Gráfico de flujo con las 3 etapas." },
        { title: "Diferencia entre LA y FT", points: ["Origen del dinero (LA: ilícito, FT: lícito/ilícito)", "Motivación (LA: lucro, FT: ideológica)"], imageConcept: "Tabla comparativa simple." },
        { title: "Riesgos Asociados para el Sector", points: ["Reputacional", "Legal", "Operativo", "Contagio"], imageConcept: "Iconos representando cada tipo de riesgo." },
        { title: "Rol del Empleado", points: ["Primera línea de defensa", "Conocer al asociado", "Reportar operaciones inusuales"], imageConcept: "Ilustración de un empleado vigilante." },
      ],
      interactiveGameIdeas: [interactiveGameIdeas[0], interactiveGameIdeas[3]],
    },
    {
      id: 2,
      title: "Normativa y Marco Legal",
      description: "Regulaciones de la Supersolidaria y otras entidades que rigen el SARLAFT en Colombia.",
      submodules: [
        { id: "2-1", title: "Circular Básica Jurídica de la Supersolidaria", content: "Análisis del Título IV, Capítulo XI, que establece las instrucciones para la administración del SARLAFT en el sector solidario.", multimedia: { audioScript: "Resumen de los puntos clave de la Circular Básica Jurídica.", videoConcept: { title: "Navegando la Circular", script: "Video explicativo con un experto que resalta las secciones más importantes del documento para las entidades solidarias." } } },
        { id: "2-2", title: "Leyes y Decretos Relevantes", content: "Estudio de normas como el Código Penal Colombiano (tipificación de LA/FT), Ley 190 de 1995 (Estatuto Anticorrupción), entre otras.", multimedia: { audioScript: "Mención de las leyes más importantes y su propósito.", videoConcept: { title: "Línea de Tiempo Normativa", script: "Animación que muestra la evolución de las leyes anti-lavado en Colombia." } } },
        { id: "2-3", title: "El Rol de la UIAF", content: "La Unidad de Información y Análisis Financiero es la entidad del estado encargada de prevenir y detectar el LA/FT, recibiendo los reportes de las entidades.", multimedia: { audioScript: "Explicación de qué es la UIAF y por qué es importante para las entidades.", videoConcept: { title: "El Flujo de la Información a la UIAF", script: "Diagrama animado que muestra cómo un ROS viaja desde la entidad hasta la UIAF y cómo esta lo analiza." } } },
      ],
      slides: [
        { title: "Supersolidaria", points: ["Entidad de supervisión", "Emite la normativa SARLAFT para el sector", "Vigila el cumplimiento"], imageConcept: "Logo de la Superintendencia de la Economía Solidaria." },
        { title: "Circular Básica Jurídica", points: ["Establece políticas, procedimientos y controles", "Define responsabilidades", "Es de obligatorio cumplimiento"], imageConcept: "Ícono de un documento legal." },
        { title: "UIAF: Unidad de Información y Análisis Financiero", points: ["Receptor de ROS", "Análisis estratégico y operativo", "No es una entidad sancionatoria"], imageConcept: "Diagrama de la UIAF como un centro de inteligencia financiera." },
        { title: "Responsabilidad Penal", points: ["El LA/FT son delitos", "Sanciones incluyen prisión y multas", "Aplica a personas naturales y jurídicas"], imageConcept: "Ícono de un martillo de juez." },
        { title: "Estándares Internacionales (GAFI)", points: ["Grupo de Acción Financiera Internacional", "Emite recomendaciones globales", "Colombia es miembro de GAFILAT"], imageConcept: "Mapa del mundo destacando los países miembros del GAFI." }
      ],
      oai: 'uiaf_flow',
    },
    {
      id: 3,
      title: "Segmentación de Factores de Riesgo",
      description: "Cómo clasificar clientes, productos, canales y jurisdicciones para una gestión efectiva del riesgo.",
       submodules: [
        { id: "3-1", title: "Concepto de Segmentación", content: "La segmentación consiste en agrupar los factores de riesgo (asociados, productos, etc.) en categorías homogéneas para analizar su comportamiento y detectar operaciones inusuales de manera más efectiva.", multimedia: { audioScript: "Introducción a por qué la segmentación es un pilar fundamental del SARLAFT.", videoConcept: { title: "De la Multitud al Detalle", script: "Animación que muestra una gran masa de asociados siendo organizada en pequeños grupos con características similares, facilitando la vigilancia." } } },
        { id: "3-2", title: "Factor de Riesgo: Asociados/Clientes", content: "Se deben considerar variables como actividad económica, ingresos, ubicación geográfica, y si es una Persona Expuesta Políticamente (PEP).", multimedia: { audioScript: "Claves para segmentar a los asociados y la importancia de identificar a los PEPs.", videoConcept: { title: "¿Quién es quién?", script: "Infografía interactiva que permite al usuario hacer clic en perfiles de asociados ficticios para ver su nivel de riesgo." } } },
        { id: "3-3", title: "Factores de Riesgo: Productos, Canales y Jurisdicciones", content: "Productos (ej. créditos de libre inversión vs. ahorro a la vista), canales (ej. oficina vs. app móvil) y jurisdicciones (ej. local vs. zonas de frontera) presentan diferentes niveles de riesgo.", multimedia: { audioScript: "Cómo evaluar el riesgo inherente de los productos, canales y zonas geográficas donde opera la entidad.", videoConcept: { title: "Mapa de Calor de Riesgos", script: "Animación de un mapa de Colombia donde ciertas zonas y productos se iluminan en rojo para indicar mayor riesgo de LA/FT." } } },
      ],
      slides: [
        { title: "Los 4 Factores de Riesgo", points: ["Asociados / Clientes", "Productos / Servicios", "Canales de Distribución", "Jurisdicciones"], imageConcept: "Diagrama con 4 cuadrantes, uno para cada factor." },
        { title: "Metodología de Segmentación", points: ["Definir variables relevantes", "Agrupar por características similares", "Establecer umbrales de normalidad"], imageConcept: "Gráfico de un proceso de filtrado o embudo." },
        { title: "Personas Expuestas Políticamente (PEP)", points: ["Manejan recursos públicos o tienen reconocimiento público", "Requieren debida diligencia intensificada", "Incluye familiares cercanos"], imageConcept: "Ilustración de una figura política y su círculo de influencia." },
        { title: "Riesgo por Producto", points: ["Productos que permiten anonimato", "Productos con alto movimiento de efectivo", "Transferencias internacionales"], imageConcept: "Íconos de diferentes productos financieros con una barra de riesgo." },
        { title: "Riesgo por Jurisdicción", points: ["Países en listas GAFI", "Zonas de frontera", "Paraísos fiscales"], imageConcept: "Mapa del mundo con países de alto riesgo resaltados." }
      ],
      oai: 'risk_factor_sorter',
    },
    {
      id: 4,
      title: "Componentes del Sistema SARLAFT",
      description: "Los elementos que componen un sistema SARLAFT robusto y funcional.",
      submodules: [
        { id: "4-1", title: "Políticas", content: "Las políticas son las directrices generales aprobadas por la junta directiva o consejo de administración. Definen el compromiso de la entidad con la prevención del LA/FT.", multimedia: { audioScript: "Explicación del rol de las políticas como la 'constitución' del SARLAFT en la entidad.", videoConcept: { title: "La Pirámide del SARLAFT", script: "Animación que muestra una pirámide donde la base son las políticas, sobre las cuales se construyen los procedimientos y herramientas." } } },
        { id: "4-2", title: "Procedimientos", content: "Los procedimientos son el 'cómo' se aplican las políticas. Incluyen manuales para la vinculación de asociados, monitoreo de operaciones, gestión de alertas, etc.", multimedia: { audioScript: "Diferencia entre políticas (qué) y procedimientos (cómo).", videoConcept: { title: "Manual de Procedimientos Animado", script: "Un video corto que simula pasar las páginas de un manual, mostrando de forma gráfica los pasos para la debida diligencia." } } },
        { id: "4-3", title: "Documentación y Estructura Organizacional", content: "Incluye el manual SARLAFT, códigos de ética, y la designación de roles clave como el Oficial de Cumplimiento. Es vital mantener registros y soportes.", multimedia: { audioScript: "La importancia de la documentación y de tener una estructura clara de responsabilidades.", videoConcept: { title: "El Equipo de Cumplimiento", script: "Organigrama animado que muestra al Oficial de Cumplimiento y su interacción con la gerencia, la junta y las áreas operativas." } } }
      ],
      slides: [
        { title: "Elementos del SARLAFT", points: ["Políticas", "Procedimientos", "Documentación", "Estructura Organizacional", "Órganos de Control", "Tecnología", "Divulgación y Capacitación"], imageConcept: "Diagrama de engranajes interconectados, cada uno con un elemento." },
        { title: "El Oficial de Cumplimiento", points: ["Líder del sistema", "Vela por el cumplimiento normativo", "Reporta a la junta directiva"], imageConcept: "Avatar de un profesional con un escudo y una lupa." },
        { title: "Manual de Políticas SARLAFT", points: ["Documento maestro", "Debe ser aprobado por la junta", "Debe revisarse y actualizarse periódicamente"], imageConcept: "Ícono de un libro o manual sellado." },
        { title: "La Importancia de la Capacitación", points: ["Todo el personal debe ser capacitado", "La capacitación debe ser periódica y documentada", "Genera cultura de prevención"], imageConcept: "Grupo de personas en un aula o seminario." },
        { title: "Órganos de Control", points: ["Revisoría Fiscal", "Auditoría Interna", "Junta de Vigilancia"], imageConcept: "Ilustración de tres figuras con roles de supervisión." }
      ],
      interactiveGameIdeas: [interactiveGameIdeas[5]],
    },
     {
      id: 5,
      title: "Fases de la Gestión del Riesgo",
      description: "El ciclo continuo de identificar, medir, controlar y monitorear los riesgos de LA/FT.",
      submodules: [
        { id: "5-1", title: "Identificación", content: "Reconocer y documentar los riesgos de LA/FT a los que está expuesta la entidad a través de sus factores de riesgo (asociados, productos, canales, jurisdicciones).", multimedia: { audioScript: "La identificación es el primer paso: no se puede gestionar un riesgo que no se conoce.", videoConcept: { title: "Usando el Radar de Riesgos", script: "Animación de una pantalla de radar donde 'blips' aparecen representando diferentes riesgos potenciales en cada factor." } } },
        { id: "5-2", title: "Medición", content: "Estimar la probabilidad de ocurrencia de los riesgos identificados y su impacto potencial en caso de materializarse. Se utilizan matrices de riesgo para calificar el riesgo.", multimedia: { audioScript: "Cómo pasar de identificar un riesgo a medir su posible impacto.", videoConcept: { title: "La Matriz de Riesgo Interactiva", script: "Una matriz de probabilidad vs. impacto donde se arrastran riesgos a diferentes cuadrantes para ver su calificación (Bajo, Medio, Alto, Extremo)." } } },
        { id: "5-3", title: "Control", content: "Adoptar medidas para mitigar los riesgos. Incluye la aplicación de la debida diligencia, el establecimiento de controles en los procesos y el uso de herramientas tecnológicas.", multimedia: { audioScript: "Una vez medido el riesgo, ¿qué hacemos al respecto? Implementar controles.", videoConcept: { title: "Construyendo la Muralla de Controles", script: "Animación que muestra cómo se van añadiendo 'ladrillos' de control (políticas, software, capacitación) para reducir la exposición al riesgo." } } },
        { id: "5-4", title: "Monitoreo", content: "Vigilar de forma continua el perfil de riesgo de la entidad y la efectividad de los controles. Esto permite detectar operaciones inusuales y ajustar el sistema.", multimedia: { audioScript: "El monitoreo cierra el ciclo y lo reinicia. Es un proceso dinámico y constante.", videoConcept: { title: "El Ciclo PDCA del Riesgo", script: "Diagrama animado del ciclo Planificar-Hacer-Verificar-Actuar (PHVA) aplicado a la gestión de riesgos de LA/FT, mostrando su naturaleza cíclica." } } }
      ],
      slides: [
        { title: "Ciclo de Gestión de Riesgo", points: ["1. Identificar", "2. Medir", "3. Controlar", "4. Monitorear"], imageConcept: "Diagrama circular con las 4 fases en secuencia." },
        { title: "Matriz de Riesgo", points: ["Eje X: Probabilidad", "Eje Y: Impacto", "Califica el Riesgo Inherente y Residual"], imageConcept: "Ejemplo gráfico de una matriz de riesgo 5x5." },
        { title: "Tipos de Controles", points: ["Preventivos (evitan que ocurra)", "Detectivos (identifican si ocurrió)", "Correctivos (remedian el impacto)"], imageConcept: "Iconos para cada tipo de control: un pare, una lupa, una curita." },
        { title: "Riesgo Inherente vs. Residual", points: ["Inherente: Riesgo sin controles", "Residual: Riesgo que permanece después de aplicar controles"], imageConcept: "Gráfico de barras mostrando cómo el riesgo residual es menor que el inherente." },
        { title: "El Monitoreo es Clave", points: ["Detecta comportamientos atípicos", "Genera alertas", "Permite ajustar el sistema"], imageConcept: "Icono de un tablero de control con gráficos y alertas." }
      ],
      interactiveGameIdeas: [interactiveGameIdeas[1]],
    },
    {
      id: 6,
      title: "Señales de Alerta e Indicadores",
      description: "Aprender a reconocer comportamientos y operaciones que pueden indicar actividades de LA/FT.",
      submodules: [
        { id: "6-1", title: "¿Qué es una Señal de Alerta?", content: "Una señal de alerta es una circunstancia o comportamiento que se desvía de lo normal y que podría indicar una posible actividad de lavado de activos o financiación del terrorismo. Es crucial diferenciar entre una operación 'inusual' (se sale del patrón transaccional del asociado) y una 'sospechosa' (la inusualidad no tiene justificación lógica o económica).", multimedia: { audioScript: "Diferencia clave entre inusual y sospechoso. La señal de alerta es el primer indicio que debemos analizar.", videoConcept: { title: "El Termómetro del Riesgo", script: "Animación de un termómetro que sube de 'Normal' a 'Inusual' y luego a 'Sospechoso' a medida que se suman características atípicas a una transacción." } } },
        { id: "6-2", title: "Señales de Alerta Transaccionales", content: "Se refieren al movimiento de dinero. Incluyen el uso excesivo de efectivo, operaciones fraccionadas ('pitufeo') para evitar controles, transacciones a países de alto riesgo sin razón aparente, y el movimiento rápido de fondos entre diferentes productos o entidades.", multimedia: { audioScript: "Ejemplos concretos de transacciones que deben llamar nuestra atención inmediata.", videoConcept: { title: "Patrones Reveladores", script: "Visualización de flujos de dinero mostrando transacciones normales vs. transacciones con patrones de pitufeo o triangulación." } } },
        { id: "6-3", title: "Señales de Alerta Comportamentales y Documentales", content: "El comportamiento del asociado también es una fuente de alertas. Por ejemplo, nerviosismo excesivo, renuencia a entregar información, o presentar documentación que parece falsa o inconsistente. La identidad del asociado y la veracidad de sus documentos son la base de la prevención.", multimedia: { audioScript: "No solo es el dinero, es la persona. Aprende a identificar las banderas rojas en el comportamiento y los documentos.", videoConcept: { title: "Más Allá de los Números", script: "Escenas cortas que muestran interacciones con asociados ficticios, resaltando comportamientos sospechosos y documentos alterados." } } },
      ],
      slides: [
        { title: "Definición: Inusual vs. Sospechosa", points: ["Inusual: Se sale del patrón del cliente", "Sospechosa: Inusual Y sin justificación aparente", "Toda operación sospechosa fue primero inusual"], imageConcept: "Diagrama de Venn mostrando la relación entre operaciones normales, inusuales y sospechosas." },
        { title: "Tipología de Señales de Alerta", points: ["Transaccionales (el dinero)", "Comportamentales (la persona)", "Documentales (los soportes)"], imageConcept: "Tres iconos: una bolsa de dinero, una silueta de persona con un signo de interrogación, y un documento con una lupa." },
        { title: "Ejemplo Clave: El Pitufeo", points: ["Múltiples depósitos pequeños", "En diferentes oficinas o por diferentes personas", "Buscan eludir el reporte de transacciones en efectivo"], imageConcept: "Ilustración de varios 'pitufos' (personas) llevando pequeñas bolsas de dinero a una misma cuenta." },
        { title: "El Cliente que no Quiere ser Conocido", points: ["Evita contacto personal", "Proporciona información vaga o incompleta", "Se molesta ante preguntas de debida diligencia"], imageConcept: "Una figura sombría que entrega un formulario con campos vacíos." },
        { title: "Acción ante una Señal de Alerta", points: ["NO alertar al asociado", "Analizar internamente la operación", "Documentar todo el análisis", "Si la sospecha persiste, reportar a la UIAF"], imageConcept: "Un flujograma simple del proceso de análisis interno." },
      ],
      interactiveGameIdeas: [interactiveGameIdeas[4]],
    },
    {
      id: 7,
      title: "Debida Diligencia",
      description: "El proceso de conocimiento del asociado/cliente, desde la vinculación hasta la actualización.",
      submodules: [
        { id: "7-1", title: "El Principio: Conozca a su Asociado (KYC)", content: "La Debida Diligencia, o Know Your Customer (KYC), es el conjunto de procedimientos para identificar a nuestros asociados y entender la naturaleza de sus actividades. No es solo un requisito de vinculación, sino un proceso continuo para prevenir que la entidad sea utilizada para fines ilícitos.", multimedia: { audioScript: "El KYC es el pilar sobre el cual se construye todo el SARLAFT. Sin conocer al asociado, estamos ciegos.", videoConcept: { title: "La Cédula del Riesgo", script: "Animación que muestra cómo se construye un perfil de asociado, añadiendo capas de información (identidad, actividad, transacciones) para crear una imagen completa." } } },
        { id: "7-2", title: "Niveles de Debida Diligencia", content: "No todos los asociados presentan el mismo riesgo. Por ello, la diligencia se aplica en diferentes niveles: Simplificada (para riesgo bajo, ej. asociados de bajo monto), Normal (el estándar para la mayoría) e Intensificada (para riesgo alto, ej. Personas Expuestas Políticamente - PEPs, o transacciones complejas).", multimedia: { audioScript: "A cada riesgo, su medida. Aprende a aplicar el nivel correcto de escrutinio para cada asociado.", videoConcept: { title: "El Zoom del Investigador", script: "Una lupa que se ajusta: un 'zoom' bajo para diligencia simplificada y un 'zoom' muy alto para la intensificada, mostrando el nivel de detalle requerido en cada caso." } } },
        { id: "7-3", title: "Identificación del Beneficiario Final", content: "Es fundamental saber quién es la persona natural que finalmente posee o controla al asociado (si es una persona jurídica) o en cuyo nombre se realiza una transacción. Ocultar al beneficiario final es una táctica común en el LA/FT, por lo que su identificación es obligatoria.", multimedia: { audioScript: "No te quedes en la superficie. Debemos identificar a la persona de carne y hueso detrás de cualquier operación.", videoConcept: { title: "Detrás del Telón", script: "Animación de una empresa (fachada) donde una cámara atraviesa varias capas para revelar a la persona que realmente la controla." } } },
      ],
      slides: [
        { title: "El Proceso de Debida Diligencia (DD)", points: ["1. Identificación (¿Quién es?)", "2. Verificación (¿Es quien dice ser?)", "3. Monitoreo (¿Cómo se comporta?)"], imageConcept: "Un ciclo de 3 pasos con iconos para cada uno: una tarjeta de identidad, una marca de cheque y un gráfico de actividad." },
        { title: "Documentos Clave en la Vinculación", points: ["Documento de identidad válido", "Formulario de vinculación completo", "Soportes de actividad económica", "Declaración de origen de fondos"], imageConcept: "Una carpeta con varios tipos de documentos asomándose." },
        { title: "Debida Diligencia Intensificada", points: ["Se aplica a clientes de alto riesgo (PEPs, etc.)", "Requiere información adicional y aprobación de un nivel superior", "Monitoreo transaccional más frecuente y profundo"], imageConcept: "Un semáforo en rojo, indicando la necesidad de un control más estricto." },
        { title: "La Importancia de la Actualización", points: ["El perfil del asociado puede cambiar", "La información desactualizada pierde valor", "La normativa exige actualización periódica"], imageConcept: "Un calendario con una fecha resaltada para recordar la actualización de datos." },
        { title: "Beneficiario Final", points: ["Persona natural que posee/controla al cliente", "Es obligatorio identificarlo", "Evita el uso de empresas fachada"], imageConcept: "Una estructura de muñecas rusas (matrioskas), donde la más pequeña es el beneficiario final." }
      ],
      interactiveGameIdeas: [interactiveGameIdeas[7]],
    },
    {
      id: 8,
      title: "Reportes a la UIAF",
      description: "Cuándo y cómo reportar operaciones sospechosas (ROS) y transacciones en efectivo.",
      submodules: [
        { id: "8-1", title: "El Reporte de Operación Sospechosa (ROS)", content: "Un ROS es el informe que la entidad envía a la UIAF cuando, después de un análisis interno, concluye que una operación inusual no tiene una justificación razonable y podría estar vinculada a LA/FT. Este reporte es confidencial y es la principal herramienta para que las autoridades investiguen.", multimedia: { audioScript: "El ROS es el producto final de nuestro análisis y nuestra contribución más importante a la lucha contra el crimen.", videoConcept: { title: "De la Alerta a la Acción", script: "Un flujograma animado que muestra el camino: Operación -> Señal de Alerta -> Análisis Interno -> Conclusión de Sospecha -> Generación del ROS." } } },
        { id: "8-2", title: "La Prohibición de Preaviso ('Tipping Off')", content: "Bajo ninguna circunstancia se debe comunicar al asociado o a terceros que se ha reportado o se va a reportar una operación a la UIAF. Hacerlo es un delito, ya que alerta a los criminales y entorpece las investigaciones. El silencio y la confidencialidad son absolutos.", multimedia: { audioScript: "Recuerda la regla de oro: lo que se analiza y reporta, no se comenta con el cliente. Nunca.", videoConcept: { title: "Silencio, se Investiga", script: "Una animación de un dedo sobre unos labios pidiendo silencio, con la palabra 'CONFIDENCIAL' estampada." } } },
        { id: "8-3", title: "Otros Reportes Relevantes", content: "Además del ROS, las entidades deben enviar reportes objetivos a la UIAF. Los más comunes son el Reporte de Transacciones en Efectivo (individuales y múltiples) que superan ciertos umbrales, y el Reporte de Ausencia de Operaciones Sospechosas (cuando no hubo ROS en un periodo).", multimedia: { audioScript: "No todo es sospechoso. Hay reportes que se hacen de forma automática al cumplir ciertas condiciones, como el monto en efectivo.", videoConcept: { title: "El Calendario del Reportante", script: "Un calendario animado que muestra las fechas límite para los diferentes tipos de reportes a la UIAF (ROS, Efectivo, Ausencia)." } } },
      ],
      slides: [
        { title: "Anatomía de un ROS", points: ["Descripción de la operación sospechosa", "Análisis que justifica la sospecha", "Identificación de personas y productos involucrados", "Debe ser claro, conciso y completo"], imageConcept: "La estructura de un documento de reporte, con secciones bien definidas." },
        { title: "Plazo para Enviar un ROS", points: ["Debe ser reportado de forma INMEDIATA", "Una vez se determina que la operación es sospechosa", "La agilidad es clave para las autoridades"], imageConcept: "Un reloj corriendo, enfatizando la urgencia." },
        { title: "Reporte de Transacciones en Efectivo", points: ["Se reportan transacciones individuales sobre un umbral", "También transacciones múltiples que sumen un umbral en un mes", "Es un reporte objetivo, no implica sospecha"], imageConcept: "Una pila de billetes con una etiqueta que indica el monto umbral." },
        { title: "El Sistema SIREL de la UIAF", points: ["Plataforma en línea para el envío de reportes", "Es seguro y confidencial", "La entidad debe tener un usuario registrado"], imageConcept: "La pantalla de inicio de sesión de una plataforma web segura." },
        { title: "Consecuencias de NO Reportar", points: ["Sanciones administrativas de la Supersolidaria", "Posible complicidad en delitos de LA/FT", "Debilita todo el sistema de prevención nacional"], imageConcept: "Una cadena con un eslabón roto, simbolizando la falla en el sistema." }
      ],
      interactiveGameIdeas: [interactiveGameIdeas[8]],
    },
    {
      id: 9,
      title: "Sanciones y Consecuencias",
      description: "El costo del incumplimiento: sanciones administrativas, penales y el impacto reputacional.",
      submodules: [
        { id: "9-1", title: "Sanciones Administrativas", content: "La Superintendencia de la Economía Solidaria es la encargada de vigilar el cumplimiento del SARLAFT. En caso de fallas, puede imponer sanciones que van desde multas millonarias a la entidad y a los administradores, hasta la remoción de directivos o incluso la toma de posesión de la entidad.", multimedia: { audioScript: "Incumplir SARLAFT tiene un costo directo. Las multas de la Supersolidaria pueden afectar seriamente la viabilidad de la entidad.", videoConcept: { title: "El Martillo del Supervisor", script: "Animación de un martillo de juez con el logo de la Supersolidaria golpeando, y billetes y títulos de cargos saliendo volando." } } },
        { id: "9-2", title: "Responsabilidad Penal", content: "El incumplimiento puede ir más allá de una multa. Si se demuestra que un empleado o directivo, por acción u omisión, facilitó el lavado de activos, puede enfrentar un proceso penal por delitos como el lavado de activos, omisión de control o testaferrato, con penas de prisión.", multimedia: { audioScript: "Esto es serio. Una falla en SARLAFT no solo cuesta dinero, puede costar la libertad.", videoConcept: { title: "De la Oficina a la Corte", script: "Una transición de un escritorio de oficina a una sala de tribunal, mostrando que las decisiones (u omisiones) tienen consecuencias legais." } } },
        { id: "9-3", title: "El Daño Reputacional: La Peor Sanción", content: "La sanción más difícil de superar es la pérdida de confianza. Una entidad solidaria vinculada a un escándalo de LA/FT pierde su activo más valioso: la confianza de sus asociados, del sector financiero y de la comunidad. Esto puede llevar a la quiebra, incluso si sobrevive a las multas.", multimedia: { audioScript: "El dinero se recupera, la reputación no. El daño reputacional es la verdadera sentencia de muerte para una entidad solidaria.", videoConcept: { title: "El Castillo de Naipes", script: "Animación de un sólido castillo de naipes con la palabra 'Confianza' que se derrumba al ser tocado por una ficha de dominó llamada 'Escándalo'." } } },
      ],
      slides: [
        { title: "El Costo del Incumplimiento", points: ["Sanciones de la Supersolidaria", "Responsabilidad penal para directivos y empleados", "Pérdida de la confianza de los asociados", "Contagio a otras entidades del sector"], imageConcept: "Un iceberg donde la multa visible es pequeña, y las consecuencias penales y reputacionales son la gran masa oculta bajo el agua." },
        { title: "Actuaciones de la Supersolidaria", points: ["Visitas de inspección", "Requerimientos de información", "Imposición de multas", "Remoción de administradores"], imageConcept: "Iconos para cada acción: una lupa, un documento, una bolsa de dinero con un signo menos, y una figura de persona siendo expulsada." },
        { title: "Delitos Penales Asociados", points: ["Lavado de Activos (Art. 323 C.P.)", "Omisión de Reporte (Art. 325 C.P.)", "Enriquecimiento Ilícito (Art. 327 C.P.)", "Testaferrato (Art. 326 C.P.)"], imageConcept: "Un libro de código penal abierto en las páginas de los artículos mencionados." },
        { title: "Riesgo de Contagio", points: ["El descrédito de una entidad puede afectar a otras", "Pánico financiero entre asociados del sector", "Endurecimiento de las relaciones con el sistema bancario"], imageConcept: "Una serie de fichas de dominó cayendo, la primera etiquetada como 'Entidad Incumplida'." },
        { title: "La Prevención es la Mejor Inversión", points: ["Un SARLAFT robusto protege a la entidad", "Genera confianza y transparencia", "Es un factor de sostenibilidad a largo plazo"], imageConcept: "Un escudo protegiendo el logo de una cooperativa." }
      ],
      interactiveGameIdeas: [interactiveGameIdeas[9]],
    },
    {
      id: 10,
      title: "Tecnologías y Herramientas",
      description: "El rol del software y la tecnología en la automatización y eficiencia del SARLAFT.",
      submodules: [
        { id: "10-1", title: "Automatización del Monitoreo", content: "Revisar miles de transacciones manualmente es imposible. El software de monitoreo transaccional es una herramienta esencial que aplica reglas y modelos de comportamiento para analizar operaciones en tiempo real y generar alertas automáticas sobre aquellas que se desvían de la normalidad, permitiendo al equipo de cumplimiento enfocarse en el análisis.", multimedia: { audioScript: "La tecnología es nuestro mejor aliado. Permite hacer en segundos lo que a un humano le tomaría años.", videoConcept: { title: "El Vigilante Digital", script: "Animación de un flujo masivo de datos transaccionales que pasa por un 'filtro' de software, el cual resalta en rojo las transacciones sospechosas y las envía a un analista." } } },
        { id: "10-2", title: "Verificación en Listas Restrictivas", content: "Las entidades deben asegurarse de no tener relaciones con personas o empresas incluidas en listas de sanción nacionales e internacionales (como las de la ONU o la OFAC de EE.UU.). Las herramientas tecnológicas automatizan el cruce de las bases de datos de asociados y terceros contra estas listas de forma periódica y en tiempo real.", multimedia: { audioScript: "Verificar en listas es una obligación. La tecnología lo hace posible de forma eficiente y segura.", videoConcept: { title: "El Escáner de Listas", script: "Una base de datos de asociados pasa por un escáner que la compara con varias listas restrictivas internacionales, emitiendo una alerta cuando encuentra una coincidencia." } } },
        { id: "10-3", title: "Inteligencia Artificial y Futuro", content: "El futuro de la prevención de LA/FT está en la inteligencia artificial (IA) y el machine learning. Estos sistemas pueden aprender los patrones de comportamiento de los asociados y detectar anomalías mucho más sutiles y complejas que las reglas tradicionales, reduciendo los 'falsos positivos' y descubriendo nuevas tipologías de lavado.", multimedia: { audioScript: "La IA no reemplaza al analista, le da superpoderes para detectar lo que antes era invisible.", videoConcept: { title: "Cerebro vs. Supercomputadora", script: "Comparación animada entre un analista revisando alertas manualmente y otro usando una herramienta de IA que le presenta conexiones y patrones ocultos en los datos." } } },
      ],
      slides: [
        { title: "Tecnología: Pilar del SARLAFT", points: ["Eficiencia en el monitoreo", "Precisión en la verificación", "Consistencia en los procesos", "Trazabilidad y documentación"], imageConcept: "Un cerebro humano conectado a una red de engranajes digitales." },
        { title: "Componentes de un Software SARLAFT", points: ["Módulo de segmentación", "Motor de monitoreo de alertas", "Gestor de casos de operaciones inusuales", "Verificación en listas"], imageConcept: "Un tablero de control (dashboard) de software con diferentes módulos." },
        { title: "Listas Restrictivas Clave", points: ["Listas ONU (Consejo de Seguridad)", "Lista OFAC (Lista Clinton)", "Listas de la Contraloría y Procuraduría (Colombia)", "Listas de PEPs"], imageConcept: "Varios logos de las organizaciones que emiten las listas." },
        { title: "Falsos Positivos vs. Falsos Negativos", points: ["Falso Positivo: Alerta que no es sospechosa", "Falso Negativo: Operación sospechosa que no genera alerta (¡El peor!)", "La tecnología busca reducir ambos"], imageConcept: "Una balanza tratando de equilibrar los dos tipos de errores." },
        { title: "El Rol del Analista Humano", points: ["La tecnología genera alertas, no conclusiones", "El juicio experto es insustituible", "El analista investiga, documenta y decide si reportar"], imageConcept: "Una persona analizando los datos que le presenta una pantalla de alta tecnología." }
      ],
      interactiveGameIdeas: [interactiveGameIdeas[6], interactiveGameIdeas[10]],
    },
  ],
  caseStudies: [
    { id: 1, scenario: "Un asociado, dueño de un pequeño restaurante, comienza a realizar depósitos mensuales en efectivo por $50 millones de pesos, cuando su promedio histórico era de $10 millones. Al preguntarle, dice que 'el negocio ha mejorado mucho'.", question: "¿Qué acción es la más apropiada?", options: ["Felicitarlo por su éxito.", "Actualizar sus datos sin más preguntas.", "Documentar el caso como operación inusual y realizar un monitoreo intensificado.", "Reportarlo inmediatamente a la UIAF como operación sospechosa."], correctAnswerIndex: 2, explanation: "El cambio drástico e injustificado en el comportamiento transaccional es una operación inusual. Se debe investigar internamente y monitorear antes de concluir si es sospechosa y requiere un ROS." },
    { id: 2, scenario: "Una persona solicita asociarse y pide realizar un depósito inicial de una suma considerable desde una cuenta en un país considerado paraíso fiscal y listado por el GAFI como de alto riesgo.", question: "¿Cuál es el principal riesgo a considerar?", options: ["Riesgo de mercado.", "Riesgo de crédito.", "Riesgo de LA/FT por jurisdicción.", "Riesgo operativo."], correctAnswerIndex: 2, explanation: "La procedencia de los fondos desde una jurisdicción de alto riesgo es una señal de alerta inmediata que exige una debida diligencia ampliada." },
    { id: 3, scenario: "La esposa de un alcalde de un municipio pequeño se asocia a la cooperativa y solicita un crédito de libre inversión por un monto elevado, presentando soportes de ingresos que no parecen consistentes con su actividad económica declarada (ama de casa).", question: "¿Qué se debe hacer?", options: ["Aprobar el crédito, ya que es la esposa del alcalde.", "Negar el crédito por falta de soportes.", "Aplicar una debida diligencia intensificada por ser una PEP por asociación y analizar a fondo los soportes.", "Pedirle al alcalde que sea el codeudor del crédito."], correctAnswerIndex: 2, explanation: "Al ser cónyuge de una Persona Expuesta Políticamente (PEP), se le debe aplicar una debida diligencia intensificada. Esto implica un análisis más riguroso de sus soportes financieros y el origen de sus fondos antes de tomar una decisión." },
    { id: 4, scenario: "Una empresa de importaciones recién creada solicita vincularse. Su estructura de propiedad es compleja, con varias capas de otras empresas en el extranjero, haciendo difícil identificar al beneficiario final.", question: "¿Qué señal de alerta se presenta?", options: ["Uso de efectivo.", "Estructura corporativa inusual para ocultar al beneficiario final.", "Transacciones internacionales.", "Actividad económica de alto riesgo."], correctAnswerIndex: 1, explanation: "Las estructuras corporativas complejas y opacas son una táctica común para ocultar la identidad de la persona natural que realmente controla la empresa, lo cual es una señal de alerta clave de LA/FT." },
    { id: 5, scenario: "Un asociado que tenía un crédito por $100 millones de pesos se acerca a la oficina con el dinero en efectivo para cancelarlo en su totalidad, a pesar de que aún le quedaban varios años para pagarlo.", question: "¿Cuál es la acción correcta?", options: ["Aceptar el pago y cancelar el crédito sin más trámites.", "Realizar el reporte de transacciones en efectivo y documentar la operación como inusual para su análisis.", "Informarle que no puede pagar en efectivo.", "Sugerirle que consigne el dinero en una cuenta y pague por transferencia."], correctAnswerIndex: 1, explanation: "El pago anticipado de una deuda grande con efectivo es una señal de alerta. Se debe aceptar el dinero, realizar el reporte de transacciones en efectivo correspondiente y, además, analizar la operación como inusual para determinar si es sospechosa." },
    { id: 6, scenario: "Un asociado recibe múltiples transferencias de bajo monto desde diferentes ciudades del país, sin una relación aparente entre los remitentes. Inmediatamente después de recibir los fondos, los retira en su totalidad.", question: "¿Qué tipología de LA/FT podría ser esta?", options: ["Contrabando.", "Pitufeo o fraccionamiento.", "Uso de empresas fachada.", "Exportaciones ficticias."], correctAnswerIndex: 1, explanation: "Recibir múltiples depósitos pequeños de diversas fuentes que luego se consolidan y retiran es una característica clásica del 'pitufeo' o 'smurfing', utilizado para introducir grandes cantidades de dinero ilícito al sistema financiero en pequeñas porciones." },
    { id: 7, scenario: "Al realizar la actualización de datos, un asociado se muestra nervioso, evasivo y se niega a entregar los soportes de su nueva actividad económica, argumentando que es 'información personal'.", question: "¿Qué tipo de señal de alerta predomina?", options: ["Transaccional.", "Documental.", "Comportamental.", "Jurisdiccional."], correctAnswerIndex: 2, explanation: "La renuencia a proporcionar información, el nerviosismo y el comportamiento evasivo son señales de alerta comportamentales que indican que el asociado podría estar ocultando algo." },
    { id: 8, scenario: "Un proveedor de la cooperativa, contratado para servicios de tecnología, insiste en que el pago se realice a una cuenta en el exterior a nombre de una tercera persona no relacionada con su empresa.", question: "¿Qué debería hacer el Oficial de Cumplimiento?", options: ["Realizar el pago como lo solicita el proveedor.", "Negarse a pagar hasta que proporcione una cuenta a nombre de su empresa.", "Investigar la relación entre el proveedor y el tercero, y documentar la situación como una posible operación sospechosa.", "Consultar al gerente si autoriza el pago."], correctAnswerIndex: 2, explanation: "La solicitud de pagar a un tercero no relacionado, especialmente en el exterior, es una señal de alerta significativa. Requiere un análisis profundo para descartar que se esté triangulando dinero para fines ilícitos." },
    { id: 9, scenario: "Un joven de 20 años, sin historial crediticio y con ingresos declarados de un salario mínimo, recibe un giro de 50.000 dólares desde un país conocido por la producción de drogas. Al día siguiente, intenta retirar todo el dinero.", question: "¿Qué acción es la más prudente?", options: ["Entregar el dinero sin preguntas.", "Bloquear la cuenta del asociado inmediatamente.", "Retrasar la operación, hacer preguntas para entender la razón de la transacción y, si no hay justificación, reportar como operación sospechosa.", "Llamar a la policía."], correctAnswerIndex: 2, explanation: "La combinación de factores (edad, perfil de ingresos, monto, país de origen) crea una operación altamente inusual. El procedimiento correcto es analizarla, indagar con el asociado y, ante la falta de una explicación lógica y verificable, generar un ROS a la UIAF." },
    { id: 10, scenario: "Durante el monitoreo, se detecta que un cajero de la cooperativa ha realizado múltiples transacciones fraccionadas en la cuenta de un familiar cercano, que no parecen tener relación con la actividad económica de dicho familiar.", question: "¿Qué riesgo se está materializando?", options: ["Riesgo legal.", "Riesgo de contagio.", "Riesgo operativo por posible complicidad de un empleado interno.", "Riesgo reputacional."], correctAnswerIndex: 2, explanation: "Cuando un empleado utiliza su posición para facilitar operaciones potencialmente ilícitas, se materializa un riesgo operativo. Es una de las situaciones más graves, ya que implica una vulnerabilidad interna." },
  ],
  finalQuiz: [
    { id: 1, question: "¿Cuáles son las tres etapas del lavado de activos en orden correcto?", options: ["Integración, Colocación, Estratificación", "Colocación, Estratificación, Integración", "Estratificación, Integración, Colocación", "Colocación, Integración, Estratificación"], correctAnswerIndex: 1 },
    { id: 2, question: "La entidad del estado colombiano encargada de recibir los Reportes de Operaciones Sospechosas (ROS) es:", options: ["La Superintendencia Financiera", "La Fiscalía General de la Nación", "La Unidad de Información y Análisis Financiero (UIAF)", "La DIAN"], correctAnswerIndex: 2 },
    { id: 3, question: "Según la normativa de la Supersolidaria, ¿quién es el máximo responsable de la aprobación de las políticas de SARLAFT en una entidad solidaria?", options: ["El Oficial de Cumplimiento", "El Gerente General", "El Consejo de Administración o Junta Directiva", "El Revisor Fiscal"], correctAnswerIndex: 2 },
    { id: 4, question: "Alertar a un asociado que está siendo objeto de un reporte a la UIAF es un delito conocido como:", options: ["Lavado de activos.", "Omisión de control.", "Pitufeo.", "Tipping Off o preaviso."], correctAnswerIndex: 3 },
    { id: 5, question: "Aplicar una debida diligencia más estricta a un cliente por ser un alcalde se conoce como:", options: ["Debida Diligencia Simplificada.", "Debida Diligencia Intensificada.", "Conocimiento del Cliente Básico.", "Monitoreo Transaccional."], correctAnswerIndex: 1 },
    { id: 6, question: "¿Cuál de los siguientes NO es uno de los cuatro factores de riesgo de LA/FT?", options: ["Clientes/Asociados", "Productos/Servicios", "Canales de Distribución", "Rentabilidad de la Entidad"], correctAnswerIndex: 3 },
    { id: 7, question: "La diferencia principal entre una operación inusual y una sospechosa es:", options: ["El monto de la operación.", "Que la inusual no tiene una justificación lógica o económica aparente.", "Que la sospechosa siempre involucra efectivo.", "No hay ninguna diferencia."], correctAnswerIndex: 1 },
    { id: 8, question: "El principal objetivo de la segmentación en SARLAFT es:", options: ["Clasificar a los clientes por su nivel de ingresos.", "Facilitar la detección de operaciones que se salen del comportamiento normal de un grupo.", "Ofrecer productos personalizados a cada asociado.", "Cumplir con un requisito normativo sin un fin práctico."], correctAnswerIndex: 1 },
    { id: 9, question: "El incumplimiento del SARLAFT puede acarrear sanciones de tipo:", options: ["Solo administrativas (multas).", "Solo penales (prisión).", "Administrativas, penales y reputacionales.", "Solo reputacionales."], correctAnswerIndex: 2 },
    { id: 10, question: "¿Quién tiene la responsabilidad final de determinar si una operación inusual debe ser reportada como sospechosa a la UIAF?", options: ["El software de monitoreo.", "El gerente de la oficina.", "El analista humano y/o el Oficial de Cumplimiento.", "La Junta de Vigilancia."], correctAnswerIndex: 2 },
  ],
};