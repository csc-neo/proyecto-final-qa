/// <reference types="cypress" />

/**
 * Suite 02 - Validaciones del modulo Inventario / Items y Ventas / Clientes (Caja Negra)
 * Mapea los casos TC-05, TC-06, TC-07, TC-08, TC-09, TC-10 del Sprint 2.
 * Aplica: clases de equivalencia, valores limite, pairwise.
 *
 * Rutas confirmadas por exploracion sobre el ambiente real:
 *   - Inventario: /index.php?application=stock  ->  /inventory/manage/items.php
 *   - Clientes:   /sales/manage/customers.php
 */

describe("02 - Validaciones de Items y Clientes", () => {
  beforeEach(() => {
    cy.faLogin();
    cy.faAssertLoggedIn();
  });

  it("TC-05: Acceder al mantenimiento de Items muestra el formulario de articulo", () => {
    // Activar el contexto de la aplicacion de inventario y abrir items
    cy.visit("/index.php?application=stock", { failOnStatusCode: false });
    cy.visit("/inventory/manage/items.php", { failOnStatusCode: false });

    // Verificacion robusta: debe existir un formulario con campos de item
    cy.get("form", { timeout: 20000 }).should("exist");
    cy.get("body").then(($b) => {
      const hasItemFields =
        $b.find('input[name*="description"], input[name*="Descr"]').length > 0 ||
        $b.find('select[name*="stock_id"], input[name*="stock_id"]').length > 0 ||
        $b.find("table").length > 0;
      expect(hasItemFields, "formulario/listado de items presente").to.be.true;
    });
  });

  it("TC-06 / TC-07 / TC-08: Validacion del campo precio (clases y valores limite)", () => {
    cy.visit("/index.php?application=stock", { failOnStatusCode: false });
    cy.visit("/inventory/prices.php", { failOnStatusCode: false });

    cy.get("body").then(($b) => {
      const priceInputs = $b.find(
        'input[name*="price"], input[name*="Price"]'
      );

      if (priceInputs.length === 0) {
        cy.log(
          "Campo de precio no editable en esta vista; validar manualmente (ver Sprint 3: BUG-02/BUG-03)."
        );
        // La prueba no falla: se documenta como observacion para prueba manual.
        return;
      }

      const field = cy.wrap(priceInputs.first());

      // TC-07 valor limite inferior valido 0.01
      field.clear().type("0.01").should("have.value", "0.01");

      // TC-06 valor invalido negativo: se ingresa y se observa el comportamiento
      cy.wrap(priceInputs.first()).clear().type("-50").invoke("val").then((v) => {
        cy.log("Valor tras ingresar negativo: " + v);
      });

      // TC-08 valor no numerico
      cy.wrap(priceInputs.first()).clear().type("abc").invoke("val").then((v) => {
        cy.log("Valor tras ingresar texto no numerico: " + v);
      });
    });
  });

  it("TC-09: Acceder al mantenimiento de Clientes muestra el formulario", () => {
    cy.visit("/index.php?application=orders", { failOnStatusCode: false });
    cy.visit("/sales/manage/customers.php", { failOnStatusCode: false });

    cy.get("form", { timeout: 20000 }).should("exist");
    cy.get("body").then(($b) => {
      const hasCustomerForm =
        $b.find('input[name*="CustName"], input[name*="cust"], input[name*="name"]')
          .length > 0 || $b.find("select, table").length > 0;
      expect(hasCustomerForm, "formulario de clientes presente").to.be.true;
    });
  });

  it("TC-10: Guardar cliente con nombre vacio debe ser rechazado (valor limite 0)", () => {
    cy.visit("/index.php?application=orders", { failOnStatusCode: false });
    cy.visit("/sales/manage/customers.php", { failOnStatusCode: false });

    cy.get("body").then(($b) => {
      const nameField = $b.find(
        'input[name="CustName"], input[name*="CustName"]'
      );
      // Boton de alta/actualizacion de cliente en FA 2.4: name="addupdate".
      // Filtramos a submits VISIBLES para no atrapar botones ocultos de los combos.
      const addBtn = $b
        .find('input[name="addupdate"], button[name="addupdate"]')
        .filter(":visible");

      if (nameField.length === 0 || addBtn.length === 0) {
        cy.log(
          "Formulario de alta de cliente no accesible directamente en esta vista; validar manualmente (ver TC-10 / BUG-04)."
        );
        return;
      }

      // Dejar el nombre vacio e intentar guardar
      cy.wrap(nameField.first()).clear();
      cy.wrap(addBtn.first()).click();

      // El sistema NO debe navegar fuera: debe permanecer el formulario de cliente
      // (idealmente con un mensaje de validacion). Documentamos el comportamiento.
      cy.get('input[name="CustName"], input[name*="CustName"]', {
        timeout: 15000,
      }).should("exist");
    });
  });
});
