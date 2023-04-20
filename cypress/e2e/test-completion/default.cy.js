import { walkthroughTest, defaultTotalValue, localServerUrl } from './utils'

describe('check for test completion', () => {
	beforeEach(() => {
		cy.visit(localServerUrl)
	})

	it('can finish the test with the default values', () => {
		cy.get('[data-cypress-id="do-the-test-link"]').click()
		cy.get('[data-cypress-id="skip-tuto-button"]').click()
		cy.get('[data-cypress-id="understood-button"]').click()
		cy.get('[data-cypress-id="start-button"]').click()
		walkthroughTest({})
		cy.get('[data-cypress-id="see-results-link"]').click()
		cy.contains(defaultTotalValue).should('be.visible')
	})
})
