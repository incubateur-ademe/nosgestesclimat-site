describe('check for about page status', () => {
	beforeEach(() => {
		cy.visit('/personas')
	})

	it('has a title', () => {
		cy.get('[data-cypress-id="personas-title"]').should('be.visible')
	})
})
