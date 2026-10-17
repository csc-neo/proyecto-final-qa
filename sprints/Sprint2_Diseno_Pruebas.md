# Sprint 2 — Diseño de Pruebas (Técnicas Tradicionales y Modernas)

**Proyecto:** Aseguramiento de Calidad de FrontAccounting ERP 2.4.20
**Metodología:** SCRUM
**Objetivo del Sprint:** Diseñar el conjunto de pruebas aplicando técnicas tradicionales (clases de equivalencia, valores límite, tablas de decisión) y modernas (pairwise, diagrama de transición de estados), produciendo al menos 12 casos de prueba y un plan de pruebas formal.

**Equipo responsable:** QA (Emilio Schaad) con revisión del SQA (Guillermo Ortiz).
**SUT:** https://frontaccounting-qa.onrender.com/ — usuario `admin` / contraseña `admin`.

---

## 1. Técnica 1 — Clases de Equivalencia

Se particiona el dominio de entrada en clases válidas (CV) e inválidas (CI), de modo que probar un representante de cada clase equivale a probar toda la clase.

### 1.1 Campo: Identificador de Usuario (login)

| Clase | Tipo | Descripción | Representante |
|-------|------|-------------|---------------|
| CV1 | Válida | Usuario existente y activo | `admin` |
| CI1 | Inválida | Usuario inexistente | `usuario_fantasma` |
| CI2 | Inválida | Campo vacío | *(vacío)* |
| CI3 | Inválida | Solo espacios en blanco | `"   "` |

### 1.2 Campo: Contraseña (login)

| Clase | Tipo | Descripción | Representante |
|-------|------|-------------|---------------|
| CV2 | Válida | Contraseña correcta del usuario | `admin` |
| CI4 | Inválida | Contraseña incorrecta | `12345` |
| CI5 | Inválida | Campo vacío | *(vacío)* |

### 1.3 Campo: Precio del artículo (módulo Inventario / Items)

| Clase | Tipo | Descripción | Representante |
|-------|------|-------------|---------------|
| CV3 | Válida | Número decimal positivo | `150.00` |
| CI6 | Inválida | Número negativo | `-50` |
| CI7 | Inválida | Texto no numérico | `abc` |
| CI8 | Inválida | Vacío | *(vacío)* |

### 1.4 Campo: Cantidad en una orden de venta

| Clase | Tipo | Descripción | Representante |
|-------|------|-------------|---------------|
| CV4 | Válida | Entero positivo dentro de stock | `5` |
| CI9 | Inválida | Cero | `0` |
| CI10 | Inválida | Negativo | `-3` |
| CI11 | Inválida | Mayor al stock disponible | `99999` |

---

## 2. Técnica 2 — Valores Límite (Boundary Value Analysis)

Se prueban los bordes de los rangos válidos, donde históricamente aparecen más defectos.

### 2.1 Campo: Cantidad en orden de venta (rango válido: 1 a stock disponible = 100)

| Valor | Clasificación | Resultado esperado |
|-------|---------------|--------------------|
| 0 | Just below min (inválido) | Rechazado / error |
| 1 | Mínimo válido | Aceptado |
| 2 | Mínimo + 1 | Aceptado |
| 99 | Máximo − 1 | Aceptado |
| 100 | Máximo válido | Aceptado |
| 101 | Just above max (inválido) | Rechazado / advertencia de stock insuficiente |

### 2.2 Campo: Longitud del nombre de un cliente (rango asumido: 1 a 60 caracteres)

| Valor | Clasificación | Resultado esperado |
|-------|---------------|--------------------|
| 0 caracteres | Inválido | Rechazado (campo obligatorio) |
| 1 carácter | Mínimo válido | Aceptado |
| 60 caracteres | Máximo válido | Aceptado |
| 61 caracteres | Inválido | Rechazado o truncado |

### 2.3 Campo: Precio unitario (rango válido: 0.01 a 999999.99)

| Valor | Clasificación | Resultado esperado |
|-------|---------------|--------------------|
| 0.00 | Inválido (bajo) | Rechazado |
| 0.01 | Mínimo válido | Aceptado |
| 999999.99 | Máximo válido | Aceptado |
| 1000000.00 | Inválido (alto) | Rechazado / advertencia |

---

## 3. Técnica 3 — Tablas de Decisión

Permite modelar reglas de negocio con múltiples condiciones combinadas.

### 3.1 Regla de negocio: Autenticación de usuario (login)

| Condición | R1 | R2 | R3 | R4 |
|-----------|:--:|:--:|:--:|:--:|
| Usuario existe | V | V | F | V |
| Contraseña correcta | V | F | - | V |
| Usuario activo | V | V | - | F |
| **Acción: Permitir acceso** | ✅ | ❌ | ❌ | ❌ |
| **Acción: Mostrar error de credenciales** | | ✅ | ✅ | |
| **Acción: Mostrar cuenta deshabilitada** | | | | ✅ |

### 3.2 Regla de negocio: Confirmar una orden de venta

| Condición | R1 | R2 | R3 | R4 |
|-----------|:--:|:--:|:--:|:--:|
| Cliente seleccionado | V | F | V | V |
| Al menos 1 línea de artículo | V | - | F | V |
| Stock suficiente | V | - | - | F |
| **Acción: Confirmar orden** | ✅ | | | |
| **Acción: Error "seleccione cliente"** | | ✅ | | |
| **Acción: Error "agregue artículos"** | | | ✅ | |
| **Acción: Advertencia stock insuficiente** | | | | ⚠️ |

### 3.3 Regla de negocio: Aplicar descuento a factura

| Condición | R1 | R2 | R3 |
|-----------|:--:|:--:|:--:|
| Descuento entre 0 y 100% | V | F (negativo) | F (>100) |
| **Acción: Aplicar descuento** | ✅ | | |
| **Acción: Rechazar valor inválido** | | ✅ | ✅ |

---

## 4. Técnica 4 — Pairwise Testing (Pruebas por Pares)

Técnica moderna de combinatoria que cubre todas las combinaciones de pares de valores entre parámetros, reduciendo el número de casos sin perder cobertura significativa.

### 4.1 Escenario: Creación de un artículo nuevo (módulo Items)

**Parámetros y valores:**
- **Tipo de artículo:** { Compra, Fabricado, Servicio }
- **Unidad de medida:** { c/u, kg }
- **¿Tiene impuesto?:** { Sí, No }
- **Categoría:** { Componentes, Servicios }

**Conjunto reducido pairwise (cubre todos los pares):**

| TC | Tipo | Unidad | Impuesto | Categoría | Resultado esperado |
|----|------|--------|----------|-----------|--------------------|
| PW1 | Compra | c/u | Sí | Componentes | Artículo creado |
| PW2 | Compra | kg | No | Servicios | Artículo creado |
| PW3 | Fabricado | c/u | No | Servicios | Artículo creado |
| PW4 | Fabricado | kg | Sí | Componentes | Artículo creado |
| PW5 | Servicio | c/u | Sí | Servicios | Artículo creado |
| PW6 | Servicio | kg | No | Componentes | Artículo creado |

> Sin pairwise, el total de combinaciones sería 3×2×2×2 = 24. Con pairwise se cubren todos los pares en **6 casos**, una reducción del 75%.

---

## 5. Técnica 5 — Diagrama de Transición de Estados

Modela el comportamiento del sistema según el estado de un objeto y los eventos que lo transicionan. Se aplica al **ciclo de vida de una Orden de Venta** en FrontAccounting.

### 5.1 Estados de una Orden de Venta

```
      [crear orden]            [confirmar]              [facturar]
 ○ ───────────────▶ (Borrador) ──────────▶ (Confirmada) ──────────▶ (Facturada)
                        │                      │                        │
             [cancelar] │           [cancelar] │             [registrar │
                        ▼                      ▼               cobro]    ▼
                   (Cancelada)            (Cancelada)              (Pagada) ● 
```

### 5.2 Tabla de transiciones

| Estado origen | Evento | Estado destino | Válida |
|---------------|--------|----------------|:------:|
| (inicio) | Crear orden | Borrador | ✅ |
| Borrador | Confirmar | Confirmada | ✅ |
| Borrador | Cancelar | Cancelada | ✅ |
| Confirmada | Facturar | Facturada | ✅ |
| Confirmada | Cancelar | Cancelada | ✅ |
| Facturada | Registrar cobro | Pagada | ✅ |
| Facturada | Cancelar | — | ❌ (no permitido) |
| Pagada | Cualquier evento | — | ❌ (estado final) |
| Cancelada | Cualquier evento | — | ❌ (estado final) |

### 5.3 Pruebas derivadas del diagrama
- Verificar que **no** se pueda cancelar una orden ya facturada (transición inválida).
- Verificar que una orden pagada sea un estado terminal.
- Recorrer el camino feliz completo: Borrador → Confirmada → Facturada → Pagada.

---

## 6. Diseño de Casos de Prueba (16 casos)

Formato estándar. Prioridad: Alta/Media/Baja. Técnica de origen indicada.

| ID | Módulo | Título | Técnica | Precondición | Pasos | Datos | Resultado esperado | Prioridad |
|----|--------|--------|---------|--------------|-------|-------|--------------------|:---------:|
| **TC-01** | Seguridad | Login exitoso con credenciales válidas | Clases equiv. / Tabla decisión | Estar en la pantalla de login | 1. Ingresar usuario `admin` 2. Ingresar contraseña `admin` 3. Clic en Acceder | admin/admin | Acceso concedido, se muestra el menú principal | Alta |
| **TC-02** | Seguridad | Login fallido con contraseña incorrecta | Clases equiv. / Tabla decisión | Estar en login | 1. Usuario `admin` 2. Contraseña `12345` 3. Acceder | admin/12345 | Mensaje de error de credenciales; permanece en login | Alta |
| **TC-03** | Seguridad | Login con campos vacíos | Clases equiv. | Estar en login | 1. Dejar usuario y contraseña vacíos 2. Acceder | vacío/vacío | Validación impide el acceso; mensaje de campos requeridos | Alta |
| **TC-04** | Seguridad | Bloqueo de acceso a URL interna sin sesión | Caja negra / Seguridad | Sesión cerrada | 1. Pegar URL de un módulo interno sin loguearse | URL directa | Redirección a login; no se muestra contenido protegido | Alta |
| **TC-05** | Inventario | Crear artículo con datos válidos | Pairwise PW1 | Logueado como admin | 1. Items → nuevo 2. Completar datos válidos 3. Guardar | Tipo Compra, c/u, con impuesto | Artículo creado y visible en el listado | Alta |
| **TC-06** | Inventario | Crear artículo con precio negativo | Clases equiv. / Valores límite | Logueado | 1. Nuevo artículo 2. Precio `-50` 3. Guardar | precio=-50 | Sistema rechaza el valor o muestra error de validación | Alta |
| **TC-07** | Inventario | Crear artículo con precio en el límite inferior | Valores límite | Logueado | 1. Nuevo artículo 2. Precio `0.01` 3. Guardar | precio=0.01 | Artículo aceptado | Media |
| **TC-08** | Inventario | Validar precio no numérico | Clases equiv. | Logueado | 1. Nuevo artículo 2. Precio `abc` 3. Guardar | precio=abc | Error: valor no numérico; no se guarda | Media |
| **TC-09** | Ventas | Crear cliente con nombre válido | Clases equiv. | Logueado | 1. Ventas → nuevo cliente 2. Nombre válido 3. Guardar | "Cliente Prueba SA" | Cliente creado correctamente | Alta |
| **TC-10** | Ventas | Crear cliente con nombre vacío | Valores límite (0 car.) | Logueado | 1. Nuevo cliente 2. Nombre vacío 3. Guardar | nombre="" | Error: nombre obligatorio | Alta |
| **TC-11** | Ventas | Crear orden de venta — camino feliz | Transición de estados | Existe cliente y artículo con stock | 1. Nueva orden 2. Seleccionar cliente 3. Agregar artículo cant. 5 4. Confirmar | cant=5 | Orden pasa de Borrador a Confirmada | Alta |
| **TC-12** | Ventas | Orden de venta sin seleccionar cliente | Tabla de decisión R2 | Logueado | 1. Nueva orden 2. No seleccionar cliente 3. Agregar artículo 4. Confirmar | sin cliente | Error "seleccione cliente"; no se confirma | Alta |
| **TC-13** | Ventas | Orden con cantidad cero | Valores límite | Existe artículo | 1. Nueva orden 2. Agregar artículo cant. 0 3. Confirmar | cant=0 | Rechazo / error de cantidad inválida | Media |
| **TC-14** | Ventas | Orden con cantidad mayor al stock | Tabla decisión R4 / Valores límite | Stock = 100 | 1. Nueva orden 2. Agregar artículo cant. 101 3. Confirmar | cant=101 | Advertencia de stock insuficiente | Media |
| **TC-15** | Ventas | No permitir cancelar orden facturada | Transición de estados (inválida) | Orden en estado Facturada | 1. Abrir orden facturada 2. Intentar cancelar | — | El sistema no permite la cancelación | Media |
| **TC-16** | Compras | Registrar orden de compra válida | Clases equiv. / Pairwise | Existe proveedor | 1. Compras → nueva orden 2. Seleccionar proveedor 3. Agregar artículo 4. Guardar | proveedor + artículo | Orden de compra registrada; stock pendiente de recepción | Alta |

**Total: 16 casos de prueba** (supera el mínimo de 12 exigido).

### 6.1 Trazabilidad técnica → casos

| Técnica | Casos que la aplican |
|---------|---------------------|
| Clases de equivalencia | TC-01, TC-02, TC-03, TC-06, TC-08, TC-09, TC-16 |
| Valores límite | TC-06, TC-07, TC-10, TC-13, TC-14 |
| Tablas de decisión | TC-01, TC-02, TC-12, TC-14 |
| Pairwise | TC-05, TC-16 |
| Transición de estados | TC-11, TC-15 |

---

## 7. Plan de Pruebas (según guía semana 10)

### 7.1 Introducción y objetivos
Validar que los módulos de Seguridad, Ventas, Compras e Inventario de FrontAccounting 2.4.20 cumplen con los requisitos funcionales y los atributos de calidad priorizados (adecuación funcional, seguridad, fiabilidad, usabilidad).

### 7.2 Alcance
- **En alcance:** Login/seguridad, gestión de clientes, órdenes de venta, gestión de artículos/stock, órdenes de compra.
- **Fuera de alcance:** Manufactura, Activos Fijos, Dimensiones, conciliación bancaria completa, reportes avanzados.

### 7.3 Estrategia y tipos de prueba
- **Pruebas funcionales** (manuales) sobre los 16 casos diseñados.
- **Pruebas de caja negra** (validaciones de entrada, reglas de negocio).
- **Pruebas de caja blanca** (análisis de validaciones a nivel de lógica — Sprint de automatización).
- **Pruebas de regresión automatizadas** (Cypress — Sprint 3).

### 7.4 Entorno de pruebas
| Elemento | Detalle |
|----------|---------|
| URL | https://frontaccounting-qa.onrender.com/ |
| Credenciales | admin / admin |
| Navegadores | Chrome (principal), Firefox (compatibilidad) |
| Datos de prueba | Clientes, artículos y proveedores de prueba creados en el ambiente QA |

### 7.5 Criterios de entrada
- Ambiente QA accesible y estable.
- Casos de prueba revisados y aprobados por el SQA.
- Datos de prueba cargados.

### 7.6 Criterios de salida (aceptación)
- 100% de los casos de prueba ejecutados.
- ≥ 80% de casos aprobados.
- Todos los bugs críticos/bloqueantes registrados y comunicados.
- Documentación y evidencias completas.

### 7.7 Criterios de suspensión y reanudación
- **Suspender** si el ambiente QA está caído o inaccesible.
- **Reanudar** cuando el ambiente vuelva a estar operativo y verificado.

### 7.8 Recursos y responsabilidades
| Actividad | Responsable |
|-----------|-------------|
| Diseño de casos | Emilio Schaad (QA) |
| Revisión del plan | Guillermo Ortiz (SQA) |
| Automatización | Daniel Contreras (Líder Técnico) |
| Aceptación de entregables | Edgar Díaz (PO) |
| Facilitación / seguimiento | Cristhiam Samayoa (SM) |

### 7.9 Cronograma (resumen por sprint)
| Sprint | Actividad | Duración estimada |
|--------|-----------|-------------------|
| 2 | Diseño de pruebas y plan | 1 semana |
| 3 | Ejecución manual + bugs | 1 semana |
| 3 | Automatización | 1 semana |
| Final | Métricas y presentación | 3 días |

### 7.10 Riesgos del proyecto de pruebas
| Riesgo | Impacto | Mitigación |
|--------|---------|-----------|
| Ambiente en Render se suspende por inactividad | Alto | Reactivar antes de cada sesión; documentar tiempos de arranque |
| Datos de prueba inconsistentes entre corridas | Medio | Script de preparación de datos / limpieza |
| Equipo pequeño (roles combinados) | Medio | Priorizar casos de alta prioridad |

### 7.11 Entregables del plan
Casos de prueba, matriz de trazabilidad, reporte de ejecución, registro de bugs, test suite automatizado, informe de métricas.

---

## 8. Entregables del Sprint 2

| Entregable | Estado |
|------------|:------:|
| Clases de equivalencia | ✅ |
| Valores límite | ✅ |
| Tablas de decisión | ✅ |
| Pairwise testing | ✅ |
| Diagrama de transición de estados | ✅ |
| 16 casos de prueba (mínimo 12) | ✅ |
| Plan de pruebas completo | ✅ |
