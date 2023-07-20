import {
	clickSeeResultsLink,
	defaultTotalValue,
	startTestAndSkipTutorial,
	walkthroughTest,
} from '../utils'

describe('check for test completion', () => {
	beforeEach(() => {
		cy.visit(
			`/?loc=${Cypress.env('localisation_param')}&lang=${Cypress.env(
				'language_param'
			)}`
		)
	})

	it('can finish the test with the default values with loc=FR and lang=fr', () => {
		startTestAndSkipTutorial()
		walkthroughTest({})
		clickSeeResultsLink()
		cy.contains(defaultTotalValue).should('be.visible')
	})
})
