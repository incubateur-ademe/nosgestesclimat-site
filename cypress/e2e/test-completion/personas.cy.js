import { walkthroughTest, localServerUrl } from './utils'

describe('check for test completion', () => {
	beforeEach(() => {
		cy.visit(localServerUrl)
	})
	it('can finish the test with personas values', () => {
		cy.request('https://data.nosgestesclimat.fr/personas-fr.json').then((response) => {
			const personas = response.body
			const personasName = Object.keys(personas)
			personasName.map((name) => {
				cy.session(name, () => {
					cy.visit(localServerUrl)
					cy.get('[data-cypress-id="do-the-test-link"]').click()
					cy.get('[data-cypress-id="skip-tuto-button"]').click()
					cy.get('[data-cypress-id="understood-button"]').click()
					cy.get('[data-cypress-id="start-button"]').click()
					walkthroughTest(personas[name].data)
					cy.get('[data-cypress-id="see-results-link"]').click()
				})
			})
		})
	})
})
