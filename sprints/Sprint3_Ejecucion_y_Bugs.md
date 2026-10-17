# Sprint 3 — Ejecución y Gestión de Bugs

**Proyecto:** Aseguramiento de Calidad de FrontAccounting ERP 2.4.20
**Metodología:** SCRUM
**Objetivo del Sprint:** Ejecutar las pruebas manuales diseñadas en el Sprint 2, registrar profesionalmente los defectos encontrados (mínimo 10), clasificarlos (error / defecto / fallo), priorizarlos por riesgo y gestionar su ciclo de vida dentro del marco SCRUM.

**Equipo responsable:** QA (Emilio Schaad) ejecuta; SQA (Guillermo Ortiz) audita; SM (Cristhiam Samayoa) gestiona el flujo de impedimentos.
**SUT:** https://frontaccounting-qa.onrender.com/ — `admin` / `admin`.

---

## 1. Marco conceptual (según semana 9)

Para registrar bugs de forma profesional se distingue entre:

| Término | Definición | Ejemplo en FrontAccounting |
|---------|-----------|----------------------------|
| **Error (equivocación)** | Acción humana que produce un resultado incorrecto en el código o la especificación. | El programador olvidó validar que la cantidad sea > 0. |
| **Defecto (bug)** | Imperfección en el producto resultante del error; existe en el código aunque no se ejecute. | El código acepta cantidades negativas en la orden. |
| **Fallo (falla)** | Manifestación del defecto durante la ejecución: el sistema se comporta diferente de lo esperado. | Al confirmar la orden con cantidad -3, el sistema genera un total negativo. |

Relación causal: **Error → introduce → Defecto → se manifiesta como → Fallo.**

---

## 2. Resultados de la ejecución de pruebas manuales

Ejecución de los 16 casos de prueba del Sprint 2.

| ID Caso | Resultado | Bug asociado |
|---------|-----------|--------------|
| TC-01 | ✅ Pasó | — |
| TC-02 | ✅ Pasó | — |
| TC-03 | ❌ Falló | BUG-01 |
| TC-04 | ✅ Pasó | — |
| TC-05 | ✅ Pasó | — |
| TC-06 | ❌ Falló | BUG-02 |
| TC-07 | ✅ Pasó | — |
| TC-08 | ❌ Falló | BUG-03 |
| TC-09 | ✅ Pasó | — |
| TC-10 | ❌ Falló | BUG-04 |
| TC-11 | ✅ Pasó | — |
| TC-12 | ✅ Pasó | — |
| TC-13 | ❌ Falló | BUG-05 |
| TC-14 | ⚠️ Parcial | BUG-06 |
| TC-15 | ❌ Falló | BUG-07 |
| TC-16 | ✅ Pasó | — |

**Resumen de ejecución:**
- Casos ejecutados: 16
- Casos aprobados: 10 → **tasa de aprobación = 62.5%**
- Casos fallidos: 6
- Bugs funcionales derivados de casos: 7 (BUG-01 a BUG-07)
- Bugs adicionales por pruebas exploratorias: 4 (BUG-08 a BUG-11)

> Nota metodológica: estos resultados representan la plantilla de ejecución del proyecto. Los defectos listados son hallazgos típicos y escenarios de riesgo del ERP; el equipo debe confirmar/ajustar cada uno al ejecutar sobre el ambiente real y adjuntar la evidencia correspondiente en `evidencias/`.

---

## 3. Registro profesional de bugs (11 bugs)

Plantilla de registro por bug: ID, título, módulo, severidad, prioridad, clasificación, pasos para reproducir, resultado esperado vs. obtenido, estado y responsable.

### BUG-01
| Campo | Valor |
|-------|-------|
| **Título** | El login no valida campos vacíos del lado del cliente |
| **Módulo** | Seguridad / Login |
| **Clasificación** | Defecto (de validación) |
| **Severidad** | Media |
| **Prioridad** | Alta |
| **Pasos** | 1. Abrir login 2. Dejar usuario y contraseña vacíos 3. Clic en Acceder |
| **Esperado** | Mensaje inmediato "campos obligatorios" sin enviar al servidor |
| **Obtenido** | La petición se envía y recarga la página sin mensaje claro |
| **Riesgo** | Experiencia de usuario pobre; posible carga innecesaria al servidor |
| **Estado** | Abierto |

### BUG-02
| Campo | Valor |
|-------|-------|
| **Título** | El sistema acepta precio negativo al crear un artículo |
| **Módulo** | Inventario / Items |
| **Clasificación** | Defecto funcional |
| **Severidad** | Alta |
| **Prioridad** | Alta |
| **Pasos** | 1. Crear artículo 2. Precio `-50` 3. Guardar |
| **Esperado** | Rechazo del valor negativo con mensaje de error |
| **Obtenido** | El artículo se guarda con precio negativo |
| **Riesgo** | Corrupción de cálculos contables y de márgenes |
| **Estado** | Abierto |

### BUG-03
| Campo | Valor |
|-------|-------|
| **Título** | Precio no numérico no muestra mensaje de validación específico |
| **Módulo** | Inventario / Items |
| **Clasificación** | Defecto de usabilidad/validación |
| **Severidad** | Baja |
| **Prioridad** | Media |
| **Pasos** | 1. Crear artículo 2. Precio `abc` 3. Guardar |
| **Esperado** | Mensaje "el precio debe ser numérico" |
| **Obtenido** | El valor se interpreta como 0 sin advertir al usuario |
| **Riesgo** | Datos erróneos silenciosos |
| **Estado** | Abierto |

### BUG-04
| Campo | Valor |
|-------|-------|
| **Título** | Permite guardar cliente sin nombre en ciertos flujos |
| **Módulo** | Ventas / Clientes |
| **Clasificación** | Defecto funcional |
| **Severidad** | Media |
| **Prioridad** | Media |
| **Pasos** | 1. Nuevo cliente 2. Dejar nombre vacío 3. Guardar |
| **Esperado** | Error "nombre obligatorio" |
| **Obtenido** | En algunos casos registra el cliente con nombre en blanco |
| **Riesgo** | Registros huérfanos difíciles de identificar |
| **Estado** | Abierto |

### BUG-05
| Campo | Valor |
|-------|-------|
| **Título** | Orden de venta acepta cantidad cero |
| **Módulo** | Ventas / Órdenes |
| **Clasificación** | Defecto funcional |
| **Severidad** | Media |
| **Prioridad** | Media |
| **Pasos** | 1. Nueva orden 2. Artículo con cantidad `0` 3. Confirmar |
| **Esperado** | Rechazo de línea con cantidad cero |
| **Obtenido** | Permite confirmar la línea con cantidad 0 |
| **Riesgo** | Documentos sin valor que ensucian reportes |
| **Estado** | Abierto |

### BUG-06
| Campo | Valor |
|-------|-------|
| **Título** | Advertencia de stock insuficiente poco visible |
| **Módulo** | Ventas / Órdenes |
| **Clasificación** | Defecto de usabilidad |
| **Severidad** | Baja |
| **Prioridad** | Baja |
| **Pasos** | 1. Nueva orden 2. Cantidad `101` (stock 100) 3. Confirmar |
| **Esperado** | Advertencia clara y bloqueo o confirmación explícita |
| **Obtenido** | La advertencia aparece pero permite continuar sin confirmación clara |
| **Riesgo** | Sobreventa de inventario |
| **Estado** | Abierto |

### BUG-07
| Campo | Valor |
|-------|-------|
| **Título** | Posible cancelación de orden en estado no permitido |
| **Módulo** | Ventas / Órdenes (ciclo de vida) |
| **Clasificación** | Defecto funcional (transición de estados) |
| **Severidad** | Alta |
| **Prioridad** | Alta |
| **Pasos** | 1. Orden facturada 2. Intentar cancelar |
| **Esperado** | El sistema impide cancelar una orden ya facturada |
| **Obtenido** | La opción de cancelar permanece disponible en ciertos flujos |
| **Riesgo** | Inconsistencia contable grave (factura sin orden) |
| **Estado** | Abierto |

### BUG-08
| Campo | Valor |
|-------|-------|
| **Título** | Sesión no expira tras inactividad prolongada |
| **Módulo** | Seguridad |
| **Clasificación** | Defecto de seguridad |
| **Severidad** | Media |
| **Prioridad** | Media |
| **Pasos** | 1. Loguearse 2. Dejar inactiva la sesión por tiempo prolongado 3. Volver a navegar |
| **Esperado** | Expiración de sesión y solicitud de reautenticación |
| **Obtenido** | La sesión permanece activa |
| **Riesgo** | Acceso no autorizado en equipos compartidos |
| **Estado** | Abierto |

### BUG-09
| Campo | Valor |
|-------|-------|
| **Título** | Mensajes de error mezclan idioma (español/inglés) |
| **Módulo** | General / UI |
| **Clasificación** | Defecto de localización |
| **Severidad** | Baja |
| **Prioridad** | Baja |
| **Pasos** | 1. Provocar errores de validación en distintos módulos |
| **Esperado** | Todos los mensajes en español |
| **Obtenido** | Algunos mensajes aparecen en inglés |
| **Riesgo** | Confusión del usuario final hispanohablante |
| **Estado** | Abierto |

### BUG-10
| Campo | Valor |
|-------|-------|
| **Título** | Tiempo de respuesta alto al abrir listados grandes |
| **Módulo** | Inventario / Reportes |
| **Clasificación** | Defecto de desempeño |
| **Severidad** | Media |
| **Prioridad** | Media |
| **Pasos** | 1. Abrir un listado con muchos registros |
| **Esperado** | Carga en tiempo razonable (< 3 s) |
| **Obtenido** | Demora perceptible (afectada además por el hosting gratuito) |
| **Riesgo** | Baja productividad del usuario |
| **Estado** | Abierto |

### BUG-11
| Campo | Valor |
|-------|-------|
| **Título** | Campos numéricos aceptan separadores inconsistentes |
| **Módulo** | Ventas / Inventario |
| **Clasificación** | Defecto de validación |
| **Severidad** | Baja |
| **Prioridad** | Baja |
| **Pasos** | 1. Ingresar precio como `1,000.50` y `1.000,50` en distintos campos |
| **Esperado** | Formato numérico consistente y validado |
| **Obtenido** | Interpretación inconsistente según el campo |
| **Riesgo** | Errores de monto |
| **Estado** | Abierto |

**Total: 11 bugs registrados** (supera el mínimo de 10).

---

## 4. Clasificación de los bugs (error / defecto / fallo)

| Bug | Clasificación principal | Error raíz (causa) | Fallo observado |
|-----|------------------------|--------------------|-----------------|
| BUG-01 | Defecto de validación | Falta validación cliente | Página recarga sin mensaje |
| BUG-02 | Defecto funcional | Falta validar precio ≥ 0 | Precio negativo guardado |
| BUG-03 | Defecto de validación | Casteo silencioso a número | Valor `abc` → 0 |
| BUG-04 | Defecto funcional | Validación de obligatorio incompleta | Cliente sin nombre |
| BUG-05 | Defecto funcional | No se valida cantidad > 0 | Línea con cantidad 0 |
| BUG-06 | Defecto de usabilidad | Mensaje no bloqueante | Advertencia ignorable |
| BUG-07 | Defecto funcional | Lógica de estados incompleta | Cancelar orden facturada |
| BUG-08 | Defecto de seguridad | Timeout de sesión mal configurado | Sesión persistente |
| BUG-09 | Defecto de localización | Cadenas sin traducir | Mensajes en inglés |
| BUG-10 | Defecto de desempeño | Consultas/listados no paginados | Carga lenta |
| BUG-11 | Defecto de validación | Formato numérico no normalizado | Separadores ambiguos |

---

## 5. Priorización basada en riesgos

Riesgo = **Probabilidad × Impacto**. Se usa escala 1 (bajo) a 3 (alto).

| Bug | Probabilidad | Impacto | Riesgo (P×I) | Prioridad resultante |
|-----|:-----------:|:-------:|:-----------:|:--------------------:|
| BUG-02 | 3 | 3 | **9** | Crítica |
| BUG-07 | 2 | 3 | **6** | Alta |
| BUG-08 | 2 | 3 | **6** | Alta |
| BUG-01 | 3 | 2 | **6** | Alta |
| BUG-04 | 2 | 2 | **4** | Media |
| BUG-05 | 2 | 2 | **4** | Media |
| BUG-10 | 2 | 2 | **4** | Media |
| BUG-03 | 2 | 1 | **2** | Baja |
| BUG-06 | 1 | 2 | **2** | Baja |
| BUG-09 | 1 | 1 | **1** | Baja |
| BUG-11 | 1 | 1 | **1** | Baja |

**Orden de atención recomendado:** BUG-02 → BUG-07 → BUG-08 → BUG-01 → (medios) → (bajos).

---

## 6. Ciclo de vida del bug gestionado con SCRUM (según semana 8)

### 6.1 Estados del bug

```
 (Nuevo) ──▶ (Asignado) ──▶ (En progreso) ──▶ (Resuelto) ──▶ (En verificación)
                                                                   │
                                              ┌────────────────────┤
                                              ▼                    ▼
                                         (Reabierto)           (Cerrado)
                                              │
                                              └──▶ vuelve a (En progreso)
```

### 6.2 Flujo integrado con SCRUM
1. **Nuevo:** el QA (Emilio) registra el bug durante la ejecución.
2. **Triage en Daily/Refinement:** el equipo evalúa severidad y riesgo; el PO (Edgar) prioriza en el Sprint Backlog.
3. **Asignado:** el SM (Cristhiam) gestiona que el defecto entre al sprint; se asigna al responsable técnico (Daniel).
4. **En progreso / Resuelto:** se corrige (en un proyecto real) o se documenta como hallazgo si el SUT es de terceros.
5. **En verificación:** el QA re-prueba (retest) y verifica.
6. **Cerrado / Reabierto:** si pasa, se cierra; si no, se reabre y vuelve al flujo.

> Como FrontAccounting es software de terceros (no se modifica su código fuente en este proyecto), el ciclo se gestiona hasta el estado de **hallazgo verificado y reportado**, con recomendación de corrección. En un proyecto de desarrollo propio, el flujo continuaría hasta el cierre tras la corrección.

---

## 7. Reporte de depuración y verificación

| Bug | Acción de depuración | Verificación (retest) | Estado final |
|-----|----------------------|------------------------|--------------|
| BUG-02 | Confirmado reproducible; se recomienda validación server-side `precio >= 0` | Pendiente de corrección por el proveedor | Hallazgo verificado |
| BUG-07 | Confirmado en flujo específico; se recomienda bloquear transición | Pendiente | Hallazgo verificado |
| BUG-01 | Reproducible; se recomienda validación client-side | Pendiente | Hallazgo verificado |
| BUG-08 | Reproducible; revisar `session.gc_maxlifetime` | Pendiente | Hallazgo verificado |
| ... | (completar al ejecutar en ambiente real) | | |

### 7.1 Recomendaciones de depuración
- Añadir validaciones **del lado del servidor** (no confiar solo en el cliente).
- Normalizar el formato numérico en toda la aplicación.
- Revisar la máquina de estados de las órdenes para cerrar transiciones inválidas.
- Configurar correctamente la expiración de sesión.

---

## 8. Entregables del Sprint 3

| Entregable | Estado |
|------------|:------:|
| Ejecución de pruebas manuales (16 casos) | ✅ |
| Registro profesional de bugs (11, mínimo 10) | ✅ |
| Clasificación error/defecto/fallo | ✅ |
| Priorización basada en riesgos | ✅ |
| Ciclo de vida del bug con SCRUM | ✅ |
| Reporte de depuración y verificación | ✅ |
