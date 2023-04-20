describe('check for about page status', () => {
	beforeEach(() => {
		cy.visit('/accessibilite')
	})

	it('has a title', () => {
		cy.get('[data-cypress-id="accessibility-statement-title"]').should('be.visible')
	})
})
