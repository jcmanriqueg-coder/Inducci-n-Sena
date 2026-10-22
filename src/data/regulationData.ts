import { ModuleData, Badge } from '../types';

export const SENA_BADGES: Badge[] = [
  {
    id: 'badge-identidad',
    name: 'Espíritu SENA',
    description: 'Completaste el módulo de Principios, Símbolos y Misión Institucional.',
    icon: 'Sparkles',
    xpValue: 100,
    criteria: 'Superar Módulo 1',
    unlocked: false,
  },
  {
    id: 'badge-derechos',
    name: 'Defensor de Derechos',
    description: 'Dominas los derechos del aprendiz, bienestar estudiantil y garantías fundamentales.',
    icon: 'ShieldCheck',
    xpValue: 150,
    criteria: 'Superar Módulo 2',
    unlocked: false,
  },
  {
    id: 'badge-deberes',
    name: 'Líder en Convivencia',
    description: 'Comprometido con los deberes éticos, porte del carné y seguridad en ambientes de formación.',
    icon: 'Award',
    xpValue: 150,
    criteria: 'Superar Módulo 3',
    unlocked: false,
  },
  {
    id: 'badge-integridad',
    name: 'Guardián de la Integridad',
    description: 'Identificas con precisión las prohibiciones, tipos de faltas y el valor de la honestidad académica.',
    icon: 'Scale',
    xpValue: 150,
    criteria: 'Superar Módulo 4',
    unlocked: false,
  },
  {
    id: 'badge-debido-proceso',
    name: 'Maestro del Debido Proceso',
    description: 'Comprendes las medidas formativas, planes de mejoramiento y el Comité de Evaluación.',
    icon: 'BookOpenCheck',
    xpValue: 200,
    criteria: 'Superar Módulo 5',
    unlocked: false,
  },
  {
    id: 'badge-gestion-academica',
    name: 'Estratega Académico',
    description: 'Conoces los trámites de novedades: traslados, aplazamientos, reingresos y retiros.',
    icon: 'FileText',
    xpValue: 150,
    criteria: 'Superar Módulo 6',
    unlocked: false,
  },
  {
    id: 'badge-casos-reales',
    name: 'Solucionador de Dilemas',
    description: 'Resolviste con éxito al menos 3 casos prácticos en el Simulador de Decisiones.',
    icon: 'Compass',
    xpValue: 250,
    criteria: 'Resolver 3 escenarios prácticos',
    unlocked: false,
  },
  {
    id: 'badge-graduado-induccion',
    name: 'Aprendiz Certificado',
    description: 'Completaste satisfactoriamente la Inducción General del Reglamento SENA con más del 80%.',
    icon: 'Trophy',
    xpValue: 500,
    criteria: 'Aprobar la Evaluación Final',
    unlocked: false,
  },
];

export const INDUCTION_MODULES: ModuleData[] = [
  {
    id: 'mod-1',
    order: 1,
    title: 'Módulo 1: Identidad SENA, Principios y Formación Integral',
    shortTitle: 'Identidad y Principios',
    description: 'Conoce la historia, misión, símbolos patrios e institucionales y el modelo pedagógico de Formación Profesional Integral (FPI).',
    iconName: 'Building2',
    badgeId: 'badge-identidad',
    durationMinutes: 12,
    xpReward: 200,
    chapters: [
      {
        id: 'cap-1-1',
        title: 'Misión, Visión y Naturaleza del SENA',
        articleRef: 'Acuerdo 009 de 2024 - Capítulo I, Art. 1-3',
        summary: 'El SENA está encargado de cumplir la función que le corresponde al Estado de invertir en el desarrollo social y técnico de los trabajadores colombianos.',
        content: [
          'El Servicio Nacional de Aprendizaje (SENA) ofrece y ejecuta la formación profesional integral para la incorporación de las personas en actividades productivas que contribuyan al desarrollo social, económico y tecnológico del país.',
          'La Formación Profesional Integral (FPI) promueve el desarrollo armónico del ser humano en tres dimensiones: el Saber (conocimiento técnico y conceptual), el Saber Hacer (habilidades prácticas, destrezas aplicadas) y el Saber Ser (ética, ciudadanía, convivencia y respeto).',
          'El aprendiz SENA es el protagonista de su proceso de formación, asumiendo una actitud reflexiva, autónoma, investigativa y crítica frente a los desafíos productivos y sociales.'
        ],
        keyHighlights: [
          'Entidad adscrita al Ministerio del Trabajo.',
          'Formación gratuita, inclusiva y con enfoque por competencias.',
          'El centro del modelo pedagógico es el Aprendiz.'
        ],
        practicalApplication: 'Cuando participes en proyectos formativos, se evaluarán tanto tus resultados técnicos como tus actitudes de trabajo colaborativo y valores ciudadanos.'
      },
      {
        id: 'cap-1-2',
        title: 'Símbolos Institucionales del SENA',
        articleRef: 'Estatuto Institucional y Acuerdo 009 de 2024',
        summary: 'El Escudo, la Bandera, el Himno y el Logo-símbolo representan la identidad y los sectores económicos de Colombia.',
        content: [
          'El Escudo y la Bandera: Reflejan los tres sectores de la economía nacional: la rueda dentada (industria y construcción), el caduceo (comercio y servicios) y la rama de café (sector agropecuario).',
          'El Logo-símbolo: Muestra una figura estilizada de un ser humano que camina hacia el futuro, cruzando un sendero de oportunidades y aprendizaje permanente.',
          'El Himno del SENA: Compuesto para inspirar trabajo, disciplina, patria y superación personal en cada jornada de formación.'
        ],
        keyHighlights: [
          'El color verde institucional simboliza esperanza, juventud y crecimiento.',
          'El respeto a los símbolos institucionales es un compromiso de todo aprendiz.'
        ],
        practicalApplication: 'En ceremonias, eventos de centros de formación y actos protocolarios, entonamos el himno y portamos con honor los distintivos institucionales.'
      }
    ],
    quiz: [
      {
        id: 'q-1-1',
        category: 'principios',
        points: 50,
        question: '¿Qué dimensiones integran la Formación Profesional Integral (FPI) en el SENA?',
        options: [
          {
            id: 'opt-1',
            text: 'Únicamente el conocimiento teórico para aprobar exámenes escritos.',
            isCorrect: false,
            explanation: 'La formación en el SENA va mucho más allá de la teoría; es integral y práctica.',
            articleRef: 'Capítulo I'
          },
          {
            id: 'opt-2',
            text: 'El Saber (conocimientos), el Saber Hacer (destrezas prácticas) y el Saber Ser (ética, actitud y convivencia).',
            isCorrect: true,
            explanation: '¡Excelente! La FPI busca formar ciudadanos competentes tanto técnica como éticamente.',
            articleRef: 'Acuerdo 009 de 2024, Art. 2'
          },
          {
            id: 'opt-3',
            text: 'Solamente el cumplimiento de horas de asistencia física en talleres.',
            isCorrect: false,
            explanation: 'Las horas son un requerimiento, pero el modelo integral evalúa el desarrollo de competencias en sus tres dimensiones.',
            articleRef: 'Capítulo I'
          }
        ]
      },
      {
        id: 'q-1-2',
        category: 'principios',
        points: 50,
        question: '¿Qué sectores de la economía representan los elementos del escudo del SENA?',
        options: [
          {
            id: 'opt-1',
            text: 'Sector financiero, sector de telecomunicaciones y sector minero.',
            isCorrect: false,
            explanation: 'Los elementos tradicionales del escudo representan Industria/Construcción, Comercio/Servicios y Sector Agropecuario.',
            articleRef: 'Símbolos SENA'
          },
          {
            id: 'opt-2',
            text: 'Industria y Construcción (rueda dentada), Comercio y Servicios (caduceo) y Sector Agropecuario (café).',
            isCorrect: true,
            explanation: '¡Correcto! Los tres sectores fundamentales de la producción en Colombia.',
            articleRef: 'Símbolos SENA'
          },
          {
            id: 'opt-3',
            text: 'Sector público, sector militar y sector eclesiástico.',
            isCorrect: false,
            explanation: 'El SENA enfoca su formación en los sectores productivos y sociales de la economía.',
            articleRef: 'Símbolos SENA'
          }
        ]
      }
    ]
  },
  {
    id: 'mod-2',
    order: 2,
    title: 'Módulo 2: Derechos del Aprendiz SENA',
    shortTitle: 'Derechos del Aprendiz',
    description: 'Descubre las garantías, servicios de bienestar, representación democrática y oportunidades que te asisten como aprendiz matriculado.',
    iconName: 'ShieldCheck',
    badgeId: 'badge-derechos',
    durationMinutes: 15,
    xpReward: 250,
    chapters: [
      {
        id: 'cap-2-1',
        title: 'Derechos Académicos y de Formación',
        articleRef: 'Acuerdo 009 de 2024 - Capítulo II, Art. 7',
        summary: 'Todo aprendiz matriculado goza de derechos fundamentales para garantizar su aprendizaje de excelencia.',
        content: [
          'Derecho a recibir inducción completa al inicio de su formación profesional sobre la institución, el programa y el reglamento.',
          'Derecho a una formación con calidad, con instructores idóneos, metodología activa y uso adecuado de la tecnología.',
          'Derecho a disponer de los recursos físicos, técnicos, bibliográficos, plataformas virtuales (LMS) y ambientes de aprendizaje necesarios.',
          'Derecho a conocer al inicio de cada competencia los resultados de aprendizaje, los criterios e instrumentos de evaluación.',
          'Derecho a ser evaluado con justicia, equidad y objetividad, con retroalimentación oportuna en un plazo no mayor a cinco (5) días hábiles tras la entrega de evidencias.',
          'Derecho a solicitar revisión respetuosa de sus evaluaciones ante el instructor o ante el comité en caso de inconformidad fundamentada.'
        ],
        keyHighlights: [
          'Inducción institucional obligatoria y de calidad.',
          'Conocer de antemano qué y cómo serás evaluado.',
          'Retroalimentación formativa oportuna (máximo 5 días hábiles).'
        ],
        practicalApplication: 'Si tras entregar una evidencia pasan los días reglamentarios sin calificación o no comprendes el motivo de la no aprobación, tienes el derecho de solicitar retroalimentación respetuosa y constructiva a tu instructor.'
      },
      {
        id: 'cap-2-2',
        title: 'Derechos de Bienestar, Participación y No Discriminación',
        articleRef: 'Acuerdo 009 de 2024 - Capítulo II, Art. 8',
        summary: 'El SENA protege integralmente a su comunidad con programas de salud, cultura, deportes y representación democrática.',
        content: [
          'Derecho a beneficiarse de los programas del Plan Nacional de Bienestar al Aprendiz (salud integral, recreación, cultura, deporte, consejería psicosocial).',
          'Derecho a postularse y acceder a los apoyos de sostenimiento (regular, FIC) y monitorías de acuerdo con los requisitos socioeconómicos y de rendimiento académico de cada convocatoria.',
          'Derecho a elegir y ser elegido vocero de ficha o representante general de aprendices del Centro de Formación.',
          'Derecho a no ser discriminado por razones de sexo, orientación sexual, identidad de género, raza, etnia, religión, condición de discapacidad u opiniones políticas.',
          'Derecho al debido proceso en cualquier actuación disciplinaria o académica que se adelante en su contra.'
        ],
        keyHighlights: [
          'Acceso a Bienestar al Aprendiz y auxilios socioeconómicos vigentes.',
          'Garantía total de igualdad y no discriminación.',
          'Participación democrática mediante vocerías y comités.'
        ],
        practicalApplication: 'Puedes postularte como vocero de ficha en las primeras semanas de inducción para representar a tus compañeros ante el equipo ejecutor de instructores y la coordinación académica.'
      }
    ],
    quiz: [
      {
        id: 'q-2-1',
        category: 'derechos',
        points: 50,
        question: '¿En qué plazo máximo reglamentario debe el instructor retroalimentar y calificar una evidencia de aprendizaje entregada?',
        options: [
          {
            id: 'opt-1',
            text: 'En un plazo no mayor a cinco (5) días hábiles tras la entrega formal de la evidencia.',
            isCorrect: true,
            explanation: '¡Exacto! El aprendiz tiene derecho a conocer oportunamente el resultado de sus evaluaciones para corregir y avanzar.',
            articleRef: 'Acuerdo 009 de 2024, Art. 7'
          },
          {
            id: 'opt-2',
            text: 'Al finalizar todo el año lectivo o etapa productiva.',
            isCorrect: false,
            explanation: 'Falso. Las evaluaciones deben ser continuas y oportunas durante el desarrollo de cada competencia.',
            articleRef: 'Capítulo II'
          },
          {
            id: 'opt-3',
            text: 'No existe plazo, queda a criterio discrecional del instructor.',
            isCorrect: false,
            explanation: 'El reglamento del aprendiz fija términos claros para garantizar el derecho a la evaluación oportuna.',
            articleRef: 'Capítulo II'
          }
        ]
      },
      {
        id: 'q-2-2',
        category: 'derechos',
        points: 50,
        question: '¿Qué beneficios hacen parte del Plan de Bienestar al Aprendiz en el SENA?',
        options: [
          {
            id: 'opt-1',
            text: 'Exclusivamente préstamo de libros físicos en la biblioteca del centro.',
            isCorrect: false,
            explanation: 'La biblioteca es un recurso educativo, pero Bienestar abarca salud, deporte, cultura, apoyos económicos y psicosociales.',
            articleRef: 'Bienestar al Aprendiz'
          },
          {
            id: 'opt-2',
            text: 'Actividades deportivas, culturales, acompañamiento psicosocial, convocatorias a monitorías y apoyos de sostenimiento.',
            isCorrect: true,
            explanation: '¡Excelente! Bienestar al Aprendiz busca el desarrollo integral de la persona y la permanencia educativa.',
            articleRef: 'Acuerdo 009 de 2024, Art. 8'
          },
          {
            id: 'opt-3',
            text: 'Pago obligatorio de sueldos de ejecutivo a todos los estudiantes.',
            isCorrect: false,
            explanation: 'Los aprendices en etapa lectiva pueden acceder a apoyos o patrocinio mediante contrato de aprendizaje, no sueldos de nómina regular directos de la entidad.',
            articleRef: 'Capítulo II'
          }
        ]
      }
    ]
  },
  {
    id: 'mod-3',
    order: 3,
    title: 'Módulo 3: Deberes y Normas de Convivencia',
    shortTitle: 'Deberes del Aprendiz',
    description: 'Aprende los compromisos éticos, el porte del carné institucional, la puntualidad, justificación de inasistencias y cuidado de ambientes.',
    iconName: 'Award',
    badgeId: 'badge-deberes',
    durationMinutes: 15,
    xpReward: 250,
    chapters: [
      {
        id: 'cap-3-1',
        title: 'Deberes Académicos y Personales',
        articleRef: 'Acuerdo 009 de 2024 - Capítulo III, Art. 9',
        summary: 'Los deberes son compromisos que aseguran el orden, el respeto y la excelencia en el aprendizaje.',
        content: [
          'Cumplir con todas las actividades formativas programadas en el plan de estudio (tanto en etapa lectiva como en etapa productiva).',
          'Portar visiblemente el carné institucional en todo momento dentro de las sedes y ambientes del SENA o donde se desarrollen actividades de formación.',
          'Asistir con puntualidad a las sesiones presenciales, sincrónicas y prácticas de campo.',
          'Justificar oportunamente las inasistencias dentro de los tres (3) días hábiles siguientes al hecho, adjuntando soporte médico avalado o certificación válida de fuerza mayor.',
          'Respetar los derechos de autor: citar debidamente fuentes bibliográficas y presentar trabajos de autoría propia.',
          'Utilizar los elementos de protección personal (EPP) y ropa de trabajo adecuada exigida en talleres, laboratorios y plantas de producción.'
        ],
        keyHighlights: [
          'Porte de carné visible y personal e intransferible.',
          'Justificación de inasistencias en máximo 3 días hábiles.',
          'Uso obligatorio de EPP en ambientes técnicos de riesgo.'
        ],
        practicalApplication: 'Si te enfermas y no puedes asistir, debes tramitar tu incapacidad ante tu EPS o entidad de salud y remitir el soporte formal a tu instructor y coordinador dentro de los 3 días hábiles posteriores.'
      },
      {
        id: 'cap-3-2',
        title: 'Deberes de Convivencia y Cuidado Institucional',
        articleRef: 'Acuerdo 009 de 2024 - Capítulo III, Art. 10',
        summary: 'La vida en comunidad requiere respeto recíproco y preservación de los recursos públicos.',
        content: [
          'Tratar con respeto, cortesía y tolerancia a todos los miembros de la comunidad educativa (instructores, compañeros, directivos, personal administrativo y de servicios generales).',
          'Hacer uso responsable y ético de las tecnologías de la información, plataformas virtuales (Zajuna), cuentas de correo institucional (@misena) y redes sociales.',
          'Cuidar y responder por los equipos, herramientas, software, mobiliario y recursos del centro formativo puestos a su disposición.',
          'Contribuir al cuidado del medio ambiente: separar residuos en la fuente, apagar luces y equipos al terminar la jornada.',
          'Acatar las normas de seguridad y salud en el trabajo (SST) y planes de evacuación del centro.'
        ],
        keyHighlights: [
          'Trato digno sin insultos, burlas ni discriminación.',
          'Uso responsable de cuentas institucionales y plataformas virtuales.',
          'Cuidado activo de equipos y recursos de talleres.'
        ],
        practicalApplication: 'Al finalizar la práctica en el taller de soldadura, sistemas o cocina, cada aprendiz debe verificar el orden, limpieza y apagado de las máquinas asignadas.'
      }
    ],
    quiz: [
      {
        id: 'q-3-1',
        category: 'deberes',
        points: 50,
        question: '¿Cuántos días hábiles tiene el aprendiz para justificar una inasistencia ante el instructor o centro de formación?',
        options: [
          {
            id: 'opt-1',
            text: 'Hasta un mes después de haber ocurrido la inasistencia.',
            isCorrect: false,
            explanation: 'Un mes excede por completo el plazo reglamentario y genera reporte por deserción.',
            articleRef: 'Capítulo III'
          },
          {
            id: 'opt-2',
            text: 'Dentro de los tres (3) días hábiles siguientes al hecho con su respectivo soporte válido.',
            isCorrect: true,
            explanation: '¡Correcto! El plazo fijado por el Acuerdo 009 de 2024 es de máximo 3 días hábiles con soporte legal o médico.',
            articleRef: 'Acuerdo 009 de 2024, Art. 9'
          },
          {
            id: 'opt-3',
            text: 'No es necesario justificar las inasistencias en el SENA.',
            isCorrect: false,
            explanation: 'La asistencia es obligatoria para garantizar el desarrollo de competencias prácticas y técnicas.',
            articleRef: 'Capítulo III'
          }
        ]
      },
      {
        id: 'q-3-2',
        category: 'deberes',
        points: 50,
        question: '¿Por qué es obligatorio portar visiblemente el carné del SENA?',
        options: [
          {
            id: 'opt-1',
            text: 'Por seguridad, identificación institucional y control de acceso a instalaciones y recursos.',
            isCorrect: true,
            explanation: '¡Así es! El carné garantiza la seguridad de toda la comunidad educativa y es intransferible.',
            articleRef: 'Acuerdo 009 de 2024, Art. 9'
          },
          {
            id: 'opt-2',
            text: 'Es solo opcional para los días que haya eventos deportivos.',
            isCorrect: false,
            explanation: 'El carné debe portarse de manera visible en todo momento dentro de las instalaciones.',
            articleRef: 'Capítulo III'
          },
          {
            id: 'opt-3',
            text: 'Para prestárselo a amigos o familiares que quieran conocer la sede.',
            isCorrect: false,
            explanation: 'El carné es personal e intransferible; prestarlo constituye una falta disciplinaria.',
            articleRef: 'Capítulo IV'
          }
        ]
      }
    ]
  },
  {
    id: 'mod-4',
    order: 4,
    title: 'Módulo 4: Prohibiciones y Clasificación de Faltas',
    shortTitle: 'Prohibiciones y Faltas',
    description: 'Identifica las conductas prohibidas, qué constituye falta académica o disciplinaria, y su clasificación en leves, graves o gravísimas.',
    iconName: 'Scale',
    badgeId: 'badge-integridad',
    durationMinutes: 14,
    xpReward: 250,
    chapters: [
      {
        id: 'cap-4-1',
        title: 'Prohibiciones Expresas en el SENA',
        articleRef: 'Acuerdo 009 de 2024 - Capítulo IV, Art. 11',
        summary: 'Conductas taxativamente prohibidas para preservar la seguridad física, moral y académica.',
        content: [
          'Plagiar, copiar, comercializar o suplantar en la elaboración y entrega de evidencias de aprendizaje o evaluaciones.',
          'Suplantar la identidad de otro aprendiz o permitir que otro lo suplante en actividades presenciales o virtuales.',
          'Ingresar, consumir o comercializar bebidas alcohólicas o sustancias psicoactivas en las instalaciones del SENA o en actividades formativas.',
          'Ingresar o portar cualquier tipo de armas, explosivos u objetos cortopunzantes no autorizados en los ambientes del SENA.',
          'Cometer actos de violencia física, verbal, psicológica o ciberacoso contra compañeros, instructores o funcionarios.',
          'Dañar, sustraer o dar mal uso a bienes, equipos, insumos o documentación oficial del SENA o de empresas coformadoras.',
          'Utilizar el nombre o logotipo del SENA para beneficio personal o campañas de proselitismo político o religioso.'
        ],
        keyHighlights: [
          'Tolerancia cero a plagio, fraude y suplantación.',
          'Prohibición absoluta de armas, alcohol y drogas en centros formativos.',
          'Sanción estricta frente al acoso y la agresión física o verbal.'
        ],
        practicalApplication: 'Copiar código de internet o un trabajo de un compañero sin citar y presentarlo como evidencia propia es plagio y acarrea proceso disciplinario.'
      },
      {
        id: 'cap-4-2',
        title: 'Clasificación y Criterios de Calificación de las Faltas',
        articleRef: 'Acuerdo 009 de 2024 - Capítulo V, Art. 12-15',
        summary: 'Las faltas pueden ser de índole académica o disciplinaria, graduándose en leves, graves o gravísimas.',
        content: [
          'Faltas Académicas: Se configuran cuando el aprendiz incumple sus compromisos formativos, no entrega evidencias, incurre en bajo rendimiento sin causa justificada o acumula inasistencias no excusadas.',
          'Faltas Disciplinarias: Se configuran cuando la conducta quebranta los deberes de convivencia, el respeto mutuo, la ética institucional o incurre en las prohibiciones expresas.',
          'Grados de la falta: Leves (afectación menor subsanable), Graves (impacto notable en la convivencia o el proceso formativo) y Gravísimas (conductas dolosas, delitos, violencia grave, consumo/porte de drogas o armas, daño patrimonial severo).',
          'Criterios para calificar la falta: Grado de culpabilidad (dolo o culpa), daño causado, reiteración o reincidencia, confesión previa y antecedentes disciplinarios del aprendiz.'
        ],
        keyHighlights: [
          'Diferenciación entre falta académica y falta disciplinaria.',
          'Escala de gravedad: Leve, Grave y Gravísima.',
          'Análisis de atenuantes y agravantes en cada caso concreto.'
        ],
        practicalApplication: 'Llegar tarde de manera ocasional puede ser advertido como llamado verbal; reincidir de forma sistemática o alterar el registro de asistencia eleva la falta a grave.'
      }
    ],
    quiz: [
      {
        id: 'q-4-1',
        category: 'prohibiciones',
        points: 50,
        question: '¿Qué consecuencia directa tiene presentar un proyecto copiado de internet como autoría propia?',
        options: [
          {
            id: 'opt-1',
            text: 'Constituye plagio, una falta que vulnera la honestidad académica y activa un proceso formativo o disciplinario.',
            isCorrect: true,
            explanation: '¡Correcto! El plagio atenta contra la ética profesional y académica en el SENA.',
            articleRef: 'Acuerdo 009 de 2024, Art. 11'
          },
          {
            id: 'opt-2',
            text: 'Está permitido siempre y cuando no se entere el instructor técnico.',
            isCorrect: false,
            explanation: 'Es una prohibición expresa en cualquier modalidad de formación.',
            articleRef: 'Capítulo IV'
          },
          {
            id: 'opt-3',
            text: 'Se premia por tener habilidad para buscar información velozmente en la web.',
            isCorrect: false,
            explanation: 'Buscar información es valioso, pero presentarla como propia sin citar es una falta contra los derechos de autor.',
            articleRef: 'Capítulo IV'
          }
        ]
      },
      {
        id: 'q-4-2',
        category: 'prohibiciones',
        points: 50,
        question: '¿Cómo se clasifica legalmente la falta en caso de agresiones físicas o porte de armas en el centro de formación?',
        options: [
          {
            id: 'opt-1',
            text: 'Falta Leve que se soluciona con una disculpa informal.',
            isCorrect: false,
            explanation: 'Poner en riesgo la integridad física de las personas nunca es considerado una falta leve.',
            articleRef: 'Capítulo V'
          },
          {
            id: 'opt-2',
            text: 'Falta Gravísima por poner en riesgo inminente la vida y seguridad de la comunidad educativa.',
            isCorrect: true,
            explanation: '¡Totalmente cierto! El porte de armas y la agresión física son faltas gravísimas que conllevan cancelación de matrícula e informe a autoridades competentes.',
            articleRef: 'Acuerdo 009 de 2024, Art. 14'
          },
          {
            id: 'opt-3',
            text: 'Inconveniente personal ajeno al reglamento del aprendiz.',
            isCorrect: false,
            explanation: 'Afecta la seguridad del centro y está expresamente tipificado en el régimen disciplinario.',
            articleRef: 'Capítulo V'
          }
        ]
      }
    ]
  },
  {
    id: 'mod-5',
    order: 5,
    title: 'Módulo 5: Medidas Formativas, Sanciones y Debido Proceso',
    shortTitle: 'Medidas y Debido Proceso',
    description: 'Comprende la diferencia pedagógica entre medidas formativas (llamados verbales, planes de mejoramiento) y sanciones disciplinarias, y el rol del Comité de Evaluación.',
    iconName: 'BookOpenCheck',
    badgeId: 'badge-debido-proceso',
    durationMinutes: 16,
    xpReward: 300,
    chapters: [
      {
        id: 'cap-5-1',
        title: 'Medidas Formativas (Enfoque Pedagógico)',
        articleRef: 'Acuerdo 009 de 2024 - Capítulo VI, Art. 16-18',
        summary: 'Las medidas formativas son acciones pedagógicas orientadas a la reflexión, cambio de actitud y superación de dificultades sin constituir sanción.',
        content: [
          'El propósito fundamental del SENA no es castigar, sino educar y transformar vidas con un enfoque preventivo y restaurativo.',
          'Llamado de atención verbal reflexivo: Diálogo pedagógico y privado entre el instructor o coordinador y el aprendiz para analizar la situación y asumir compromisos personales.',
          'Plan de Mejoramiento Académico: Medida concertada para superar resultados de aprendizaje no alcanzados. Se definen actividades complementarias, evidencias a entregar y fecha límite.',
          'Plan de Mejoramiento Disciplinario: Compromisos de convivencia o comunitarios orientados a fortalecer valores de respeto, puntualidad y responsabilidad ciudadana.',
          'Las medidas formativas no quedan registradas como sanciones en la hoja de vida académica del aprendiz.'
        ],
        keyHighlights: [
          'Enfoque restaurativo y pedagógico antes que punitivo.',
          'Planes de mejoramiento concertados con fechas y evidencias claras.',
          'No constituyen mancha ni sanción en la hoja de vida.'
        ],
        practicalApplication: 'Si tuviste bajo rendimiento en un resultado de aprendizaje de programación o contabilidad, el instructor formulará un Plan de Mejoramiento con un cronograma para que logres la competencia.'
      },
      {
        id: 'cap-5-2',
        title: 'Sanciones Disciplinarias y Comité de Evaluación',
        articleRef: 'Acuerdo 009 de 2024 - Capítulo VI & VII, Art. 19-24',
        summary: 'Cuando la falta es grave o no se superan las medidas formativas, se adelanta un debido proceso ante el Comité de Evaluación y Seguimiento.',
        content: [
          'Sanciones oficiales (aplicadas únicamente mediante acto administrativo motivado del Subdirector de Centro):',
          '1. Llamado de atención formal por escrito con copia a la hoja de vida en el sistema de gestión académica.',
          '2. Condicionamiento de matrícula: El aprendiz continúa sus estudios pero bajo compromiso formal de estricto cumplimiento; si reincide, se procede a cancelación.',
          '3. Cancelación de matrícula: Pérdida definitiva del cupo en el programa de formación, con inhabilidad para matricularse en el SENA entre 6 meses y 2 años según la gravedad.',
          'Debido Proceso: Todo aprendiz tiene derecho a ser notificado por escrito de los cargos formulados, disponer de cinco (5) días hábiles para presentar descargos y pruebas, ser escuchado en audiencia ante el Comité, y presentar recurso de reposición frente a la decisión.'
        ],
        keyHighlights: [
          'Las sanciones solo las decreta el Subdirector de Centro.',
          'Garantía plena del derecho a la defensa y contradicción (5 días hábiles para descargos).',
          'Derecho a interponer Recurso de Reposición.'
        ],
        practicalApplication: 'Si eres citado a un Comité de Evaluación, tienes derecho a conocer previamente el informe que lo originó, llevar tus pruebas de descargo y hacer uso de la palabra para defender tu posición.'
      }
    ],
    quiz: [
      {
        id: 'q-5-1',
        category: 'medidas_sanciones',
        points: 50,
        question: '¿Cuál es la naturaleza y objetivo principal de un Plan de Mejoramiento en el SENA?',
        options: [
          {
            id: 'opt-1',
            text: 'Es una acción pedagógica concertada para superar deficiencias académicas o de convivencia, sin ser una sanción disciplinaria.',
            isCorrect: true,
            explanation: '¡Excelente! Los planes de mejoramiento son instrumentos de aprendizaje y superación pedagógica.',
            articleRef: 'Acuerdo 009 de 2024, Art. 17'
          },
          {
            id: 'opt-2',
            text: 'Una expulsión inmediata del centro de formación sin posibilidad de defensa.',
            isCorrect: false,
            explanation: 'El plan de mejoramiento busca precisamente apoyar al aprendiz para que culmine con éxito su formación.',
            articleRef: 'Capítulo VI'
          },
          {
            id: 'opt-3',
            text: 'Una multa económica en dinero a favor del centro de formación.',
            isCorrect: false,
            explanation: 'En el SENA no existen sanciones económicas para los aprendices.',
            articleRef: 'Capítulo VI'
          }
        ]
      },
      {
        id: 'q-5-2',
        category: 'medidas_sanciones',
        points: 50,
        question: '¿Qué garantía constitucional y reglamentaria ampara al aprendiz antes de aplicarle cualquier sanción formal?',
        options: [
          {
            id: 'opt-1',
            text: 'El derecho al Debido Proceso: notificación, traslado de cargos, término de 5 días hábiles para descargos y recurso de reposición.',
            isCorrect: true,
            explanation: '¡Exacto! El debido proceso es inviolable en todas las actuaciones académicas y disciplinarias.',
            articleRef: 'Acuerdo 009 de 2024, Art. 22'
          },
          {
            id: 'opt-2',
            text: 'Ninguna garantía; la sanción se impone de forma automática e inapelable.',
            isCorrect: false,
            explanation: 'Toda sanción sin debido proceso carece de validez legal.',
            articleRef: 'Capítulo VI'
          },
          {
            id: 'opt-3',
            text: 'Solo aplica si el estudiante contrata un abogado particular externo.',
            isCorrect: false,
            explanation: 'El aprendiz puede ejercer su propia defensa directamente o acompañado por su vocero o acudiente si es menor de edad.',
            articleRef: 'Capítulo VI'
          }
        ]
      }
    ]
  },
  {
    id: 'mod-6',
    order: 6,
    title: 'Módulo 6: Trámites y Novedades Académicas',
    shortTitle: 'Trámites y Novedades',
    description: 'Aprende los procedimientos formales para aplazamiento, traslado, reingreso, retiro voluntario y alternativas de etapa productiva.',
    iconName: 'FileText',
    badgeId: 'badge-gestion-academica',
    durationMinutes: 14,
    xpReward: 250,
    chapters: [
      {
        id: 'cap-6-1',
        title: 'Trámites de Novedades del Aprendiz',
        articleRef: 'Acuerdo 009 de 2024 - Capítulo VIII, Art. 25-28',
        summary: 'Los trámites académicos permiten gestionar situaciones personales imprevistas de manera ordenada y legal.',
        content: [
          'Aplazamiento: Solicitud formal que hace el aprendiz para suspender temporalmente su proceso formativo por fuerza mayor, caso fortuito, enfermedad comprobada, maternidad/paternidad o servicio militar, hasta por seis (6) meses (prorrogables por causa justificada).',
          'Reingreso: Solicitud escrita radicada por el aprendiz para reanudar su formación tras un aplazamiento, sujeta a disponibilidad de cupo en un programa igual o afín.',
          'Traslado: Solicitud de cambio de Centro de Formación o de jornada formativa en el mismo programa, condicionado a que haya cupo disponible y el aprendiz no tenga sanciones vigentes.',
          'Retiro Voluntario: Manifestación escrita, libre y espontánea del aprendiz donde informa su decisión de no continuar en el programa. No genera la inhabilidad de 6 meses si se realiza formalmente antes de incurrir en deserción.'
        ],
        keyHighlights: [
          'Radicar el aplazamiento a tiempo evita reportes de deserción.',
          'El reingreso debe solicitarse antes del vencimiento del periodo de aplazamiento.',
          'El retiro voluntario oportuno previene sanciones de inhabilidad para futuros programas.'
        ],
        practicalApplication: 'Si consigues un empleo en horario incompatible con tu formación presencial diurna, debes solicitar formalmente un traslado de jornada a la nocturna o mixta a través del sistema SofiaPlus/Zajuna.'
      },
      {
        id: 'cap-6-2',
        title: 'Etapa Productiva: Alternativas y Cumplimiento',
        articleRef: 'Acuerdo 009 de 2024 - Etapa Práctica Institucional',
        summary: 'La etapa productiva permite aplicar en el mundo laboral real las competencias desarrolladas durante la etapa lectiva.',
        content: [
          'Alternativas válidas para certificar la etapa productiva:',
          '1. Contrato de Aprendizaje (patrocinio empresarial con apoyo de sostenimiento y afiliación a ARL y EPS).',
          '2. Vínculo laboral o contractual (desempeño de funciones directamente relacionadas con el programa).',
          '3. Proyecto Productivo (iniciativa de emprendimiento asesorada por el Fondo Emprender o el Centro de Formación).',
          '4. Monitoría en el SENA en áreas afines al programa de formación.',
          '5. Pasantía o práctica en ONGs, entidades públicas o unidades productivas familiares.',
          'Seguimiento: Todo aprendiz en etapa productiva tiene un instructor de seguimiento asignado y debe concertar y entregar bitácoras periódicas de desempeño.'
        ],
        keyHighlights: [
          'Múltiples alternativas para culminar la formación (contrato, proyecto, pasantía, vínculo).',
          'Obligación de registrar y concertar bitácoras de seguimiento periódicas.',
          'El cumplimiento satisfactorio de la etapa productiva es requisito indispensable para la titulación.'
        ],
        practicalApplication: 'Si tienes una idea de negocio innovadora, puedes optar por Proyecto Productivo como modalidad de etapa productiva y recibir asesoría de los gestores de emprendimiento del SENA.'
      }
    ],
    quiz: [
      {
        id: 'q-6-1',
        category: 'tramites',
        points: 50,
        question: '¿Por cuánto tiempo máximo puede un aprendiz solicitar el aplazamiento de su formación por causa justificada?',
        options: [
          {
            id: 'opt-1',
            text: 'Hasta por seis (6) meses, prorrogables por una sola vez según la justificación comprobada.',
            isCorrect: true,
            explanation: '¡Correcto! El término general es de hasta 6 meses con opción de prórroga sustentada.',
            articleRef: 'Acuerdo 009 de 2024, Art. 25'
          },
          {
            id: 'opt-2',
            text: 'Máximo por tres (3) días calendario.',
            isCorrect: false,
            explanation: 'Tres días es el plazo para justificar una inasistencia médica, no el término de un aplazamiento.',
            articleRef: 'Capítulo VIII'
          },
          {
            id: 'opt-3',
            text: 'Tiempo indefinido sin necesidad de reingresar.',
            isCorrect: false,
            explanation: 'El aplazamiento tiene un límite legal para garantizar la vigencia del diseño curricular del programa.',
            articleRef: 'Capítulo VIII'
          }
        ]
      },
      {
        id: 'q-6-2',
        category: 'tramites',
        points: 50,
        question: '¿Cuáles son alternativas reconocidas para realizar la etapa productiva en el SENA?',
        options: [
          {
            id: 'opt-1',
            text: 'Exclusivamente el contrato de aprendizaje; ninguna otra modalidad es admitida.',
            isCorrect: false,
            explanation: 'Aunque el contrato de aprendizaje es muy común, existen múltiples alternativas legales.',
            articleRef: 'Etapa Productiva'
          },
          {
            id: 'opt-2',
            text: 'Contrato de aprendizaje, vínculo laboral afín, proyecto productivo de emprendimiento, pasantía y monitorías.',
            isCorrect: true,
            explanation: '¡Excelente! El SENA ofrece flexibilidad de modalidades para que cada aprendiz aplique sus competencias en el entorno real.',
            articleRef: 'Acuerdo 009 de 2024, Art. 28'
          },
          {
            id: 'opt-3',
            text: 'Ver tutoriales en redes sociales desde el hogar.',
            isCorrect: false,
            explanation: 'La etapa productiva exige aplicación práctica comprobada en un entorno laboral, comunitario o emprendimiento real.',
            articleRef: 'Etapa Productiva'
          }
        ]
      }
    ]
  }
];
