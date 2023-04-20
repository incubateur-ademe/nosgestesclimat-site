export const defaultTotalValue = '8,3'

export const localServerUrl = 'http://localhost:8080'

export const categories = [
	{ name: 'Transport', questions: 18 },
	{ name: 'Alimentation', questions: 10 },
	{ name: 'Logement', questions: 9 },
	{ name: 'Divers', questions: 8 },
	{ name: 'Services Public', questions: 1 },
]

export function walkthroughTest(persona) {
	cy.wait(100)
	cy.get('body').then((body) => {
		if (body.find('section').length > 0) {
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
			cy.get('section button').last().click()
			walkthroughTest(persona)
		}
	})
}
