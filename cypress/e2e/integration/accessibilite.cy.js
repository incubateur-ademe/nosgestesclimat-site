describe('check for about page status', () => {
	beforeEach(() => {
		cy.visit(Cypress.env('base_url') + '/accessibilite')
	})

	it('has a title', () => {
		cy.get('[data-cypress-id="accessibility-statement-title"]').should('be.visible')
	})
})
