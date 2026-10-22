import { RealCaseScenario } from '../types';

export const CASE_SCENARIOS: RealCaseScenario[] = [
  {
    id: 'case-1-plagio',
    title: 'Caso 1: La Entrega de Medianoche y el Código Prestado',
    moduleCategory: 'Prohibiciones & Integridad Académica',
    contextLocation: 'Ambiente de Formación Virtual y LMS',
    characters: 'Camilo (Aprendiz de ADSO), Laura (Compañera de equipo) e Instructor Técnico',
    situation: 'Son las 11:30 PM del domingo y a medianoche cierra la plataforma para subir la evidencia final del trimestre (un aplicativo web con base de datos). El compañero de Camilo no aportó su parte a tiempo. Camilo encuentra en un repositorio público de GitHub un proyecto idéntico desarrollado por un programador externo. Laura le sugiere descargarlo, cambiarle los nombres y logos, y entregarlo para no perder la competencia.',
    dilemma: '¿Qué debe hacer Camilo frente a la presión del tiempo y la propuesta de su compañera?',
    choices: [
      {
        id: 'c1-opt-a',
        actionText: 'Subir el proyecto descargado de GitHub alterando solo las portadas para salvar la entrega.',
        isBestDecision: false,
        xpGained: 10,
        consequenceType: 'danger',
        outcomeDescription: 'El instructor pasa el código por el sistema de detección de similitud de software. Se comprueba plagio doloso. El caso es remitido de inmediato al Comité de Evaluación y Seguimiento por presunta falta grave contra la propiedad intelectual.',
        legalBasis: 'Acuerdo 009 de 2024, Art. 11: Queda terminantemente prohibido plagiar o presentar obras ajenas como propias en evidencias de formación.'
      },
      {
        id: 'c1-opt-b',
        actionText: 'Entregar únicamente la parte del proyecto que Camilo desarrolló con autoría propia, documentando honestamente el alcance en el informe y solicitando retroalimentación técnica.',
        isBestDecision: true,
        xpGained: 100,
        consequenceType: 'success',
        outcomeDescription: 'El instructor valora la transparencia y ética profesional del aprendiz. Aunque la evidencia queda pendiente en el porcentaje faltante, el instructor concerta un Plan de Mejoramiento pedagógico de 5 días hábiles para que Camilo complete el módulo sin manchar su expediente.',
        legalBasis: 'Acuerdo 009 de 2024, Art. 17: Ante deficiencias en la consecución de resultados, procede la concertación pedagógica de un Plan de Mejoramiento formativo.'
      },
      {
        id: 'c1-opt-c',
        actionText: 'No entregar nada y no responder los mensajes del instructor durante tres semanas seguidas.',
        isBestDecision: false,
        xpGained: 0,
        consequenceType: 'danger',
        outcomeDescription: 'Pasados los 3 días hábiles sin justificación ni comunicación, el sistema reporta presunta deserción académica y se inicia el trámite de cancelación de matrícula con inhabilidad de 6 meses.',
        legalBasis: 'Acuerdo 009 de 2024, Art. 9 y 26: La inasistencia o inactividad injustificada por más de tres días consecutivos activa el procedimiento de deserción.'
      }
    ]
  },
  {
    id: 'case-2-inasistencia',
    title: 'Caso 2: Emergencia Médica y el Plazo Reglamentario',
    moduleCategory: 'Deberes & Justificación de Inasistencias',
    contextLocation: 'Centro de Biotecnología Agropecuaria / Sala de Urgencias',
    characters: 'Valentina (Aprendiz), Médico de Turno y Coordinación Académica',
    situation: 'Valentina tuvo un accidente de tránsito en su bicicleta el martes en la mañana camino al centro de formación y debió ser hospitalizada por una fractura. No pudo asistir a las prácticas presenciales de biotecnología durante el resto de la semana. Su instructor técnico registra las inasistencias en el sistema.',
    dilemma: '¿Cómo debe proceder Valentina o su acudiente para amparar su condición académica según el reglamento?',
    choices: [
      {
        id: 'c2-opt-a',
        actionText: 'Esperar a recuperarse totalmente dentro de 4 semanas y luego presentarse a explicar de palabra lo ocurrido.',
        isBestDecision: false,
        xpGained: 20,
        consequenceType: 'warning',
        outcomeDescription: 'Al pasar más de un mes sin radicación formal, la coordinación ya habrá emitido el llamado preventivo por inasistencias injustificadas, complicando el proceso administrativo.',
        legalBasis: 'Acuerdo 009 de 2024, Art. 9: El plazo reglamentario para justificar formalmente las inasistencias es de máximo tres (3) días hábiles con soporte válido.'
      },
      {
        id: 'c2-opt-b',
        actionText: 'Solicitar a un familiar que remita por correo electrónico a la coordinación y al instructor la constancia médica de la EPS dentro de los 3 días hábiles, y solicitar el plan pedagógico para ponerse al día.',
        isBestDecision: true,
        xpGained: 100,
        consequenceType: 'success',
        outcomeDescription: 'La inasistencia queda formalmente justificada como caso fortuito. La coordinación autoriza a los instructores la entrega de guías de aprendizaje y talleres flexibles durante su periodo de reposo en casa.',
        legalBasis: 'Acuerdo 009 de 2024, Art. 9 y 10: Justificación oportuna y oportuna reanudación con garantías de inclusión y bienestar al aprendiz.'
      },
      {
        id: 'c2-opt-c',
        actionText: 'Falsificar una incapacidad médica descargada de una plantilla de internet para no pedirle el favor a nadie.',
        isBestDecision: false,
        xpGained: 0,
        consequenceType: 'danger',
        outcomeDescription: 'La coordinación verifica el número de registro médico en el sistema de salud. Al comprobar la falsedad en documento privado, se califica como falta gravísima, acarreando cancelación de matrícula y reporte a la Fiscalía General de la Nación.',
        legalBasis: 'Acuerdo 009 de 2024, Art. 11 y 14: La falsedad o alteración de documentos es una falta gravísima con consecuencias penales y disciplinarias.'
      }
    ]
  },
  {
    id: 'case-3-epp',
    title: 'Caso 3: Seguridad Industrial en el Taller de Mecatrónica',
    moduleCategory: 'Deberes & Seguridad y Salud en el Trabajo',
    contextLocation: 'Taller de Mecatrónica y Torno CNC',
    characters: 'Andrés (Aprendiz), Santiago (Compañero) e Instructor de Taller',
    situation: 'Hace mucho calor en el taller y Andrés olvida sus gafas de protección y botas punta de acero en el casillero. Además, tiene el cabello suelto. Al sonar la campana de inicio de operación en los tornos, su compañero Santiago le dice que entre rápido y disimule para que no le pongan retardo.',
    dilemma: '¿Qué debe hacer Andrés antes de manipular maquinaria rotativa?',
    choices: [
      {
        id: 'c3-opt-a',
        actionText: 'Iniciar la máquina rápidamente sin los EPP para no perder la explicación del instructor.',
        isBestDecision: false,
        xpGained: 0,
        consequenceType: 'danger',
        outcomeDescription: 'Riesgo inminente de atrapamiento o viruta en los ojos. El instructor detiene la línea de inmediato, retira a Andrés del ambiente y formula un llamado de atención por vulnerar normas de seguridad industrial de la vida.',
        legalBasis: 'Acuerdo 009 de 2024, Art. 9: Es deber ineludible portar los EPP completos y acatar los protocolos de seguridad industrial en ambientes de formación.'
      },
      {
        id: 'c3-opt-b',
        actionText: 'Acercarse con honestidad al instructor, solicitar 3 minutos para colocarse los EPP completos (botas, gafas, cabello recogido) y entrar de forma segura.',
        isBestDecision: true,
        xpGained: 100,
        consequenceType: 'success',
        outcomeDescription: 'El instructor reconoce la cultura de autocuidado y prevención del aprendiz. Andrés ingresa con todos los implementos de protección sin poner en riesgo su vida ni la de sus compañeros.',
        legalBasis: 'Acuerdo 009 de 2024, Art. 9: Prioridad a la vida, autocuidado y preservación de la integridad física en ambientes productivos.'
      }
    ]
  },
  {
    id: 'case-4-comite',
    title: 'Caso 4: La Audiencia de Descargos ante el Comité',
    moduleCategory: 'Medidas Formativas, Sanciones & Debido Proceso',
    contextLocation: 'Sala de Juntas del Centro / Comité de Evaluación',
    characters: 'Mariana (Aprendiz señalada), Vocero de Ficha y Miembros del Comité',
    situation: 'Mariana ha sido citada al Comité de Evaluación y Seguimiento porque una compañera afirmó haberla visto dañando un proyector interactivo del salón. Mariana afirma que el equipo ya venía con fallas eléctricas previas y que ella solo intentó encenderlo, pero teme que la expulsen de inmediato.',
    dilemma: '¿Cuáles son las garantías y el procedimiento adecuado que debe ejercer Mariana?',
    choices: [
      {
        id: 'c4-opt-a',
        actionText: 'No asistir a la citación porque cree que "ya todo está decidido en su contra".',
        isBestDecision: false,
        xpGained: 15,
        consequenceType: 'warning',
        outcomeDescription: 'Al no presentarse injustificadamente, el Comité sesiona en estrados con las pruebas existentes y Mariana pierde la oportunidad dorada de defenderse y exponer su versión testimonial.',
        legalBasis: 'Acuerdo 009 de 2024, Art. 22: El derecho a la defensa debe ser ejercido en los términos de la citación para asegurar la contradicción de la prueba.'
      },
      {
        id: 'c4-opt-b',
        actionText: 'Asistir con puntualidad acompañada de su vocero de ficha, solicitar la lectura formal de cargos, presentar el reporte técnico previo del monitor de sala y rendir sus descargos con calma.',
        isBestDecision: true,
        xpGained: 100,
        consequenceType: 'success',
        outcomeDescription: 'El Comité escucha los descargos y revisa el informe técnico de soporte de sistemas que confirma que el proyector tenía un fusible quemado desde el día anterior. Mariana queda exonerada de toda responsabilidad y se archiva el expediente.',
        legalBasis: 'Acuerdo 009 de 2024, Art. 21-23: Presunción de inocencia, derecho a ser escuchado en audiencia, contradicción de pruebas y resolución motivada.'
      }
    ]
  },
  {
    id: 'case-5-bienestar',
    title: 'Caso 5: Dificultad Socioeconómica y Opciones de Apoyo',
    moduleCategory: 'Derechos & Bienestar al Aprendiz',
    contextLocation: 'Oficina de Bienestar al Aprendiz',
    characters: 'Mateo (Aprendiz de Gestión Empresarial) y Profesional de Bienestar',
    situation: 'Mateo vive a dos horas del centro de formación y su familia atraviesa una crisis económica que le impide costear los pasajes diarios de transporte público y la alimentación. Muy angustiado, piensa en desertar en silencio y abandonar su formación técnica.',
    dilemma: '¿Qué alternativa que ampara el Reglamento y Bienestar Institucional debería utilizar Mateo?',
    choices: [
      {
        id: 'c5-opt-a',
        actionText: 'Dejar de ir al centro de formación sin avisar a nadie y perder la oportunidad de graduarse.',
        isBestDecision: false,
        xpGained: 0,
        consequenceType: 'danger',
        outcomeDescription: 'Al acumular inasistencias, el sistema registrará deserción y sanción de no poder ingresar a otro programa del SENA en 6 meses.',
        legalBasis: 'Acuerdo 009 de 2024, Art. 26: La deserción no notificada genera sanciones de bloqueo en la plataforma de registro.'
      },
      {
        id: 'c5-opt-b',
        actionText: 'Acercarse al área de Bienestar al Aprendiz, exponer su caso de vulnerabilidad socioeconómica y postularse a los Apoyos de Sostenimiento, auxilios de transporte o monitorías del centro.',
        isBestDecision: true,
        xpGained: 100,
        consequenceType: 'success',
        outcomeDescription: 'Bienestar evalúa su ficha del Sisbén y lo prioriza en la convocatoria de apoyos de sostenimiento regular. Además, le asignan refrigerio escolar diario y un plan de tutoría que le permite continuar con éxito su formación.',
        legalBasis: 'Acuerdo 009 de 2024, Art. 8: Todo aprendiz tiene derecho a acceder a los planes integrales de Bienestar al Aprendiz y auxilios socioeconómicos institucionales.'
      }
    ]
  }
];

export const FINAL_EXAM_QUESTIONS = [
  {
    id: 'fe-1',
    question: '¿Cuál es el acto administrativo más reciente que rige los derechos, deberes y régimen disciplinario de los aprendices del SENA?',
    options: [
      { id: 'fe1-a', text: 'El Acuerdo 009 de 2024.', isCorrect: true, explanation: 'Exacto, el Acuerdo 009 de 2024 actualizó y compiló la normativa del aprendiz en el SENA.' },
      { id: 'fe1-b', text: 'La Ley 100 de 1993.', isCorrect: false, explanation: 'La Ley 100 rige el sistema general de seguridad social en Colombia.' },
      { id: 'fe1-c', text: 'El Decreto 410 de 1971.', isCorrect: false, explanation: 'Ese es el Código de Comercio.' }
    ]
  },
  {
    id: 'fe-2',
    question: '¿Qué constituye el porte del carné institucional en el SENA?',
    options: [
      { id: 'fe2-a', text: 'Un deber de carácter obligatorio, personal e intransferible que debe exhibirse de forma visible.', isCorrect: true, explanation: 'Correcto, garantiza la identificación institucional y seguridad de todos.' },
      { id: 'fe2-b', text: 'Un accesorio opcional que solo se pide en época de elecciones de voceros.', isCorrect: false, explanation: 'Debe portarse siempre en cualquier ambiente del SENA.' },
      { id: 'fe2-c', text: 'Un documento que se puede ceder a familiares para que ingresen al centro libremente.', isCorrect: false, explanation: 'Prestar el carné a terceros está tipificado como falta disciplinaria.' }
    ]
  },
  {
    id: 'fe-3',
    question: '¿Cuál es el plazo reglamentario para justificar formalmente una inasistencia médica o por fuerza mayor ante el instructor?',
    options: [
      { id: 'fe3-a', text: 'Máximo tres (3) días hábiles siguientes al hecho con su respectivo soporte válido.', isCorrect: true, explanation: 'Totalmente acertado; pasado este plazo se configura reporte de inasistencia injustificada.' },
      { id: 'fe3-b', text: 'Quince días calendario sin necesidad de soportes.', isCorrect: false, explanation: 'Se requiere soporte y el plazo son 3 días hábiles.' },
      { id: 'fe3-c', text: 'Solo al finalizar la etapa productiva.', isCorrect: false, explanation: 'Debe justificarse oportunamente en el momento oportuno.' }
    ]
  },
  {
    id: 'fe-4',
    question: '¿Cuál es la diferencia sustancial entre una Medida Formativa y una Sanción Disciplinaria?',
    options: [
      { id: 'fe4-a', text: 'La Medida Formativa es de carácter pedagógico (no genera sanción en la hoja de vida), mientras que la Sanción es impuesta formalmente por el Subdirector mediante acto administrativo.', isCorrect: true, explanation: 'Excelente distinción jurídica y pedagógica del Acuerdo 009 de 2024.' },
      { id: 'fe4-b', text: 'Las medidas formativas son cobros de dinero y las sanciones son expulsiones inmediatas.', isCorrect: false, explanation: 'En el SENA no existen cobros monetarios ni expulsiones sin debido proceso.' },
      { id: 'fe4-c', text: 'No existe ninguna diferencia, ambas significan lo mismo.', isCorrect: false, explanation: 'Son figuras jurídicas con propósitos y alcances totalmente distintos.' }
    ]
  },
  {
    id: 'fe-5',
    question: '¿Cuántos días hábiles tiene el aprendiz para presentar descargos y aportar pruebas tras ser notificado de una queja disciplinaria?',
    options: [
      { id: 'fe5-a', text: 'Cinco (5) días hábiles como garantía del Debido Proceso y derecho a la contradicción.', isCorrect: true, explanation: '¡Correcto! Es el plazo de ley para estructurar la defensa y solicitar pruebas.' },
      { id: 'fe5-b', text: 'Veinticuatro horas improrrogables.', isCorrect: false, explanation: 'Sería un término insuficiente que vulneraría el debido proceso.' },
      { id: 'fe5-c', text: 'No existe término de descargos; la sanción es inmediata.', isCorrect: false, explanation: 'El debido proceso es una garantía obligatoria e irrenunciable.' }
    ]
  },
  {
    id: 'fe-6',
    question: 'Si un aprendiz requiere suspender temporalmente su formación por calamidad comprobada o servicio militar, ¿qué trámite debe radicar?',
    options: [
      { id: 'fe6-a', text: 'Solicitud formal de Aplazamiento (hasta por 6 meses con opción de prórroga sustentada).', isCorrect: true, explanation: 'Así es, radicándolo a tiempo preserva su cupo y evita la cancelación por deserción.' },
      { id: 'fe6-b', text: 'Retiro voluntario definitivo con pérdida de las competencias logradas.', isCorrect: false, explanation: 'El retiro voluntario es definitivo, mientras el aplazamiento permite retornar.' },
      { id: 'fe6-c', text: 'Ningún trámite, solo dejar de asistir y volver el año siguiente.', isCorrect: false, explanation: 'Dejar de asistir sin trámite genera cancelación por deserción.' }
    ]
  },
  {
    id: 'fe-7',
    question: '¿En qué plazo reglamentario tiene derecho el aprendiz a recibir la evaluación y retroalimentación de sus evidencias entregadas?',
    options: [
      { id: 'fe7-a', text: 'En un plazo máximo de cinco (5) días hábiles tras la entrega oportuna.', isCorrect: true, explanation: '¡Exacto! Garantiza el seguimiento pedagógico continuo.' },
      { id: 'fe7-b', text: 'Únicamente el último día del año de graduación.', isCorrect: false, explanation: 'Las evaluaciones deben ser periódicas y formativas.' },
      { id: 'fe7-c', text: 'En treinta días hábiles.', isCorrect: false, explanation: 'El plazo fijado reglamentariamente es de 5 días hábiles.' }
    ]
  },
  {
    id: 'fe-8',
    question: '¿Cuál de las siguientes conductas está clasificada como Falta Gravísima en el centro de formación?',
    options: [
      { id: 'fe8-a', text: 'Portar armas de fuego o cortopunzantes, agresión física severa o tráfico de sustancias psicoactivas.', isCorrect: true, explanation: '¡Totalmente! Pone en riesgo la vida y los derechos fundamentales de la comunidad.' },
      { id: 'fe8-b', text: 'Olvidar el carné en casa un día y solicitar pase temporal.', isCorrect: false, explanation: 'Eso es subsanable y no constituye falta gravísima.' },
      { id: 'fe8-c', text: 'Llegar 5 minutos tarde por congestión vehicular.', isCorrect: false, explanation: 'Es un retardo que se maneja con llamado pedagógico verbal si es aislado.' }
    ]
  }
];
