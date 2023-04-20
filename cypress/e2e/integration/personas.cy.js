describe('check for about page status', () => {
	beforeEach(() => {
		cy.visit(Cypress.env('base_url') + '/personas')
	})

	it('has a title', () => {
		cy.get('[data-cypress-id="personas-title"]').should('be.visible')
	})
})
