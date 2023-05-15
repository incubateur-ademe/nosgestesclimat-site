// TODO: should be in the same file as the test
export const defaultTotalValue = '8,4'

export async function clickUnderstoodButton() {
	cy.get('[data-cypress-id="understood-button"]').click()
}

export async function clickCategoryStartButton() {
	cy.get('[data-cypress-id="start-button"]').click()
}

export async function clickSkipTutoButton() {
	cy.get('[data-cypress-id="skip-tuto-button"]').click()
}

export async function skipTutoIfExists(body) {
	if (body.find('[data-cypress-id="skip-tuto-button"]').length > 0) {
		clickSkipTutoButton()
	}
}

export async function clickUnderstoodButtonIfExist() {
	cy.get('body').then((body) => {
		if (body.find('[data-cypress-id="understood-button"]').length > 0) {
			clickUnderstoodButton()
		}
	})
}

export async function startTestAndSkipTutorial() {
	cy.get('[data-cypress-id="do-the-test-link"]').click()
	clickSkipTutoButton()
	clickUnderstoodButton()
	clickCategoryStartButton()
}

export async function waitWhileLoading() {
	cy.get('body').then((body) => {
		if (body.find('[data-cypress-id="loader"]')?.length > 0) {
			// Waiting for rules parsing
			cy.wait(4000)
	}})
}

function encodeRuleName(ruleName) {
	return encodeURI(ruleName
		?.replace(/\s\.\s/g, '/')
		.replace(/-/g, '\u2011') // replace with a insecable tiret to differenciate from space
		.replace(/\s/g, '-'))
}

function isMosaicQuestion(body) {
	return body.find('[data-cypress-id="mosaic-question"]')?.length > 0
}

export async function walkthroughTest(persona) {
	cy.wait(100)

	waitWhileLoading()

	cy.get('body').then((body) => {
		if (body.find('section').length > 0) {
			if (body.find('input').length > 0) {
				cy.get('input').then((input) => {
					const id = input.attr('id')
					const type = input.attr('type')

					if (id != undefined && !isMosaicQuestion(body)) {
						// TODO(@EmileRolley): need to specify the behavior for mosaic questions
						cy.log(type)
						cy.url().should('include', encodeRuleName(id))
					}

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
