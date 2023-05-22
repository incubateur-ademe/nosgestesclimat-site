import { startTestAndSkipTutorial, clickCategoryStartButton, clickDontKnowButton, clickPreviousButton } from "./utils"

describe('validate the question order behavior', () => {
	beforeEach(() => {
		cy.visit(`/?loc=${Cypress.env('localisation_param')}&lang=${Cypress.env('language_param')}`)
		startTestAndSkipTutorial()
	})

	it("should follow the question order (transports, alimentation, logement, divers, services publiques)", () => {
      // Prevents https://github.com/datagir/nosgestesclimat-site/pull/1049 from happening again
      // Questions where skipped when the value passed was too low
      cy.get('main').contains('Transport')
      cy.get('button.suggestion').first().click()
      cy.get('button[data-cypress-id="next-question-button"]').first().click()
      cy.get('main').contains('Transport')
	})

	it("should follow the question order when clicked on a specific category", () => {
		cy.get('[data-cypress-id="sub-category-bar-logement"]').click()
		cy.get('[data-cypress-id="category-title-logement"]')
		clickCategoryStartButton()
		cy.url().should('include', 'logement')
		clickDontKnowButton()
		cy.url().then((firstQuestionUrl) => {
			expect(firstQuestionUrl).to.include('logement')
			clickDontKnowButton()
			cy.url().should('include', 'logement')
			clickPreviousButton()
			cy.url().should('eq', firstQuestionUrl)
		})
	})
})
