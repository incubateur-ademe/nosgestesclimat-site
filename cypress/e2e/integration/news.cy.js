describe('check for about page status', () => {
	beforeEach(() => {
		cy.visit(Cypress.env('base_url') + '/nouveautés')
	})

	it('has a title', () => {
		cy.get('[data-cypress-id="news-title"]').should('be.visible')
	})
})
