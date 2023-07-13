import {
	clickSeeResultsLink,
	startTestAndSkipTutorial,
	walkthroughTest,
} from './utils'

describe('check for test completion', () => {
	it('can finish the test with the default values with unspecified search params', () => {
		cy.visit('/')
		startTestAndSkipTutorial()
		walkthroughTest({})
		clickSeeResultsLink()
	})
})
