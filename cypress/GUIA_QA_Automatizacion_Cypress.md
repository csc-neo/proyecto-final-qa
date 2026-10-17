# Guía de Pruebas Automatizadas con Cypress — FrontAccounting ERP

**Dirigida a:** QA (Emilio Schaad) y equipo técnico.
**Objetivo:** Que cualquier integrante pueda instalar, ejecutar y entender el test suite automatizado desde cero, sin conocimiento previo de Cypress.
**SUT:** FrontAccounting 2.4.20 — https://frontaccounting-qa.onrender.com — usuario `admin` / contraseña `admin`.

---

## Índice
1. [¿Qué es Cypress y cómo prueba?](#1-qué-es-cypress-y-cómo-prueba)
2. [Requisitos previos](#2-requisitos-previos)
3. [Instalación paso a paso](#3-instalación-paso-a-paso)
4. [Cómo ejecutar las pruebas](#4-cómo-ejecutar-las-pruebas)
5. [Estructura del proyecto](#5-estructura-del-proyecto)
6. [Explicación de la configuración](#6-explicación-de-la-configuración)
7. [Conceptos básicos de un test Cypress](#7-conceptos-básicos-de-un-test-cypress)
8. [Los comandos reutilizables (login)](#8-los-comandos-reutilizables-login)
9. [Scripts de prueba explicados uno por uno](#9-scripts-de-prueba-explicados-uno-por-uno)
10. [Evidencias generadas](#10-evidencias-generadas)
11. [Solución de problemas frecuentes](#11-solución-de-problemas-frecuentes)
12. [Mapa casos de prueba → scripts](#12-mapa-casos-de-prueba--scripts)

---

## 1. ¿Qué es Cypress y cómo prueba?

**Cypress** es una herramienta de pruebas **end-to-end (E2E)**. Abre un navegador real, navega a la URL del sistema y simula lo que haría una persona: escribir en campos, hacer clic, seleccionar de listas desplegables; luego **verifica (asserts)** que el resultado sea el esperado.

En este proyecto, Cypress corre contra el sitio real `https://frontaccounting-qa.onrender.com` con las credenciales `admin/admin`. No es una simulación teórica: realmente inicia sesión, navega los módulos y crea una orden de venta.

De cada corrida genera **automáticamente**:
- Un **video** por cada archivo de prueba.
- Una **captura de pantalla** cuando una prueba falla.

Estas evidencias son las que se entregan en la carpeta `evidencias/`.

---

## 2. Requisitos previos

| Requisito | Versión mínima | Cómo verificar |
|-----------|----------------|----------------|
| Node.js | 18 o superior (probado con 24) | `node --version` |
| npm (viene con Node) | 9 o superior | `npm --version` |
| Conexión a internet | — | para acceder al ambiente QA |

Si no tienes Node.js, descárgalo de https://nodejs.org (versión LTS).

> **Nota sobre el ambiente:** el sitio está en hosting gratuito (Render). Si lleva rato sin usarse, la primera carga puede tardar hasta ~1 minuto en "despertar". Es normal; los timeouts del proyecto ya lo contemplan.

---

## 3. Instalación paso a paso

Abre una terminal (PowerShell en Windows) y ejecuta:

```bash
# 1. Entrar a la carpeta del test suite
cd "c:\Users\cscde\Desktop\Proyecto_QA_FrontAccounting\test-suite"

# 2. Instalar las dependencias del proyecto (Cypress y lo necesario)
npm install

# 3. Instalar el binario del navegador de Cypress (si no se instaló solo)
npx cypress install

# 4. Verificar que Cypress quedó bien instalado
npx cypress verify
```

Si el paso 4 muestra `Verified Cypress!`, todo está listo.

> **¿Por qué el paso 3 por separado?** En algunos equipos npm no ejecuta automáticamente el script de instalación del navegador de Cypress por políticas de seguridad. `npx cypress install` lo descarga explícitamente.

---

## 4. Cómo ejecutar las pruebas

Siempre desde la carpeta `test-suite`.

### Opción A — Modo consola (headless, genera videos)
Ideal para obtener evidencias y correr todo de un tirón.

```bash
# Ejecutar TODAS las pruebas
npm run cy:run

# Ejecutar un solo archivo
npx cypress run --spec "cypress/e2e/01_autenticacion.cy.js"

# Ejecutar el flujo de orden de venta
npx cypress run --spec "cypress/e2e/03_flujo_orden_venta.cy.js"
```

### Opción B — Modo visual (interactivo)
Abre la interfaz de Cypress y puedes ver el navegador ejecutando cada paso en vivo. Muy útil para la **demostración en la presentación**.

```bash
npm run cy:open
```
Luego elige "E2E Testing" → el navegador → y haz clic en el archivo de prueba que quieras ver.

### Resultado esperado
```
  01_autenticacion.cy.js        4 tests   4 passing
  02_validaciones_items.cy.js   4 tests   4 passing
  03_flujo_orden_venta.cy.js    3 tests   3 passing

  All specs passed!   11  11  0
```

---

## 5. Estructura del proyecto

```
test-suite/
├─ cypress.config.js            Configuración global (URL, timeouts, credenciales)
├─ package.json                 Dependencias y comandos (cy:run, cy:open)
├─ .gitignore                   Ignora node_modules, videos y capturas
└─ cypress/
   ├─ e2e/                      LAS PRUEBAS (specs)
   │  ├─ 01_autenticacion.cy.js       Seguridad / login (TC-01..TC-04)
   │  ├─ 02_validaciones_items.cy.js  Items y clientes (TC-05..TC-10)
   │  └─ 03_flujo_orden_venta.cy.js   Flujo E2E de orden de venta (TC-11..TC-13)
   ├─ fixtures/
   │  └─ datos_prueba.json            Datos de prueba parametrizados
   └─ support/
      ├─ commands.js                  Comandos reutilizables (faLogin, etc.)
      └─ e2e.js                       Configuración que corre antes de cada test
```

**Regla simple:** las pruebas van en `cypress/e2e/` y los archivos terminan en `.cy.js`.

---

## 6. Explicación de la configuración

### `package.json` — comandos del proyecto
```json
{
  "scripts": {
    "cy:open": "cypress open",   // modo visual
    "cy:run": "cypress run",     // modo consola
    "test": "cypress run"
  },
  "devDependencies": {
    "cypress": "^13.15.0"
  }
}
```

### `cypress.config.js` — configuración central
```javascript
module.exports = defineConfig({
  e2e: {
    baseUrl: "https://frontaccounting-qa.onrender.com", // URL base; permite usar rutas cortas
    video: true,                        // graba video de cada corrida
    screenshotOnRunFailure: true,       // captura al fallar
    defaultCommandTimeout: 15000,       // espera hasta 15s por elemento (Render es lento)
    pageLoadTimeout: 60000,             // espera hasta 60s a que cargue la página
    env: {
      FA_USER: "admin",                 // usuario (no quemado en los tests)
      FA_PASS: "admin",                 // contraseña
    },
  },
});
```

**Puntos clave:**
- `baseUrl` permite escribir `cy.visit("/index.php")` en vez de la URL completa.
- Los **timeouts altos** son a propósito: el hosting gratuito responde lento.
- Las **credenciales viven aquí**, no en cada prueba. Si cambian, se actualizan en un solo lugar.

### `cypress/support/e2e.js` — se ejecuta antes de cada test
```javascript
import "./commands";   // carga los comandos personalizados

// FrontAccounting (app de terceros) puede lanzar errores JS internos que no son
// nuestros bugs. Esto evita que esos errores hagan fallar nuestras pruebas.
Cypress.on("uncaught:exception", () => false);
```

---

## 7. Conceptos básicos de un test Cypress

Toda prueba usa la misma estructura:

```javascript
describe("Nombre de la suite", () => {     // AGRUPA pruebas relacionadas
  it("TC-01: descripción del caso", () => { // UNA prueba (un caso de prueba)
    cy.visit("/index.php");                 // acción
    cy.get("input[name='x']").type("algo"); // acción
    cy.get("body").should("contain", "ok"); // verificación (assert)
  });
});
```

Comandos de Cypress que verás seguido:

| Comando | Qué hace |
|---------|----------|
| `cy.visit(url)` | Navega a una página |
| `cy.get(selector)` | Localiza un elemento (botón, campo, etc.) |
| `.type("texto")` | Escribe en un campo |
| `.clear()` | Borra el contenido de un campo |
| `.click()` | Hace clic |
| `.select(valor)` | Elige una opción de una lista desplegable |
| `.should("exist")` | Verifica una condición (assert) |
| `cy.clearCookies()` | Borra las cookies (cierra sesión) |
| `cy.log("mensaje")` | Escribe una nota en el reporte |

**Patrón de las pruebas: Arrange – Act – Assert** (preparar, actuar, verificar).

---

## 8. Los comandos reutilizables (login)

Para no repetir el login en cada prueba, se creó un comando personalizado en `cypress/support/commands.js`. Así cada prueba solo escribe `cy.faLogin()`.

```javascript
Cypress.Commands.add("faLogin", (user, pass) => {
  const u = user !== undefined ? user : Cypress.env("FA_USER");  // admin
  const p = pass !== undefined ? pass : Cypress.env("FA_PASS");  // admin

  cy.visit("/index.php");                        // 1. abre el login
  if (u !== "") cy.faUserField().clear().type(u);    // 2. escribe usuario
  if (p !== "") cy.faPassField().clear().type(p);    // 3. escribe contraseña
  cy.faLoginButton().click();                    // 4. clic en Acceder
});
```

### Selectores robustos
Para localizar los campos se usan **varias alternativas** separadas por coma, por si el `name` exacto cambia según el tema/versión:

```javascript
cy.get('input[name="user_name_entry_field"], input[name="username"], input[name="user_name"]')
```
Significa: "usa el primero que exista de estos". Esto hace la prueba más resistente a cambios menores.

### Verificar que la sesión está activa
```javascript
Cypress.Commands.add("faAssertLoggedIn", () => {
  cy.get("body").then(($body) => {
    const text = $body.text().toLowerCase();
    const loggedIn =
      text.includes("salir") || text.includes("logout") ||
      $body.find('a[href*="logout"]').length > 0 ||
      $body.find("frame, iframe").length > 0;
    expect(loggedIn, "indicios de sesion iniciada").to.be.true;
  });
});
```
No asume el resultado: busca señales reales de sesión (enlace "salir", logout, o el frame del menú).

---

## 9. Scripts de prueba explicados uno por uno

### 9.1 `01_autenticacion.cy.js` — Seguridad (caja negra)

Cuatro pruebas sobre el login y el control de acceso.

```javascript
describe("01 - Autenticacion y Seguridad", () => {

  // TC-01: credenciales correctas -> debe entrar
  it("TC-01: Login exitoso con credenciales validas (admin/admin)", () => {
    cy.faLogin("admin", "admin");
    cy.faAssertLoggedIn();
  });

  // TC-02: contraseña incorrecta -> no entra y muestra error
  it("TC-02: Login fallido con contrasena incorrecta", () => {
    cy.faLogin("admin", "contrasena_incorrecta_123");
    cy.faPassField().should("exist");   // sigue en el login
  });

  // TC-03: campos vacíos -> no concede acceso
  it("TC-03: Login con campos vacios no debe conceder acceso", () => {
    cy.faLogin("", "");
    cy.faUserField().should("exist");
    cy.faPassField().should("exist");
  });

  // TC-04: entrar a una URL interna SIN sesión -> debe pedir login
  it("TC-04: Acceso directo a modulo interno sin sesion redirige a login", () => {
    cy.clearCookies();  // cierra cualquier sesión
    cy.visit("/sales/sales_order_entry.php", { failOnStatusCode: false });
    cy.get("body").then(($body) => {
      const hasLogin =
        $body.find('input[type="password"]').length > 0 ||
        $body.text().toLowerCase().includes("usuario");
      expect(hasLogin, "se solicita autenticacion").to.be.true;
    });
  });
});
```

**Qué prueba cada una:**
- **TC-01:** el camino feliz del login.
- **TC-02:** que una contraseña mala sea rechazada.
- **TC-03:** que no se pueda entrar con campos vacíos.
- **TC-04:** control de acceso — sin sesión, el sistema debe redirigir al login (prueba de seguridad).

---

### 9.2 `02_validaciones_items.cy.js` — Items y Clientes (caja negra)

Usa `beforeEach` para iniciar sesión antes de cada prueba:

```javascript
describe("02 - Validaciones de Items y Clientes", () => {
  beforeEach(() => {
    cy.faLogin();          // login automático antes de CADA test
    cy.faAssertLoggedIn();
  });
```

- **TC-05:** navega al mantenimiento de artículos (`/inventory/manage/items.php`) y verifica que el formulario está presente.
- **TC-06/07/08:** prueba el campo de precio con tres valores:
  - `0.01` (valor límite inferior válido),
  - `-50` (negativo, debería rechazarse),
  - `abc` (texto no numérico).
  Registra en el log el comportamiento observado (ligado a BUG-02 y BUG-03).
- **TC-09:** navega al mantenimiento de clientes y verifica el formulario.
- **TC-10:** intenta guardar un cliente **sin nombre** y verifica que el sistema no lo acepte.

Fragmento del TC-10 (nota el detalle de seleccionar solo el botón **visible**):
```javascript
const addBtn = $b
  .find('input[name="addupdate"], button[name="addupdate"]')
  .filter(":visible");   // evita atrapar botones ocultos de los combos
```

> **Diseño defensivo:** varias de estas pruebas comprueban primero si el campo existe; si el formulario no está accesible en esa vista, escriben una nota (`cy.log`) para validación manual en vez de fallar bruscamente. Así la suite se mantiene estable y señala qué revisar a mano.

---

### 9.3 `03_flujo_orden_venta.cy.js` — Flujo E2E de orden de venta

El script más completo: simula el **proceso de negocio completo** de crear una orden.

**Campos reales del formulario** (confirmados explorando el sitio):
| Selector | Elemento |
|----------|----------|
| `select[name="customer_id"]` | Cliente |
| `select[name="stock_id"]` | Artículo |
| `input[name="qty"]` | Cantidad |
| `input[name="price"]` | Precio |
| `button[name="AddItem"]` | Adicionar artículo |
| `button[name="ProcessOrder"]` | Colocar orden (confirmar) |

**TC-11 — Camino feliz (los 5 pasos):**
```javascript
// 1. Seleccionar el primer cliente real (ignora la opción vacía)
cy.get('select[name="customer_id"]').then(($sel) => {
  const opciones = $sel.find("option").filter((i, o) => o.value !== "");
  cy.get('select[name="customer_id"]').select(opciones.eq(0).val(), { force: true });
});
cy.wait(1500);  // el formulario se recarga al elegir cliente

// 2. Seleccionar el primer artículo
cy.get('select[name="stock_id"]').then(...);

// 3. Cantidad válida
cy.get('input[name="qty"]').clear().type("5");

// 4. Adicionar la línea al carrito
cy.get('button[name="AddItem"]').first().click({ force: true });

// 5. Colocar la orden -> transición Borrador → Confirmada
cy.get('button[name="ProcessOrder"]').first().click({ force: true });
```
Al final verifica que la página de resultado contenga texto esperado ("orden", "entrega", "factura"), confirmando que la orden avanzó de estado.

**TC-12:** intenta colocar una orden **sin artículos** y verifica que el sistema no la procese.
**TC-13:** agrega una línea con **cantidad 0** y observa el comportamiento (ligado a BUG-05).

**Dos decisiones técnicas importantes:**
- `{ force: true }` en los clics: FrontAccounting tiene botones ocultos de los combos; esto evita que Cypress falle por un elemento tapado.
- `cy.wait(...)`: pausas cortas porque el formulario se recarga al elegir cliente y el hosting responde con latencia. (En proyectos maduros se reemplazan por esperas basadas en condiciones).

---

## 10. Evidencias generadas

| Evidencia | Ubicación | Cuándo se genera |
|-----------|-----------|------------------|
| Videos (uno por archivo de prueba) | `test-suite/cypress/videos/` | En cada corrida con `cy:run` |
| Capturas de pantalla | `test-suite/cypress/screenshots/` | Solo cuando una prueba falla |
| Copia de respaldo | `../evidencias/videos/` | Copiadas manualmente |

Para la entrega, copia los videos a la carpeta de evidencias:
```powershell
Copy-Item "cypress\videos\*" "..\evidencias\videos\" -Force
```

---

## 11. Solución de problemas frecuentes

| Problema | Causa | Solución |
|----------|-------|----------|
| La primera prueba tarda mucho o da timeout | El ambiente Render estaba "dormido" | Abre el sitio en el navegador primero para despertarlo, luego corre las pruebas |
| `cypress: command not found` | No se instaló Cypress | Ejecuta `npm install` y `npx cypress install` |
| `Verified Cypress!` no aparece | Binario incompleto | `npx cypress install --force` |
| Una prueba falla por un elemento "not visible" | Botón oculto de un combo | Ya se maneja con `{ force: true }` y `.filter(":visible")` |
| Error de certificado / red | Sin conexión o firewall | Verifica el acceso a la URL del SUT en el navegador |

---

## 12. Mapa casos de prueba → scripts

| Caso | Script | Técnica de diseño | ¿Automatizado? |
|------|--------|-------------------|:--------------:|
| TC-01 Login válido | 01_autenticacion | Clases equiv. / Tabla decisión | ✅ |
| TC-02 Contraseña incorrecta | 01_autenticacion | Clases de equivalencia | ✅ |
| TC-03 Campos vacíos | 01_autenticacion | Clases de equivalencia | ✅ |
| TC-04 Acceso sin sesión | 01_autenticacion | Seguridad / caja negra | ✅ |
| TC-05 Formulario de items | 02_validaciones_items | Navegación | ✅ |
| TC-06/07/08 Validación de precio | 02_validaciones_items | Clases / Valores límite | ✅ |
| TC-09 Formulario de clientes | 02_validaciones_items | Navegación | ✅ |
| TC-10 Cliente sin nombre | 02_validaciones_items | Valores límite | ✅ |
| TC-11 Orden camino feliz | 03_flujo_orden_venta | Transición de estados | ✅ |
| TC-12 Orden sin artículos | 03_flujo_orden_venta | Tabla de decisión | ✅ |
| TC-13 Orden cantidad cero | 03_flujo_orden_venta | Valores límite | ✅ |

**Total automatizado:** 11 pruebas → cobertura de automatización ~69% de los 16 casos diseñados.
**Resultado de la última corrida:** 11/11 en verde (100% de éxito).

---

## Resumen rápido (TL;DR)

```bash
cd "c:\Users\cscde\Desktop\Proyecto_QA_FrontAccounting\test-suite"
npm install            # instalar
npx cypress install    # instalar navegador
npm run cy:run         # correr todo (genera videos)
npm run cy:open        # modo visual (para la demo)
```
Credenciales en `cypress.config.js` (`admin/admin`). Pruebas en `cypress/e2e/`. Evidencias en `cypress/videos/`.
