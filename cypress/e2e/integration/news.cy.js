describe('check for about page status', () => {
	beforeEach(() => {
		cy.visit('/nouveautés')
	})

	it('has a title', () => {
		cy.get('[data-cypress-id="news-title"]').should('be.visible')
	})
})
