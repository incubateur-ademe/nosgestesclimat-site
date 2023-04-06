describe('check for about page status', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/à-propos?lang=en')
	})

	it('has a title', () => {
		cy.contains('About us').should('be.visible')
	})
})
