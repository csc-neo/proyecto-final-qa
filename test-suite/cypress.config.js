const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // URL base del ambiente de pruebas de FrontAccounting
    baseUrl: "https://frontaccounting-qa.onrender.com",
    // Genera evidencias automaticamente
    video: true,
    screenshotOnRunFailure: true,
    videosFolder: "cypress/videos",
    screenshotsFolder: "cypress/screenshots",
    // El hosting gratuito (Render) puede tardar en responder al "despertar"
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 60000,
    responseTimeout: 30000,
    viewportWidth: 1366,
    viewportHeight: 768,
    // Reporte en consola
    reporter: "spec",
    env: {
      // Credenciales del ambiente de QA
      FA_USER: "admin",
      FA_PASS: "admin",
    },
    setupNodeEvents(on, config) {
      // Hook para plugins / eventos de node si se requieren mas adelante
      return config;
    },
  },
});
