// Simulate the swipe left gesture by triggering touch events
function swipeLeft(element) {
  cy.get(element)
    .trigger("touchstart", { touches: [{ clientX: 300, clientY: 200 }] })
    .trigger("touchmove", { touches: [{ clientX: 50, clientY: 200 }] })
    .trigger("touchend", { touches: [{ clientX: 50, clientY: 200 }] });
}

// Simulate the swipe right gesture by triggering touch events
function swipeRight(element) {
  cy.get(element)
    .trigger("touchstart", { touches: [{ clientX: 50, clientY: 200 }] })
    .trigger("touchmove", { touches: [{ clientX: 300, clientY: 200 }] })
    .trigger("touchend", { touches: [{ clientX: 300, clientY: 200 }] });
}

describe("Swiping to left", () => {
  it("should swipe left from Page 1 to Page 6", () => {
    cy.visit("http://localhost:4000");

    // Ensure that Page 1 is visible initially
    cy.contains("This is Page 1").should("be.visible");

    swipeLeft("body");

    // After the swipe, Page 2 should be visible
    cy.contains("This is Page 2").should("be.visible");

    swipeLeft("body");
    cy.contains("This is Page 3").should("be.visible");

    swipeLeft("body");
    cy.contains("This is Page 4").should("be.visible");

    swipeLeft("body");
    cy.contains("This is Page 5").should("be.visible");

    swipeLeft("body");
    cy.contains("This is Page 6").should("be.visible");
  });

  it("should not swipe left from the last page", () => {
    cy.visit("http://localhost:4000/page6");

    cy.contains("This is Page 6").should("be.visible");

    swipeLeft("body");

    // After the swipe, Page 6 should still be visible
    cy.contains("This is Page 6").should("be.visible");
  });
});

describe("Swiping to right", () => {
  it("should swipe right from Page 6 to Page 1", () => {
    cy.visit("http://localhost:4000/page6");

    // Ensure that Page 6 is visible initially
    cy.contains("This is Page 6").should("be.visible");

    swipeRight("body");
    cy.contains("This is Page 5").should("be.visible");

    swipeRight("body");
    cy.contains("This is Page 4").should("be.visible");

    swipeRight("body");
    cy.contains("This is Page 3").should("be.visible");

    swipeRight("body");
    cy.contains("This is Page 2").should("be.visible");

    swipeRight("body");
    cy.contains("This is Page 1").should("be.visible");
  });

  it("should not swipe right from the first page", () => {
    cy.visit("http://localhost:4000/");

    cy.contains("This is Page 1").should("be.visible");

    swipeRight("body");

    // After the swipe, Page 1 should still be visible
    cy.contains("This is Page 1").should("be.visible");
  });
});
