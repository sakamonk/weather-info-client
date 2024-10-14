describe("Clicking page indicator buttons", () => {
  it("should change pages and active indicator", () => {
    cy.visit("http://localhost:4000");

    // initial page
    cy.get(".page-1-indicator").should("have.class", "active");
    cy.get(".page-2-indicator").should("not.have.class", "active");
    cy.get(".page-3-indicator").should("not.have.class", "active");
    cy.get(".page-4-indicator").should("not.have.class", "active");
    cy.get(".page-5-indicator").should("not.have.class", "active");
    cy.get(".page-6-indicator").should("not.have.class", "active");

    cy.get(".page-2-indicator").click();
    cy.url().should("include", "/page2");
    cy.get(".page-1-indicator").should("not.have.class", "active");
    cy.get(".page-2-indicator").should("have.class", "active");
    cy.get(".page-3-indicator").should("not.have.class", "active");
    cy.get(".page-4-indicator").should("not.have.class", "active");
    cy.get(".page-5-indicator").should("not.have.class", "active");
    cy.get(".page-6-indicator").should("not.have.class", "active");

    cy.get(".page-3-indicator").click();
    cy.url().should("include", "/page3");
    cy.get(".page-1-indicator").should("not.have.class", "active");
    cy.get(".page-2-indicator").should("not.have.class", "active");
    cy.get(".page-3-indicator").should("have.class", "active");
    cy.get(".page-4-indicator").should("not.have.class", "active");
    cy.get(".page-5-indicator").should("not.have.class", "active");
    cy.get(".page-6-indicator").should("not.have.class", "active");

    cy.get(".page-4-indicator").click();
    cy.url().should("include", "/page4");
    cy.get(".page-1-indicator").should("not.have.class", "active");
    cy.get(".page-2-indicator").should("not.have.class", "active");
    cy.get(".page-3-indicator").should("not.have.class", "active");
    cy.get(".page-4-indicator").should("have.class", "active");
    cy.get(".page-5-indicator").should("not.have.class", "active");
    cy.get(".page-6-indicator").should("not.have.class", "active");

    cy.get(".page-5-indicator").click();
    cy.url().should("include", "/page5");
    cy.get(".page-1-indicator").should("not.have.class", "active");
    cy.get(".page-2-indicator").should("not.have.class", "active");
    cy.get(".page-3-indicator").should("not.have.class", "active");
    cy.get(".page-4-indicator").should("not.have.class", "active");
    cy.get(".page-5-indicator").should("have.class", "active");
    cy.get(".page-6-indicator").should("not.have.class", "active");

    cy.get(".page-6-indicator").click();
    cy.url().should("include", "/page6");
    cy.get(".page-1-indicator").should("not.have.class", "active");
    cy.get(".page-2-indicator").should("not.have.class", "active");
    cy.get(".page-3-indicator").should("not.have.class", "active");
    cy.get(".page-4-indicator").should("not.have.class", "active");
    cy.get(".page-5-indicator").should("not.have.class", "active");
    cy.get(".page-6-indicator").should("have.class", "active");

    cy.get(".page-1-indicator").click();
    cy.url().should("include", "/");
    cy.get(".page-1-indicator").should("have.class", "active");
    cy.get(".page-2-indicator").should("not.have.class", "active");
    cy.get(".page-3-indicator").should("not.have.class", "active");
    cy.get(".page-4-indicator").should("not.have.class", "active");
    cy.get(".page-5-indicator").should("not.have.class", "active");
    cy.get(".page-6-indicator").should("not.have.class", "active");
  });
});
