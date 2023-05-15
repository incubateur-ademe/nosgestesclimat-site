import {startTestAndSkipTutorial, clickUnderstoodButton, clickCategoryStartButton, waitWhileLoading} from './utils'

function goToQuestionAndGet(questionURL, category = 'bilan') {
		cy.visit(`/simulateur/${category}/${questionURL}`)

	cy.wait(500)
		clickUnderstoodButton()
		clickCategoryStartButton()

		cy.get(`[id="id-question-${questionURL}"]`)
}

function shouldRedirectTo(entryPoint, expectedURL, category = 'bilan') {
	cy.visit(`/simulateur/${category}/${entryPoint}`)
	cy.url().should('eq',
		Cypress.config().baseUrl + `/simulateur/${category}${expectedURL ? `/${expectedURL}` : ''}`
	)
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

	it(`should go to a mosaic question`, () => {
		goToQuestionAndGet('transport/vacances')
	})

	it(`should go to a question within a mosaic`, () => {
		goToQuestionAndGet('transport/vacances/camping-car/propriétaire')
		goToQuestionAndGet('transport/vacances/caravane/propriétaire')
	})

	it(`should go to the first existing parent rule if the URL doesn't correspond to a parsed rule`, () => {
		shouldRedirectTo('logement/unknown-rule', 'logement')
		shouldRedirectTo('logement/appartement/unknown-rule/adaf/adf', 'logement/appartement')
		shouldRedirectTo('asdfs/logement/appartement/unknown-rule/adaf/adf', '')
	})

	// skip(`should go to the first existing parent rule if the URL doesn't correspond to a parsed rule`, () => {
	// })
})
