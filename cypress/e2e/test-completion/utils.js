// TODO: should be in the same file as the test
export const defaultTotalValue = '8,4'

export async function startTestAndSkipTutorial() {
	cy.get('[data-cypress-id="do-the-test-link"]').click()
	cy.get('[data-cypress-id="skip-tuto-button"]').click()
	cy.get('[data-cypress-id="understood-button"]').click()
	cy.get('[data-cypress-id="start-button"]').click()
}

export async function walkthroughTest(persona) {
	cy.wait(100)

	cy.get('body').then((body) => {
		if (body.find('[data-cypress-id="loader"]')?.length > 0) {
			// Waiting for complete rules parsing
			cy.wait(4000)
	}})

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
						if (body.find('.hide')?.length > 0) {
							// Close the notification window
							cy.get('.hide').last().click()
						}
					}
				})
			}

			cy.get('section button').last().click()
			walkthroughTest(persona)
		}
	})
}
