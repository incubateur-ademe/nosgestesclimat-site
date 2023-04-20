describe('check for homepage status', () => {
	beforeEach(() => {
		cy.visit(Cypress.env('base_url'))
	})

	it('has a start button', () => {
		cy.get('[data-cypress-id="do-the-test-link"]').should('be.visible')
	})
	it('has a group button', () => {
		cy.get('[data-cypress-id="as-a-group-link"]').should('be.visible')
	})
})
