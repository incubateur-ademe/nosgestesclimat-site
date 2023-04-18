describe('check for about page status', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/personas?lang=en')
	})

	it('has a title', () => {
		cy.get('[data-cypress-id="personas-title"]').should('be.visible')
	})
})
