import { startTestAndSkipTutorial } from "./utils"

describe('Test', () => {
	it("should follow the question order (transports, alimentation, logement, divers, services publiques)", () => {
			cy.visit(`/?loc=${Cypress.env('localisation_param')}&lang=${Cypress.env('language_param')}`)
			startTestAndSkipTutorial()


      // Prevents https://github.com/datagir/nosgestesclimat-site/pull/1049 from happening again
      // Questions where skipped when the value passed was too low
      cy.get('main').contains('Transport')
      cy.get('button.suggestion').first().click()
      cy.get('button[data-cypress-id="next-question-button"]').first().click()
      cy.get('main').contains('Transport')
	})
})
