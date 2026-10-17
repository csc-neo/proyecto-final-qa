# Sprint 1 — Preparación (Backlog + Roles + Arquitectura)

**Proyecto:** Aseguramiento de Calidad de FrontAccounting ERP 2.4.20
**Metodología:** SCRUM
**Objetivo del Sprint:** Establecer las bases del proyecto de QA: definir el backlog del sistema a evaluar, asignar roles SCRUM, documentar la arquitectura y módulos del sistema, y seleccionar los atributos y métricas de calidad que guiarán el aseguramiento.

---

## 1. Descripción del sistema bajo prueba (SUT)

**FrontAccounting (FA)** es un sistema ERP y de contabilidad web, open source, orientado a pequeñas y medianas empresas. Soporta contabilidad de doble partida, generando asientos contables automáticos a partir de los documentos operativos (facturas, órdenes, pagos, etc.).

| Característica | Detalle |
|---------------|---------|
| Versión evaluada | 2.4.20 |
| Lenguaje | PHP |
| Base de datos | MySQL con tablas InnoDB (soporte transaccional) |
| Arquitectura | Aplicación web monolítica MVC-like, server-side rendering |
| Interfaz | Basada en formularios HTML, multinavegador |
| Características clave | Multimoneda, multilenguaje, multiempresa, reportes PDF |
| URL del ambiente QA | https://frontaccounting-qa.onrender.com/ |

> *Contenido técnico sintetizado a partir de la documentación oficial del repositorio [FrontAccountingERP/FA en GitHub](https://github.com/FrontAccountingERP/FA). Reformulado para cumplir restricciones de licencia.*

---

## 2. Arquitectura del sistema

### 2.1 Stack tecnológico (modelo LAMP)

```
┌──────────────────────────────────────────────────────────┐
│                      NAVEGADOR (Cliente)                   │
│         HTML + CSS + JavaScript mínimo (formularios)       │
└───────────────────────────┬──────────────────────────────┘
                            │ HTTP/HTTPS (POST/GET + sesiones PHP)
┌───────────────────────────▼──────────────────────────────┐
│                 SERVIDOR WEB (Apache / Nginx)              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              CAPA DE APLICACIÓN (PHP)                 │  │
│  │  - Controladores de módulos (sales, purchasing...)   │  │
│  │  - Lógica de negocio y validaciones                  │  │
│  │  - Motor de posteo contable (GL postings)            │  │
│  │  - Gestión de sesión y seguridad (access levels)     │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────┬──────────────────────────────┘
                            │ Consultas SQL (transaccionales)
┌───────────────────────────▼──────────────────────────────┐
│              BASE DE DATOS (MySQL / MariaDB)              │
│         Tablas InnoDB — soporte de transacciones          │
└──────────────────────────────────────────────────────────┘
```

### 2.2 Patrón arquitectónico

FrontAccounting sigue un patrón **monolítico server-side** con separación lógica por módulos. Cada módulo contiene:
- **Páginas de UI** (formularios PHP que renderizan HTML).
- **Capa de lógica de negocio** (funciones de validación y procesamiento).
- **Capa de acceso a datos** (funciones `db_*` que ejecutan SQL).
- **Posteo al Libro Mayor (GL):** toda transacción operativa genera asientos contables automáticos.

### 2.3 Dependencias principales

| Dependencia | Rol | Criticidad |
|-------------|-----|-----------|
| PHP (>= 5.6 / 7.x) | Motor de ejecución de la aplicación | Alta |
| MySQL/MariaDB (InnoDB) | Persistencia transaccional | Alta |
| Servidor web (Apache) | Atención de peticiones HTTP | Alta |
| Sesiones PHP | Autenticación y estado del usuario | Alta |
| Generador de PDF | Emisión de reportes y documentos | Media |
| Render.com (hosting QA) | Infraestructura del ambiente de pruebas | Media |

---

## 3. Módulos del sistema (mapa funcional)

FrontAccounting organiza su funcionalidad en los siguientes módulos principales. Se marca el **alcance de este proyecto de QA**.

| Módulo | Función principal | ¿En alcance QA? |
|--------|-------------------|:---------------:|
| **Acceso / Seguridad** | Login, roles, niveles de acceso de usuario | ✅ Sí |
| **Ventas (Sales)** | Clientes, cotizaciones, órdenes de venta, facturación, cobros | ✅ Sí |
| **Compras (Purchases)** | Proveedores, órdenes de compra, facturas de proveedor, pagos | ✅ Sí |
| **Inventario / Items & Stock** | Artículos, categorías, niveles de stock, ajustes, transferencias | ✅ Sí |
| Manufactura (Manufacturing) | Listas de materiales (BOM), órdenes de trabajo | ⬜ No (fuera de alcance) |
| Activos Fijos (Fixed Assets) | Alta, depreciación y baja de activos | ⬜ No |
| Dimensiones (Dimensions) | Centros de costo / proyectos | ⬜ No |
| Banca y Libro Mayor (Banking & GL) | Cuentas bancarias, asientos, conciliación | ⬜ No (solo verificación de posteo) |
| Configuración (Setup) | Parámetros de la empresa, usuarios, impuestos | ✅ Sí (parcial: gestión de usuarios) |

### 3.1 Justificación del alcance

Se seleccionan **Acceso/Seguridad, Ventas, Compras e Inventario** porque:
1. Son los módulos de uso más frecuente en un ERP (mayor impacto de negocio y riesgo).
2. Contienen flujos con validaciones ricas (ideales para técnicas de clases de equivalencia, valores límite y tablas de decisión).
3. Tienen interdependencias claras (una venta descuenta inventario; una compra lo incrementa), lo que permite probar integración.
4. Son accesibles con el usuario `admin` sin configuración adicional compleja.

---

## 4. Roles SCRUM y responsabilidades

El equipo está conformado por **5 integrantes**. Dado que el proyecto es de aseguramiento de calidad (no de desarrollo de producto), el rol de **Developer** no se asigna como persona dedicada; las tareas de automatización las asume el Líder Técnico. Un integrante asume dos roles compatibles (Líder Técnico y Arquitecto) por el tamaño del equipo.

| Rol | Integrante | Responsabilidades principales |
|-----|-----------|-------------------------------|
| **Scrum Master (SM)** | Cristhiam Samayoa | Facilita las ceremonias, elimina impedimentos, protege al equipo, asegura el cumplimiento del marco SCRUM. |
| **Product Owner (PO)** | Edgar Díaz | Define y prioriza el Product Backlog, representa el valor de negocio, acepta/rechaza entregables. |
| **QA (Analista de Pruebas)** | Emilio Schaad | Diseña y ejecuta casos de prueba, registra bugs, aplica técnicas de prueba, valida criterios de aceptación. |
| **SQA (Aseguramiento de Calidad)** | Guillermo Ortiz | Define el plan de aseguramiento, vela por el proceso y los estándares, audita métricas y documentación. |
| **Developer (Dev)** | *No aplica* | Rol no asignado como persona dedicada; las tareas de automatización las cubre el Líder Técnico. |
| **Líder Técnico** | Daniel Contreras | Define el enfoque técnico de automatización y herramientas, implementa y revisa el test suite. |
| **Arquitecto** | Daniel Contreras | Documenta la arquitectura del SUT, identifica puntos de integración y riesgos técnicos. |

### 4.1 Matriz RACI (resumen)

| Actividad | SM | PO | QA | SQA | Dev | Líder Téc. | Arq. |
|-----------|:--:|:--:|:--:|:---:|:---:|:----------:|:----:|
| Definir Product Backlog | C | **A/R** | C | C | I | I | C |
| Diseñar casos de prueba | I | C | **A/R** | C | I | C | I |
| Ejecutar pruebas / registrar bugs | I | I | **A/R** | C | C | I | I |
| Automatización (test suite) | I | I | C | C | **A/R** | **A** | I |
| Plan de aseguramiento de calidad | I | C | C | **A/R** | I | C | C |
| Documentar arquitectura | I | I | I | C | C | C | **A/R** |
| Facilitar ceremonias SCRUM | **A/R** | C | I | I | I | I | I |

*R = Responsable, A = Aprobador, C = Consultado, I = Informado.*

---

## 5. Atributos de calidad aplicables (ISO/IEC 25010)

Se seleccionan los atributos de calidad del modelo **ISO/IEC 25010** más relevantes para un ERP contable, según la guía de la semana 9.

| # | Atributo (característica) | Subcaracterística aplicada | Por qué aplica a FrontAccounting |
|---|---------------------------|----------------------------|----------------------------------|
| 1 | **Adecuación funcional** | Completitud, Correctitud | El ERP debe calcular totales, impuestos y posteos contables de forma exacta. |
| 2 | **Fiabilidad** | Madurez, Recuperabilidad | Las transacciones no deben perderse ni corromperse (tablas InnoDB transaccionales). |
| 3 | **Seguridad** | Confidencialidad, Autenticidad, Integridad | Login, niveles de acceso y protección de datos financieros. |
| 4 | **Usabilidad** | Operabilidad, Protección frente a errores de usuario | Formularios con validaciones claras; mensajes de error comprensibles. |
| 5 | **Eficiencia de desempeño** | Comportamiento temporal | Tiempos de respuesta aceptables en listados y reportes. |
| 6 | **Compatibilidad** | Coexistencia, Interoperabilidad | Funcionamiento en distintos navegadores. |
| 7 | **Mantenibilidad** | Modularidad, Analizabilidad | Arquitectura modular que facilita pruebas aisladas. |

### 5.1 Atributos priorizados para este proyecto

Dado el alcance (Seguridad, Ventas, Compras, Inventario), se priorizan:
1. **Adecuación funcional** (prioridad máxima — es un sistema contable).
2. **Seguridad** (datos financieros y control de acceso).
3. **Fiabilidad** (integridad transaccional).
4. **Usabilidad** (validaciones y mensajes de error).

---

## 6. Métricas de calidad seleccionadas

Métricas que se medirán a lo largo del proyecto para evaluar objetivamente la calidad del SUT y del proceso de QA.

### 6.1 Métricas de producto

| Métrica | Fórmula | Meta objetivo |
|---------|---------|---------------|
| **Densidad de defectos** | N.º de defectos / N.º de casos ejecutados | ≤ 0.4 |
| **Tasa de casos aprobados** | (Casos pasados / Casos ejecutados) × 100 | ≥ 80% |
| **Severidad promedio de bugs** | Σ(severidad) / N.º de bugs | Monitoreo |
| **Cobertura funcional** | Requisitos probados / Requisitos totales en alcance | ≥ 90% |

### 6.2 Métricas de proceso

| Métrica | Fórmula | Meta objetivo |
|---------|---------|---------------|
| **Efectividad de detección** | Bugs encontrados en prueba / Bugs totales | ≥ 85% |
| **Tiempo medio de resolución de bug** | Σ(tiempo cierre − tiempo apertura) / N.º bugs | Monitoreo |
| **Velocidad del equipo (velocity)** | Story points completados por sprint | Monitoreo |
| **Tasa de reapertura de bugs** | Bugs reabiertos / Bugs cerrados × 100 | ≤ 10% |

### 6.3 Métricas de automatización

| Métrica | Fórmula | Meta objetivo |
|---------|---------|---------------|
| **Cobertura de automatización** | Casos automatizados / Casos totales × 100 | ≥ 40% |
| **Tasa de éxito de la suite** | Tests verdes / Tests totales × 100 | ≥ 90% |
| **Tiempo de ejecución de la suite** | Duración total de la corrida | Monitoreo |

---

## 7. Product Backlog del proyecto de QA

El Product Backlog representa el trabajo de aseguramiento de calidad a realizar, priorizado por valor y riesgo. (Ver detalle en `artefactos_scrum/Product_Backlog.md`.)

| ID | Historia de usuario (épica/ítem) | Prioridad | Estimación (SP) | Sprint |
|----|----------------------------------|-----------|:---------------:|:------:|
| PB-01 | Como QA quiero documentar arquitectura y módulos para delimitar el alcance | Alta | 5 | 1 |
| PB-02 | Como SQA quiero definir atributos y métricas de calidad para medir objetivamente | Alta | 3 | 1 |
| PB-03 | Como QA quiero diseñar casos de prueba con técnicas tradicionales y modernas | Alta | 13 | 2 |
| PB-04 | Como QA quiero un plan de pruebas formal para guiar la ejecución | Alta | 5 | 2 |
| PB-05 | Como QA quiero ejecutar pruebas manuales y registrar bugs profesionalmente | Alta | 13 | 3 |
| PB-06 | Como Dev quiero automatizar un conjunto de pruebas para regresión | Media | 13 | 3 |
| PB-07 | Como PO quiero un dashboard de métricas y presentación ejecutiva | Media | 8 | Final |

---

## 8. Definición de Hecho (Definition of Done)

Un ítem del backlog se considera **Hecho** cuando:
- [ ] La documentación asociada está completa y revisada por el SQA.
- [ ] Los casos de prueba tienen criterios de aceptación claros y resultados registrados.
- [ ] Los bugs encontrados están registrados con la plantilla profesional.
- [ ] El código de automatización está versionado y ejecuta sin errores de sintaxis.
- [ ] Las evidencias (capturas/logs/videos) están almacenadas en `evidencias/`.
- [ ] El PO acepta el entregable en el Sprint Review.

---

## 9. Entregables del Sprint 1

| Entregable | Estado |
|------------|:------:|
| Documento de arquitectura, módulos y dependencias | ✅ |
| Definición de roles SCRUM y matriz RACI | ✅ |
| Atributos de calidad (ISO 25010) seleccionados | ✅ |
| Métricas de calidad seleccionadas | ✅ |
| Product Backlog inicial | ✅ |
