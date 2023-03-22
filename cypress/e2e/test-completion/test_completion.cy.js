const defaultTotal = '8,3'

const categories = [
	{ name: 'Transport', questions: 18 },
	{ name: 'Alimentation', questions: 10 },
	{ name: 'Logement', questions: 9 },
	{ name: 'Divers', questions: 8 },
	{ name: 'Services Public', questions: 1 },
]

describe('check for test completion', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080')
	})

	it('can finish the test with the default values', () => {
		cy.contains('Take the test').click()
		cy.contains('Skip the tutorial').click()
		cy.contains('I understand').click()
		cy.contains('Start').click()
		walkthroughTest({})
		cy.contains('See my result').click()
		cy.contains(defaultTotal).should('be.visible')
	})

	it('can finish the test with personas values', () => {
		cy.request('http://localhost:8081/personas-fr.json').then((response) => {
			const personas = response.body
			const personasName = Object.keys(personas)
			personasName.map((name) => {
				cy.session(name, () => {
					cy.visit('http://localhost:8080')
					cy.contains('Take the test').click()
					cy.contains('Skip the tutorial').click()
					cy.contains('I understand').click()
					cy.contains('Start').click()
					walkthroughTest(personas[name].data)
					cy.contains('See my result').click()
				})
			})
		})
	})
})

function walkthroughTest(persona) {
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
