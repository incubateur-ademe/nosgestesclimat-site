import { walkthroughTest, startTestAndSkipTutorial } from './utils'

describe('check for test completion', () => {
	it('can finish the test with the default values with unspecified search params', () => {
		cy.visit('/')
		startTestAndSkipTutorial()
		walkthroughTest({})
		cy.get('[data-cypress-id="see-results-link"]').click()
	})
})
