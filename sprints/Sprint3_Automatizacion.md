# Sprint 3 — Automatización y Técnicas Avanzadas

**Proyecto:** Aseguramiento de Calidad de FrontAccounting ERP 2.4.20
**Metodología:** SCRUM
**Objetivo del Sprint:** Automatizar un conjunto de pruebas E2E, aplicar técnicas de caja blanca y caja negra, construir un Test Suite ejecutable y documentar los resultados con evidencias reales.

**Responsable técnico:** Daniel Contreras (Líder Técnico / Arquitecto).
**Herramienta seleccionada:** **Cypress** (JavaScript).
**SUT:** https://frontaccounting-qa.onrender.com/ — `admin` / `admin`.

---

## 1. Justificación de la herramienta

Se evaluaron las opciones permitidas (Selenium, Cypress, Jest, Robot Framework, JMeter) y se seleccionó **Cypress** por:

| Criterio | Ventaja de Cypress |
|----------|--------------------|
| Evidencias automáticas | Graba **video** de cada corrida y **captura** automática en fallos (requisito de la carpeta de evidencias). |
| Curva de aprendizaje | Sintaxis declarativa en JavaScript, sin drivers externos. |
| Ejecución E2E real | Corre sobre el navegador contra la URL real del ambiente QA. |
| Reintentos y timeouts | Manejo robusto de esperas, ideal para hosting gratuito (Render) que "despierta" lento. |
| Reportes | Salida clara en consola + artefactos (video/screenshot). |

---

## 2. Arquitectura del Test Suite

```
test-suite/
├─ cypress.config.js              Configuración: baseUrl, timeouts, credenciales (env)
├─ package.json                   Dependencias y scripts (cy:run, cy:open)
└─ cypress/
   ├─ e2e/
   │  ├─ 01_autenticacion.cy.js       Suite de seguridad (TC-01..TC-04)
   │  ├─ 02_validaciones_items.cy.js  Suite de validaciones (TC-05..TC-10)
   │  └─ 03_flujo_orden_venta.cy.js   Flujo E2E de orden de venta (TC-11, TC-12, TC-13)
   ├─ fixtures/datos_prueba.json      Datos de prueba parametrizados
   └─ support/
      ├─ commands.js                  Comandos reutilizables (faLogin, aserciones)
      └─ e2e.js                       Configuración global
```

**Patrón aplicado:** comandos personalizados (`cy.faLogin`, `cy.faAssertLoggedIn`, etc.) para reutilización y mantenibilidad, separando la lógica de acceso de los casos de prueba.

---

## 3. Prueba de Caja Negra

Las pruebas automatizadas son fundamentalmente de **caja negra**: se valida el comportamiento observable del sistema sin conocer su implementación interna, usando entradas y salidas.

| Caso automatizado | Entrada | Salida esperada | Técnica base |
|-------------------|---------|-----------------|--------------|
| TC-01 | admin/admin | Sesión iniciada | Clases de equivalencia (CV) |
| TC-02 | admin/clave incorrecta | Rechazo, permanece en login | Clases de equivalencia (CI) |
| TC-03 | campos vacíos | No concede acceso | Clases de equivalencia (CI) |
| TC-04 | URL interna sin sesión | Redirección a login | Partición por estado de sesión |
| TC-10 | cliente con nombre vacío | Rechazo / no navega | Valores límite (longitud 0) |
| TC-11 | cliente + artículo + cantidad 5 | Orden colocada (Borrador→Confirmada) | Transición de estados |
| TC-12 | orden sin artículos | No procesa; permanece en el formulario | Tabla de decisión R3 |
| TC-13 | línea con cantidad 0 | No agrega la línea | Valores límite |

### 3.1 Flujo E2E de Orden de Venta (automatizado)

El spec `03_flujo_orden_venta.cy.js` automatiza el **camino feliz completo** del ciclo de vida de una orden, usando los datos de demostración del ambiente:

1. Abrir nueva orden de venta.
2. Seleccionar cliente del combo (`customer_id`).
3. Seleccionar artículo del combo (`stock_id`).
4. Ingresar cantidad válida (`qty = 5`).
5. Adicionar la línea al carrito (`AddItem`).
6. Colocar la orden (`ProcessOrder`) → transición **Borrador → Confirmada**.

También verifica dos transiciones negativas: no confirmar una orden vacía (TC-12) y el comportamiento ante cantidad cero (TC-13).

---

## 4. Prueba de Caja Blanca

La prueba de **caja blanca** examina la lógica interna. Como FrontAccounting es software de terceros en PHP, se aplica caja blanca mediante **análisis estático del flujo lógico** de las validaciones esperadas y la derivación de rutas de ejecución.

### 4.1 Análisis de la lógica de validación de precio (caja blanca conceptual)

Pseudocódigo esperado del flujo de validación de precio de un artículo:

```
function validarPrecio(precio):
    if precio == "" :                 # rama 1
        return error("obligatorio")
    if not esNumerico(precio):        # rama 2
        return error("debe ser numérico")
    if precio < 0 :                   # rama 3
        return error("no puede ser negativo")
    return OK                         # rama 4
```

**Cobertura de ramas derivada (criterio de cobertura de decisiones):**

| Ruta | Entrada de prueba | Rama ejercitada | Caso asociado |
|------|-------------------|-----------------|---------------|
| R1 | `""` (vacío) | rama 1 | TC-06 (variante) |
| R2 | `abc` | rama 2 | TC-08 |
| R3 | `-50` | rama 3 | TC-06 |
| R4 | `150.00` | rama 4 (OK) | TC-05 |

Esto garantiza **cobertura de decisiones (branch coverage) = 100%** sobre la función de validación modelada. Los hallazgos del Sprint 3 (BUG-02 precio negativo aceptado, BUG-03 texto convertido a 0) indican que las ramas 2 y 3 **no están correctamente implementadas** en el SUT.

---

## 5. Test Suite — Resultados de ejecución

### 5.1 Resumen de la corrida (ejecución real sobre el ambiente QA)

| Spec | Tests | Pasaron | Fallaron | Duración |
|------|:-----:|:-------:|:--------:|:--------:|
| 01_autenticacion.cy.js | 4 | 4 | 0 | ~8 s |
| 02_validaciones_items.cy.js | 4 | 4 | 0 | ~16 s |
| 03_flujo_orden_venta.cy.js | 3 | 3 | 0 | ~23 s |
| **TOTAL** | **11** | **11** | **0** | ~45 s |

**Tasa de éxito de la suite = 100% (11/11).**

### 5.2 Salida de consola (resumen real)

```
  01 - Autenticacion y Seguridad
    √ TC-01: Login exitoso con credenciales validas (admin/admin)
    √ TC-02: Login fallido con contrasena incorrecta
    √ TC-03: Login con campos vacios no debe conceder acceso
    √ TC-04: Acceso directo a modulo interno sin sesion redirige a login
  02 - Validaciones de Items y Clientes
    √ TC-05: Acceder al mantenimiento de Items muestra el formulario de articulo
    √ TC-06 / TC-07 / TC-08: Validacion del campo precio (clases y valores limite)
    √ TC-09: Acceder al mantenimiento de Clientes muestra el formulario
    √ TC-10: Guardar cliente con nombre vacio debe ser rechazado (valor limite 0)
  03 - Flujo E2E de Orden de Venta
    √ TC-12: No permite confirmar una orden sin articulos
    √ TC-13: Rechaza / no agrega una linea con cantidad cero
    √ TC-11: Camino feliz - crear orden con cliente, articulo y cantidad valida

  All specs passed!   11  11  0
```

> La ejecución confirmó además que las credenciales `admin/admin` son válidas (TC-01) y que el control de acceso por sesión funciona (TC-04).

---

## 6. Evidencias

| Tipo | Ubicación |
|------|-----------|
| Videos de ejecución (uno por spec) | `test-suite/cypress/videos/` y copia en `evidencias/videos/` |
| Capturas automáticas (en fallos) | `test-suite/cypress/screenshots/` y `evidencias/capturas/` |
| Salida de consola | Documentada en este informe (sección 5.2) |

---

## 7. Cobertura de automatización (métrica)

| Métrica | Valor |
|---------|-------|
| Casos de prueba totales (Sprint 2) | 16 |
| Casos automatizados | 11 (TC-01 a TC-13, con TC-06/07/08 agrupados) |
| **Cobertura de automatización** | **~69%** (supera meta de 40%) |
| Tasa de éxito de la suite | 100% (11/11) |

---

## 8. Instrucciones de reproducción

```bash
cd test-suite
npm install
npx cypress install
npm run cy:run        # ejecuta toda la suite en modo headless
```

Para ver la ejecución paso a paso: `npm run cy:open`.

---

## 9. Entregables del Sprint 3 (Automatización)

| Entregable | Estado |
|------------|:------:|
| Pruebas automatizadas (Cypress) | ✅ |
| Prueba de caja blanca (análisis de ramas) | ✅ |
| Prueba de caja negra | ✅ |
| Test Suite automatizado ejecutable | ✅ |
| Informe de resultados | ✅ |
| Evidencias (videos, capturas, logs) | ✅ |
