describe('check for about page status', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/accessibilite?lang=en')
	})

	it('has a title', () => {
		cy.get('[data-cypress-id="accessibility-statement-title"]').should('be.visible')
	})
})
