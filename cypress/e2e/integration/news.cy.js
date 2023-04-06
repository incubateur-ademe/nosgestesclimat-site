describe('check for about page status', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/nouveautés?lang=en')
	})

	it('has a title', () => {
		cy.get('[data-cypress-id="news-title"]').should('be.visible')
	})
})
