import {
	clickDoTheTestLink,
	clickSkipTutoButton,
	encodedRespirationParam,
	mainSimulator,
	waitWhileLoading,
} from '../utils'

describe('bug #1: going back to the simulation page after visiting the tutorial page', () => {
	it('should show the transport respiration', () => {
		cy.visit('')
		clickDoTheTestLink()
		waitWhileLoading()
		cy.get('[data-cypress-id="home-logo-link"]').click()
		clickDoTheTestLink()
		clickSkipTutoButton()
		cy.url().should(
			'eq',
			Cypress.config().baseUrl +
				`/simulateur/${mainSimulator}?${encodedRespirationParam}=transport`
		)
	})
})
