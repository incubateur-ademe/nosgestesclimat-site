import {startTestAndSkipTutorial, clickUnderstoodButton, clickCategoryStartButton, waitWhileLoading} from './utils'

function goToQuestionAndGet(questionURL) {
		cy.visit(`/simulateur/bilan/${questionURL}`)

		waitWhileLoading()
		clickUnderstoodButton()
		clickCategoryStartButton()

		cy.get(`[id="id-question-${questionURL}"]`)
}

describe('check question redirection from the URL', () => {
	beforeEach(() => {
		cy.visit(`/?loc=${Cypress.env('localisation_param')}&lang=${Cypress.env('language_param')}`)
		// NOTE(@EmileRolley): need to specify the behavior of the tutorial when
		// redirected from the URL
		startTestAndSkipTutorial()
	})

	it(`should go to a question without space in the name`, () => {
		goToQuestionAndGet('logement/surface')
	})

	it(`should go to a question with space in the name`, () => {
		goToQuestionAndGet('logement/saisie-habitants')
	})

	it(`should go to a question with more than 2 depth in the name + space in it`, () => {
		goToQuestionAndGet('transport/avion/court-courrier/heures-de-vol')
	})

	// skip(`should go to a question within a mosaïc`, () => {
	// })
	//
	// skip(`should go to root if the URL doesn't correspond to a parsed rule`, () => {
	// })
	//
	// skip(`should go to root if the URL doesn't correspond to a parsed rule with a question`, () => {
	// })
})
