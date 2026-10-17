# Sprint Backlogs y Ceremonias SCRUM

**Equipo:** Cristhiam Samayoa (SM), Edgar Díaz (PO), Emilio Schaad (QA), Guillermo Ortiz (SQA), Daniel Contreras (Líder Técnico / Arquitecto).

---

## Sprint 1 — Preparación

**Meta:** Establecer las bases del proyecto de QA.

### Sprint Backlog
| Tarea | Responsable | Estado |
|-------|-------------|--------|
| Documentar arquitectura y módulos | Daniel Contreras | ✅ |
| Definir roles y matriz RACI | Cristhiam Samayoa | ✅ |
| Seleccionar atributos de calidad (ISO 25010) | Guillermo Ortiz | ✅ |
| Definir métricas de calidad | Guillermo Ortiz | ✅ |
| Construir Product Backlog | Edgar Díaz | ✅ |

### Ceremonias
- **Sprint Planning:** se define el alcance (4 módulos) y la meta del sprint.
- **Daily Scrum:** sincronización diaria (15 min).
- **Sprint Review:** PO acepta la documentación base.
- **Retrospectiva:** ver sección final.

---

## Sprint 2 — Diseño de Pruebas

**Meta:** Producir el diseño completo de pruebas y el plan.

### Sprint Backlog
| Tarea | Responsable | Estado |
|-------|-------------|--------|
| Clases de equivalencia y valores límite | Emilio Schaad | ✅ |
| Tablas de decisión | Emilio Schaad | ✅ |
| Pairwise testing | Emilio Schaad | ✅ |
| Diagrama de transición de estados | Daniel Contreras | ✅ |
| Diseñar 16 casos de prueba | Emilio Schaad | ✅ |
| Redactar plan de pruebas | Guillermo Ortiz | ✅ |

---

## Sprint 3 — Ejecución, Bugs y Automatización

**Meta:** Ejecutar pruebas, registrar defectos y automatizar.

### Sprint Backlog
| Tarea | Responsable | Estado |
|-------|-------------|--------|
| Ejecutar 16 casos manuales | Emilio Schaad | ✅ |
| Registrar y clasificar 11 bugs | Emilio Schaad | ✅ |
| Priorización por riesgo | Guillermo Ortiz | ✅ |
| Construir suite Cypress | Daniel Contreras | ✅ |
| Ejecutar suite y recoger evidencias | Daniel Contreras | ✅ |
| Informe de automatización | Daniel Contreras | ✅ |

---

## Sprint Final — Review y Presentación

**Meta:** Comunicar resultados ejecutivamente.

### Sprint Backlog
| Tarea | Responsable | Estado |
|-------|-------------|--------|
| Dashboard de métricas | Guillermo Ortiz | ✅ |
| Presentación ejecutiva (15 min) | Edgar Díaz | ✅ |
| Conclusiones y recomendaciones | Equipo | ✅ |

---

## Registro de ceremonias (plantilla por sprint)

### Sprint Planning
- **¿Qué se puede entregar?** Incremento definido por la meta del sprint.
- **¿Cómo se logrará?** Tareas del Sprint Backlog arriba.

### Daily Scrum (3 preguntas)
1. ¿Qué hice ayer?
2. ¿Qué haré hoy?
3. ¿Tengo impedimentos?

### Sprint Review
- Demostración del incremento al PO.
- Aceptación/rechazo de entregables.

### Retrospectiva (ejemplo Sprint 3)
| Qué salió bien | Qué mejorar | Acción |
|----------------|-------------|--------|
| La suite Cypress generó evidencias automáticas | El ambiente Render es lento al despertar | Reactivar el ambiente 5 min antes de ejecutar |
| Buena cobertura de técnicas de diseño | Algunos formularios requieren más exploración | Documentar rutas internas del ERP |
| Trabajo en equipo fluido | Roles combinados cargan al Líder Técnico | Redistribuir tareas en futuros sprints |
