import { RACING_CATEGORIES } from "../config/constants";

describe("Category Filters", () => {
  beforeEach(function () {
    cy.visit("/");
  });

  it("Should validate that all checkboxes are checked by default", () => {
    cy.get("[data-testid=category-filter-checkbox]").should("be.checked");
  });

  it("Should validate that checkboxes filter content appropriately", () => {
    cy.get("[data-testid=category-filter-checkbox]").first().check();
    // Compare against intercepted real data
    // This test may need to be split into multiple for each category depending on how you structure it
  });

  it("Should validate that unchecking all checkboxes re-enables all", () => {
    cy.get("[data-testid=category-filter-checkbox]").uncheck();
    cy.get("[data-testid=category-filter-checkbox]").should("be.checked");
  });

  it("Should always show only 5 rows", () => {
    cy.get(".item").should("have.length", 5);

    // Click on a filter checkbox and assert only 5 rows are displayed
    cy.get(".filter-checkbox").first().click();
    cy.get(".filter-checkbox").each(($filter) => {
      cy.wrap($filter).click();
      cy.get(".item").should("have.length", 5);
    });
  });
});
