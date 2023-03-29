describe('check for about page status', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/personas')
	})

	it('has an average persona', () => {
		cy.contains('Average').should('be.visible')
	})
})
