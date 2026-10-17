// Archivo de soporte global de Cypress.
// Se carga automaticamente antes de cada spec.
import "./commands";

// Evita que errores de JS NO relacionados de la app de terceros (FrontAccounting)
// hagan fallar nuestras pruebas. Solo ignoramos excepciones no controladas de la app.
Cypress.on("uncaught:exception", (err) => {
  // Devolver false evita que Cypress falle la prueba por errores de la app bajo prueba.
  return false;
});
