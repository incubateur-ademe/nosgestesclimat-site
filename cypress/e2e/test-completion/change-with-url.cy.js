import {startTestAndSkipTutorial, clickUnderstoodButton, clickCategoryStartButton, waitWhileLoading} from './utils'

describe('check question redirection from the URL', () => {
	beforeEach(() => {
		cy.visit(`/?loc=${Cypress.env('localisation_param')}&lang=${Cypress.env('language_param')}`)
		// NOTE(@EmileRolley): need to specify the behavior of the tutorial when
		// redirected from the URL
		startTestAndSkipTutorial()
	})

	it(`should go to a question without space in the name`, () => {
		cy.visit(`/simulateur/bilan/logement/surface`)

		waitWhileLoading()

		clickUnderstoodButton()
		clickCategoryStartButton()
		cy.get('#id-question-Surface')

		cy.wait(2000)

		// closeExplanationButton()
		//
		// cy.get('body').then((body) => {
		// 	if (body.find("#")
		// 	cy.contains("#id-question-Surface")
		// })
	})

	// it(`should go to a question without space in the name`, () => {
	// 	cy.visit(`/simulateur/bilan/transport/empreinte`)
	//
	// 	cy.wait(2000)
	// 	cy.get('body').then((body) => {
	// 		clickUnderstoodButtonIfExist(body)
	// 	})
	// 	cy.wait(2000)
	// })
})
