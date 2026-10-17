# Proyecto final de QA: FrontAccounting 2.4.20

Aplicación del ciclo completo de QA con SCRUM sobre FrontAccounting 2.4.20.

- Sistema bajo prueba: https://frontaccounting-qa.onrender.com/ (ambiente de QA, usuario de prueba admin / admin)
- Informe final: ver `informe/`

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `informe/` | Informe final en PDF |
| `sprints/` | Documentos de los Sprints 1, 2 y 3 |
| `cypress/` | Suite de pruebas automatizadas (`e2e/`), guía y evidencia de la corrida |
| `evidencias/TC-01` a `TC-16` | Capturas de la ejecución manual, una carpeta por caso |
| `evidencias/bugs/` | Capturas de los bugs (BUG-01 a BUG-11) |

## Convención de nombres

Capturas de casos: `TC-05_01.png`, `TC-05_02.png`. Capturas de bugs: `BUG-11_01.png`.

## Cómo ejecutar Cypress

```
npm install cypress
npx cypress run
```
Ver `cypress/GUIA_QA_Automatizacion_Cypress.md`.

## Equipo

Cristhiam Samayoa (Scrum Master), Edgar Díaz (Product Owner), Emilio Schaad (QA), Guillermo Ortiz (SQA), Daniel Contreras (Líder Técnico y Arquitecto), Herber Godoy (Developer).
