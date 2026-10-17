/// <reference types="cypress" />

/**
 * Suite 01 - Autenticacion y Seguridad (Caja Negra)
 * Mapea los casos TC-01, TC-02, TC-03, TC-04 del Sprint 2.
 * SUT: FrontAccounting 2.4.20 - https://frontaccounting-qa.onrender.com
 */

describe("01 - Autenticacion y Seguridad", () => {
  it("TC-01: Login exitoso con credenciales validas (admin/admin)", () => {
    cy.faLogin("admin", "admin");
    cy.faAssertLoggedIn();
  });

  it("TC-02: Login fallido con contrasena incorrecta", () => {
    cy.faLogin("admin", "contrasena_incorrecta_123");
    // No debe iniciar sesion: debe seguir viendose el formulario de login
    cy.faPassField().should("exist");
    cy.get("body")
      .invoke("text")
      .then((t) => {
        const txt = t.toLowerCase();
        // FrontAccounting muestra mensaje de credenciales incorrectas
        expect(
          txt.includes("incorrect") ||
            txt.includes("incorrecto") ||
            txt.includes("acceso") ||
            txt.includes("usuario")
        ).to.be.true;
      });
  });

  it("TC-03: Login con campos vacios no debe conceder acceso", () => {
    cy.faLogin("", "");
    // Debe permanecer en la pantalla de login
    cy.faUserField().should("exist");
    cy.faPassField().should("exist");
  });

  it("TC-04: Acceso directo a modulo interno sin sesion redirige a login", () => {
    // Intentar entrar a un modulo interno sin autenticarse
    cy.clearCookies();
    cy.visit("/sales/sales_order_entry.php", { failOnStatusCode: false });
    // Debe forzar el login (campo usuario presente) y NO mostrar el modulo
    cy.get("body", { timeout: 20000 }).then(($body) => {
      const hasLogin =
        $body.find('input[type="password"]').length > 0 ||
        $body.text().toLowerCase().includes("usuario");
      expect(hasLogin, "se solicita autenticacion").to.be.true;
    });
  });
});
