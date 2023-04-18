describe('check for group page status', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/groupe?lang=en')
	})

	it('has a start button', () => {
		cy.get('[data-cypress-id="group-start-button"]').should('be.visible')
	})
	it('has a title', () => {
		cy.get('[data-cypress-id="group-title"]').should('be.visible')
	})
})
