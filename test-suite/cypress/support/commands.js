// Comandos personalizados reutilizables para el test suite de FrontAccounting.

/**
 * Localiza el campo de usuario del login de forma robusta.
 * FrontAccounting 2.4 usa name="user_name_entry_field"; se incluyen alternativas.
 */
Cypress.Commands.add("faUserField", () => {
  return cy.get(
    'input[name="user_name_entry_field"], input[name="username"], input[name="user_name"]'
  ).first();
});

/**
 * Localiza el campo de contrasena del login.
 */
Cypress.Commands.add("faPassField", () => {
  return cy.get('input[name="password"], input[type="password"]').first();
});

/**
 * Localiza el boton de envio del login.
 */
Cypress.Commands.add("faLoginButton", () => {
  return cy.get(
    'input[name="SubmitUser"], button[name="SubmitUser"], input[type="submit"], button[type="submit"]'
  ).first();
});

/**
 * Realiza login en FrontAccounting.
 * @param {string} user  usuario (por defecto el de env FA_USER)
 * @param {string} pass  contrasena (por defecto el de env FA_PASS)
 */
Cypress.Commands.add("faLogin", (user, pass) => {
  const u = user !== undefined ? user : Cypress.env("FA_USER");
  const p = pass !== undefined ? pass : Cypress.env("FA_PASS");

  cy.visit("/index.php");

  if (u !== "") {
    cy.faUserField().clear().type(u);
  }
  if (p !== "") {
    cy.faPassField().clear().type(p, { log: false });
  }
  cy.faLoginButton().click();
});

/**
 * Verifica que la sesion esta activa (login exitoso).
 * Tras login, FrontAccounting muestra el menu/escritorio y la opcion de salir.
 */
Cypress.Commands.add("faAssertLoggedIn", () => {
  // Buscamos indicios de sesion: enlace de salir, o el frame/menu principal.
  cy.get("body", { timeout: 20000 }).then(($body) => {
    const text = $body.text().toLowerCase();
    const loggedIn =
      text.includes("salir") ||
      text.includes("logout") ||
      text.includes("escritorio") ||
      $body.find('a[href*="logout"]').length > 0 ||
      $body.find("frame, iframe").length > 0;
    expect(loggedIn, "indicios de sesion iniciada").to.be.true;
  });
});
