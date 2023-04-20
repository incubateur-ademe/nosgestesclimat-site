export const defaultTotalValue = '8,4'

export const categoriesToWaitFor = [
	'Societal services', 'Services sociétaux'
]

export async function walkthroughTest(persona, wait) {
	let needToWait = wait
	if (needToWait) {
		// Wait for parsing complete rules
		// cy.wait(100)
		needToWait = false
	}
	cy.wait(100)
	cy.get('body').then(async (body) => {
			if (body.find('[data-cypress-id="see-result-link"]').length > 0) {
				cy.log('See result link')
				return
			}

		if (body.find('section').length > 0) {

			if (body.find('[data-cypress-id="category-title"]').length > 0) {
				const category = await new Cypress.Promise<string>((resolve) => {
					cy.get('[data-cypress-id="category-title"]').then((category) => {
						resolve( category.text())
						// if (categoriesToWaitFor.includes(category.innerText)) {
						// 	needToWait = true
						// 	// cy.get('section button').last().click()
						// 	// walkthroughTest(persona, true)
						// 	// return
						// }
					})
				})
			cy.log('Category: ' + category)
			}
			if (body.find('input').length > 0) {
				cy.get('input').then((input) => {
					const id = input.attr('id')
					const type = input.attr('type')
					if (persona[id]) {
						if (persona[id].valeur || persona[id].valeur === 0) {
							cy.get(`input[id="${id}"]`).type(persona[id].valeur)
						} else {
							if (type === 'text') {
								cy.get(`input[id="${id}"]`).type(persona[id])
							} else {
								cy.get(`input[name="${id}"]`).check(persona[id])
							}
						}
						cy.wait(100)
					}
				})
			}
			cy.log('Need to wait: ' + needToWait)
			cy.get('section button').last().click()
			walkthroughTest(persona, needToWait)
		}
	})
}
