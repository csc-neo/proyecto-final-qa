# Test Suite Automatizado — FrontAccounting QA (Cypress)

Suite de pruebas automatizadas E2E para FrontAccounting ERP 2.4.20, construida con **Cypress**.

## Requisitos
- Node.js 18+ (probado con Node 24)
- npm

## Instalación
```bash
cd test-suite
npm install
npx cypress install   # descarga el binario de Cypress si no se instaló automáticamente
```

## Ejecución

**Modo headless (consola, genera videos):**
```bash
npm run cy:run
```

**Modo interactivo (abre la interfaz de Cypress):**
```bash
npm run cy:open
```

**Ejecutar un solo archivo:**
```bash
npx cypress run --spec "cypress/e2e/01_autenticacion.cy.js"
```

## Estructura
```
test-suite/
├─ cypress.config.js              <- Configuración (baseUrl, timeouts, credenciales en env)
├─ package.json
└─ cypress/
   ├─ e2e/
   │  ├─ 01_autenticacion.cy.js       <- TC-01..TC-04 (seguridad / caja negra)
   │  ├─ 02_validaciones_items.cy.js  <- TC-05..TC-10 (items y clientes)
   │  └─ 03_flujo_orden_venta.cy.js   <- TC-11..TC-13 (flujo E2E de orden de venta)
   ├─ fixtures/
   │  └─ datos_prueba.json            <- Datos de prueba parametrizados
   └─ support/
      ├─ commands.js                  <- Comandos reutilizables (faLogin, etc.)
      └─ e2e.js
```

## Configuración del entorno
En `cypress.config.js`:
- `baseUrl`: https://frontaccounting-qa.onrender.com
- `env.FA_USER` / `env.FA_PASS`: credenciales (`admin` / `admin`)

> El ambiente está en hosting gratuito (Render) y puede tardar en "despertar" la primera vez. Los timeouts ya están configurados en consecuencia.

## Mapeo casos de prueba → specs
| Caso | Spec | Técnica |
|------|------|---------|
| TC-01 Login válido | 01_autenticacion | Clases equiv. / Tabla decisión |
| TC-02 Login contraseña incorrecta | 01_autenticacion | Clases equiv. |
| TC-03 Login campos vacíos | 01_autenticacion | Clases equiv. |
| TC-04 Acceso sin sesión | 01_autenticacion | Caja negra / Seguridad |
| TC-05 Formulario de items | 02_validaciones_items | Navegación |
| TC-06/07/08 Validación precio | 02_validaciones_items | Clases / Valores límite |
| TC-09 Formulario de clientes | 02_validaciones_items | Navegación |
| TC-10 Cliente sin nombre | 02_validaciones_items | Valores límite |
| TC-11 Orden camino feliz | 03_flujo_orden_venta | Transición de estados |
| TC-12 Orden sin artículos | 03_flujo_orden_venta | Tabla de decisión |
| TC-13 Orden cantidad cero | 03_flujo_orden_venta | Valores límite |

## Evidencias
- **Videos:** `cypress/videos/` (uno por spec, generados automáticamente).
- **Capturas:** `cypress/screenshots/` (solo en fallos).
- Copia de respaldo en `../evidencias/`.
