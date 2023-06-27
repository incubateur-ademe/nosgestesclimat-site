import { walkthroughTest, defaultTotalValue, startTestAndSkipTutorial } from './utils'

describe('check for test completion', () => {
	beforeEach(() => {
		cy.visit(`/?loc=${Cypress.env('localisation_param')}&lang=${Cypress.env('language_param')}`)
	})

	it('can finish the test with the default values with loc=FR and lang=fr', () => {
		startTestAndSkipTutorial()
		walkthroughTest({})
		cy.get('[data-cypress-id="see-results-link"]').click()
		cy.contains(defaultTotalValue).should('be.visible')
	})
})
