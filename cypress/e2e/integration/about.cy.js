describe('check for about page status', () => {
	beforeEach(() => {
		cy.visit(Cypress.env('base_url') + '/à-propos')
	})

	it('has a title', () => {
		cy.get('[data-cypress-id="about-us-title"]').should('be.visible')
	})
})
