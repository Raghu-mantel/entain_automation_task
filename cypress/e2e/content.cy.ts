import { RACING_CATEGORIES } from "../config/constants";

describe("Page Content", () => {
  it("Should correctly display page title", () => {
    cy.visit("/");
    cy.title().should("eq", "Entain Automation Coding Task");
  });

  it("Should display expected values for race row contents", () => {
    cy.intercept("GET", "**/next-races-category-group**").as("raceDetails");
    cy.visit("/");
    cy.wait("@raceDetails");

    //Get race content from UI
    cy.get(".race-name").then(($els) => {
      let texts = Array.from($els, (el) =>
        el.innerText.replace(/(\r\n|\n|\r)/gm, " "),
      );
      let texts0 = texts.join();
      let texts1 = [];

      //Intercepted response from network and sort
      cy.get("@raceDetails")
        .its("response.body.race_summaries")
        .then((races) => {
          const sortedRaces = Object.keys(races).sort((a, b) => {
            const startTimeA = new Date(races[a].advertised_start).getTime();
            const startTimeB = new Date(races[b].advertised_start).getTime();
            return startTimeA - startTimeB;
          });

          //Create a sorted object
          const sortedObject = sortedRaces.reduce((acc, key) => {
            acc[key] = races[key];
            return acc;
          }, {});
          for (const i in sortedObject) {
            const startTimeNow = new Date().getTime();
            const startTimeAd = new Date(races[i].advertised_start).getTime();
            const fi = (startTimeAd - startTimeNow) / 1000;
            texts1.push(
              "R" + races[i].race_number + "  " + races[i].venue_name,
            );
          }
          //Assert the values
          expect(texts0).to.equal(texts1.slice(0, 5).toString());
        });
    });
  });

  it("Should correctly display page heading", () => {
    cy.visit("/");
    cy.get("[data-testid=page-title]")
      .contains("Next To Go Races")
      .and("be.visible");
  });
});
