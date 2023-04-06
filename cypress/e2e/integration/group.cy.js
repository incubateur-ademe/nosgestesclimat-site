describe('check for group page status', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/groupe?lang=en')
	})

	it('has a start button', () => {
		cy.contains(`Let's go!`).should('be.visible')
	})
	it('has a title', () => {
		cy.contains('Group mode').should('be.visible')
	})
})
