import {
	startTestAndSkipTutorial,
	clickUnderstoodButtonIfExist,
	clickCategoryStartButtonIfExist,
	skipTutoIfExists,
	clickSkipTutoButton,
	clickUnderstoodButton,
	clickCategoryStartButton,
} from './utils'

const params = `loc=${Cypress.env('localisation_param')}&lang=${Cypress.env('language_param')}`

const firstQuestion =  'transport/voiture/km'

function goToQuestionAndGet(questionURL, category = 'bilan') {
	cy.visit(`/simulateur/${category}/${questionURL}?${params}`)
	clickUnderstoodButton()
	clickCategoryStartButton()
	cy.get(`[id="id-question-${questionURL}"]`)
}

function shouldRedirectTo(entryPoint, expectedURL, category = 'bilan') {
	cy.visit(`/simulateur/${category}/${entryPoint}?${params}`)
	if (expectedURL == '') {
		expectedURL = firstQuestion
		clickSkipTutoButton()
	}
	clickUnderstoodButton()
	clickCategoryStartButton()
	cy.url().should('eq',
		Cypress.config().baseUrl
		+ `/simulateur/${category}${expectedURL ? `/${expectedURL}` : ''}`
	)
}

describe('check question redirection from the URL', () => {
	it(`should redirect to a question without space in the name`, () => {
		goToQuestionAndGet('logement/surface')
	})

	it(`tutorial should be displayed when going to root after having visited a specific rule URL`, () => {
		goToQuestionAndGet('logement/surface')
		cy.visit(`/simulateur/bilan?${params}`)
		clickSkipTutoButton()
	})

	it(`should redirect to a question with space in the name`, () => {
		goToQuestionAndGet('logement/saisie-habitants')
	})

	it(`should redirect to a question with more than 2 depth in the name + space in it`, () => {
		goToQuestionAndGet('transport/avion/court-courrier/heures-de-vol')
	})

	it(`should redirect to a mosaic question`, () => {
		goToQuestionAndGet('transport/vacances')
	})

	// it(`should redirect to a question within a mosaic`, () => {
	//	TODO: should redirect to the mosaic question
	// 	goToQuestionAndGet('transport/vacances/camping-car/propriétaire')
	// 	goToQuestionAndGet('transport/vacances/caravane/propriétaire')
	// })
	//
	it(`should redirect to the first existing parent rule if the URL doesn't correspond to a parsed rule`, () => {
		shouldRedirectTo('logement/unknown-rule', '')
		shouldRedirectTo('logement/appartement/unknown-rule/adaf/adf', 'logement/appartement')
	})

	it(`should redirect to the first existing parent rule if the URL doesn't correspond to a parsed rule with a question`, () => {
		shouldRedirectTo('transport/voiture/motorisation/thermique', 'transport/voiture/motorisation')
	})
})
