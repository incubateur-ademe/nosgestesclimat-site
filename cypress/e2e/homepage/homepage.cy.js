describe('check for homepage status', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080')
	})

	it('has a start button', () => {
		cy.contains('Take the test').should('be.visible')
	})
	it('has a group button', () => {
		cy.contains('As a group').should('be.visible')
	})
})
