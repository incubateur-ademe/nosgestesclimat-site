const {
	walkthroughTest,
	clickSkipTutoButton,
	clickUnderstoodButton,
	clickCategoryStartButton,
	startTestAndSkipTutorial,
} = require('../test-completion/utils')

describe('The Group creation page /groupes/creer', () => {
	let groupURL = ''
	it('allows to create a new group and displays it afterwards', () => {
		// Fill simulation
		cy.visit('/')

		startTestAndSkipTutorial()

		walkthroughTest()

		// Then create group
		cy.visit('/groupes')

		// Check that the list is empty and the message is displayed

		// Check that we can create our first group
		cy.get('[data-cypress-id="button-create-first-group"]').click()
		cy.get('input[data-cypress-id="group-input-owner-name"]').type('Jean-Marc')
		cy.get('[data-cypress-id="button-create-group"]').click()
		cy.get('[data-cypress-id="group-name"]')

		// Check that we can create a second group
		cy.visit('/groupes')
		cy.get('[data-cypress-id="button-create-first-group"]').click()
		cy.get('input[data-cypress-id="group-input-owner-name"]').type('Jean-Marc')
		cy.get('[data-cypress-id="button-create-group"]').click()
		cy.get('[data-cypress-id="group-name"]')

		// And that we can update its name
		cy.get('[data-cypress-id="group-name-edit-button"]').click()

		const newName = 'Les amis de Jean-Marc'

		cy.get('input[data-cypress-id="group-edit-input-name"]').type(newName)
		cy.get('[data-cypress-id="button-inline-input"]').click()
		cy.get('[data-cypress-id="group-name"]').contains(newName)

		// Check that we can copy the invitation link
		cy.get('[data-cypress-id="invite-button"]').click()
		cy.window()
			.its('navigator.clipboard')
			.invoke('readText')
			.then((text) => {
				text.then((URL) => {
					console.log(URL)
					groupURL = URL
				})
			})
	})

	it('allows to join a group with the invitation link and display ', () => {
		// Check
		cy.visit(groupURL)

		cy.get('[data-cypress-id="member-name"]').type('Jean-Claude')
		cy.get('[data-cypress-id="button-join-group"]').click()

		clickSkipTutoButton()
		clickUnderstoodButton()
		clickCategoryStartButton()

		walkthroughTest()

		cy.get('[data-cypress-id="see-results-link"]').click()

		cy.get('[data-cypress-id="group-name"]')

		// Check that the main sections are displayed
		cy.get('[data-cypress-id="points-fort-faibles-title"]')
		cy.get('[data-cypress-id="votre-empreinte-title"]')
	})
})
