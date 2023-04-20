const { readFileSync, writeFileSync } = require('fs')
const { parse } = require('yaml')

const personas = parse(readFileSync('./nosgestesclimat/personas/personas-fr.yaml', 'utf8'))

const getFileContent = (name, data) => `
import { walkthroughTest, localServerUrl } from './utils'
describe('check for test completion', () => {
	it("can finish the test with persona '${name}' values", () => {
		cy.session('${name}', () => {
			cy.visit(Cypress.env('base_url'))
			cy.get('[data-cypress-id="do-the-test-link"]').click()
			cy.get('[data-cypress-id="skip-tuto-button"]').click()
			cy.get('[data-cypress-id="understood-button"]').click()
			cy.get('[data-cypress-id="start-button"]').click()
			walkthroughTest(${JSON.stringify(data.data)})
			cy.get('[data-cypress-id="see-results-link"]').click()
		})
	})
})
`

Object.entries(personas).map(([dottedName, data]) => {
	const name = dottedName.split(' . ')[1]
	writeFileSync(`./cypress/e2e/test-completion/persona-${name}.cy.js`, getFileContent(name, data))
	console.log(`[OK] persona-${name}.cy.js`)
})
