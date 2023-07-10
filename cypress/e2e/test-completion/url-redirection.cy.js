import {
	clickCategoryStartButton,
	clickCategoryStartButtonIfExist,
	clickSkipTutoButton,
	clickUnderstoodButtonIfExist,
	waitWhileLoading,
	walkthroughTest,
} from './utils'

// const params =
// `loc=${Cypress.env('localisation_param')}&lang=${Cypress.env('language_param')}`
// FIXME: seems to be broken with the localisation param
// ''

const firstQuestion = 'transport.voiture.km'
const mainSimulator = 'bilan'

function goToQuestionAndGet(
	question,
	rootSimulatorURL = mainSimulator,
	mosaicFirstQuestion = ''
) {
	cy.visit(`/simulateur/${rootSimulatorURL}?question=${question}`)
	clickUnderstoodButtonIfExist()

	waitWhileLoading()
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
	cy.url().should(
		'eq',
		Cypress.config().baseUrl +
			`/simulateur/${category}${expectedURL ? `?question=${expectedURL}` : ''}`
	)
}

describe('check question redirection from the URL for the category "bilan"', () => {
	it('should redirect to a question without space in the name', () => {
		goToQuestionAndGet('logement.surface')
	})

	it('tutorial should be displayed when going to root after having visited a specific rule URL', () => {
		goToQuestionAndGet('logement.surface')
		cy.visit('/simulateur/bilan')
		clickSkipTutoButton()
	})

	it('should redirect to a question with space in the name', () => {
		goToQuestionAndGet('logement.saisie-habitants')
	})

	it('should redirect to a question with more than 2 depth in the name + space in it', () => {
		goToQuestionAndGet('transport.avion.court-courrier.heures-de-vol')
	})

	it('should redirect to a mosaic question', () => {
		goToQuestionAndGet(
			'transport.vacances',
			'bilan',
			'.camping-car.propriétaire'
		)
	})

	it('should redirect to a question within a mosaic', () => {
		shouldRedirectTo(
			'transport.vacances.camping-car.propriétaire',
			'transport.vacances'
		)
		shouldRedirectTo(
			'transport.vacances.caravane.propriétaire',
			'transport.vacances'
		)
	})

	it("should redirect to the first existing parent rule if the URL doesn't correspond to a parsed rule", () => {
		shouldRedirectTo('logement.unknown-rule', firstQuestion)
		shouldRedirectTo(
			'logement.appartement.unknown-rule.adaf.adf',
			'logement.appartement'
		)
	})

	it("should redirect to the first existing parent rule if the URL doesn't correspond to a parsed rule with a question", () => {
		shouldRedirectTo(
			'transport.voiture.motorisation.thermique',
			'transport.voiture.motorisation'
		)
	})
})

describe('check question redirection from the URL for sub-simulators', () => {
	it('should redirect to the first question of the sub-simulator /transport/avion', () => {
		cy.visit('/simulateur/transport/avion')
		cy.get('[id="id-question-transport.avion.usager"]')
	})

	it('should redirect to the first question of the sub-simulator /transport/avion', () => {
		cy.visit('/simulateur/divers/produits-consommables')
		cy.get('[id="id-question-divers.produits-consommables.consommation"]')
	})

	it('should arrive to the simulation ending page when the last question is answered', () => {
		cy.visit('/simulateur/transport/avion')
		cy.get('[id="id-question-transport.avion.usager"]')
		walkthroughTest({})
		cy.get('[data-cypress-id="simulation-ending"')
	})
})
