import {
	clickUnderstoodButtonIfExist,
	clickCategoryStartButtonIfExist,
	clickSkipTutoButton,
	clickUnderstoodButton,
	clickCategoryStartButton,
} from './utils'

const params =
	// `loc=${Cypress.env('localisation_param')}&lang=${Cypress.env('language_param')}`
	// FIXME: seems to be broken with the localisation param
	""

const firstQuestion = "transport.voiture.km"
const mainSimulator = "bilan"

function goToQuestionAndGet(question, category = mainSimulator, mosaicFirstQuestion = '') {
	cy.visit(`/simulateur/${category}?question=${question}`)
	clickUnderstoodButton()
	clickCategoryStartButton()
	cy.get(`[id="id-question-${question}${mosaicFirstQuestion}"]`)
}

function shouldRedirectTo(entryPoint, expectedURL, category = mainSimulator) {
	cy.visit(`/simulateur/${category}?question=${entryPoint}`)
	if (category === mainSimulator && expectedURL === firstQuestion) {
		clickSkipTutoButton()
	}
	clickUnderstoodButtonIfExist()
	clickCategoryStartButtonIfExist()
	cy.url().should('eq',
		Cypress.config().baseUrl
		+ `/simulateur/${category}${expectedURL ? `?question=${expectedURL}` : ''}`
	)
}

describe('check question redirection from the URL', () => {
	it(`should redirect to a question without space in the name`, () => {
		goToQuestionAndGet('logement.surface')
	})

	// TODO: test category

	it(`tutorial should be displayed when going to root after having visited a specific rule URL`, () => {
		goToQuestionAndGet('logement.surface')
		cy.visit(`/simulateur/bilan`)
		clickSkipTutoButton()
	})

	it(`should redirect to a question with space in the name`, () => {
		goToQuestionAndGet('logement.saisie-habitants')
	})

	it(`should redirect to a question with more than 2 depth in the name + space in it`, () => {
		goToQuestionAndGet('transport.avion.court-courrier.heures-de-vol')
	})

	it(`should redirect to a mosaic question`, () => {
		goToQuestionAndGet('transport.vacances', 'bilan', '.camping-car.propriétaire')
	})

	it(`should redirect to a question within a mosaic`, () => {
		shouldRedirectTo('transport.vacances.camping-car.propriétaire', 'transport.vacances')
		shouldRedirectTo('transport.vacances.caravane.propriétaire', 'transport.vacances')
	})

	it(`should redirect to the first existing parent rule if the URL doesn't correspond to a parsed rule`,
	() => {
		shouldRedirectTo('logement.unknown-rule', firstQuestion)
		shouldRedirectTo(
		  'logement.appartement.unknown-rule.adaf.adf',
		  'logement.appartement'
		)
	})

	it(`should redirect to the first existing parent rule if the URL doesn't correspond to a parsed rule with a question`, () => {
		shouldRedirectTo(
			'transport.voiture.motorisation.thermique',
			'transport.voiture.motorisation'
		)
	})
})
