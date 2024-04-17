import { last, now } from "cypress/types/lodash";

describe("Countdown Timer", () => {
  beforeEach(() => {
    //Set the clock and mock the response
    cy.clock(new Date("2024-04-17T07:17:00Z"));
    cy.intercept(
      "GET",
      "http://localhost:3000/v2/racing/next-races-category-group?count=5&categories=%5B%224a2788f8-e825-4d36-9894-efd4baf1cfae%22%2C%229daef0d7-bf3c-4f50-921d-8e818c60fe61%22%2C%22161d9be2-e909-4326-8c2c-35ed71fb460b%22%5D",
      {
        fixture: "races.json",
      },
    ).as("getRaces");
    cy.visit("/");
    cy.wait("@getRaces");
    cy.wait(1000);
  });

  it("Should validate that timer is ticking down", () => {
    //Move the time by 35s
    cy.tick(35_000);
    cy.get(".item >p").last().should("have.text", "3m 1s");
  });

  it("Should validate that race time sign swaps to negative when expected jump time is exceeded", () => {
    cy.tick(35_000);
    cy.get(".item >p").first().should("have.text", "-30s");
  });

  it("Should validate that races do not display after 5 minutes past the jump", () => {
    //Move the time by 5 min
    cy.tick(305_000);
    cy.wait(1000);

    //Check previous first record is not visible
    cy.get(".race-name >p", { timeout: 10000 })
      .should("have.length", 3)
      .first()
      .should("not.have.text", "Caulfield Heath");
  });

  it("Should validate that mutiple races with same jump time disappear", () => {
    //Move the time by 5 min
    cy.tick(460_000);
    cy.wait(1000);

    //Check previous first record is not visible
    cy.get(".race-name >p", { timeout: 10000 })
      .should("have.length", 1)
      .should("have.text", "Geraldton");
  });

  it("Should validate that no races are displayed on all cancellations even with/without filters", () => {
    //Move the time by 5 min
    cy.tick(960_000);
    cy.wait(1000);

    //Check previous first record is not visible
    cy.get(".race-name >p", { timeout: 10000 }).should("not.exist");
    cy.get(".filter-checkbox").each(($filter) => {
      cy.wrap($filter).click();
      cy.get(".race-name >p", { timeout: 10000 }).should("not.exist");
    });
  });

  afterEach(() => {
    cy.clock().then((clock) => {
      clock.restore();
    });
  });
});
