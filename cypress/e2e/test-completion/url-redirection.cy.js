import {
	walkthroughTest,
	waitWhileLoading,
	startTestAndSkipTutorial,
	clickDontKnowButton,
	clickCategoryStartButton
} from './utils'

const params =
	// `loc=${Cypress.env('localisation_param')}&lang=${Cypress.env('language_param')}`
	// FIXME: seems to be broken with the localisation param
	""

const firstQuestion = "transport.voiture.km"
const thirdQuestion = "transport.voiture.motorisation"
const mainSimulator = "bilan"

function goToQuestionAndGet(
	question,
	rootSimulatorURL = mainSimulator,
	mosaicFirstQuestion = '',
) {
	cy.visit(`/simulateur/${rootSimulatorURL}?question=${question}`)
	waitWhileLoading()
	cy.get(`[id="id-question-${question}${mosaicFirstQuestion}"]`)
}

function shouldRedirectTo(entryPoint, expectedURL, category = mainSimulator) {
	cy.visit(`/simulateur/${category}?question=${entryPoint}`)
	cy.url().should('eq',
		Cypress.config().baseUrl
		+ `/simulateur/${category}${expectedURL ? `?question=${expectedURL}` : ''}`
	)
}

describe('check question redirection from the URL for the category "bilan" (with finished test)', () => {

	it(`should redirect to the last question answered`, () => {
		cy.log('Skip tutorial and finish the test')
		cy.visit(`/`)
		startTestAndSkipTutorial()

		for (let i = 0; i < 3; i++) {
				clickDontKnowButton()
		}

		cy.url().should('eq', Cypress.config().baseUrl + `/simulateur/${mainSimulator}?question=${thirdQuestion}`)
		cy.wait(1000)
		cy.visit(`/simulateur/${mainSimulator}?question=logement.surface`)
		cy.url().should('eq', Cypress.config().baseUrl + `/simulateur/${mainSimulator}?question=${thirdQuestion}`)
	})

	// it(`should redirect to a question without space in the name`, () => {
	// 	cy.log('Skip tutorial and finish the test')
	// 	cy.visit(`/`)
	// 	startTestAndSkipTutorial()
	// 	walkthroughTest({})
	//
	// 	cy.log('should redirect to a question without space in the name')
	// 	goToQuestionAndGet('logement.surface')
	//
	// 	cy.log(`should redirect to a question with space in the name`)
	// 	goToQuestionAndGet('logement.saisie-habitants')
	//
	// 	cy.log(`should redirect to a question with more than 2 depth in the name + space in it`)
	// 	goToQuestionAndGet('transport.avion.court-courrier.heures-de-vol')
	//
	// 	cy.log(`should redirect to a mosaic question`)
	// 	goToQuestionAndGet('transport.vacances', 'bilan', '.camping-car.propriétaire')
	//
	// 	cy.log(`should redirect to a question within a mosaic`)
	// 	shouldRedirectTo('transport.vacances.camping-car.propriétaire', 'transport.vacances')
	// 	shouldRedirectTo('transport.vacances.caravane.propriétaire', 'transport.vacances')
	//
	// 	cy.log(`should redirect to the first existing parent rule if the URL doesn't correspond to a parsed rule`)
	// 	shouldRedirectTo(
	// 		'logement.appartement.unknown-rule.adaf.adf',
	// 		'logement.appartement'
	// 	)
	//
	// 	cy.log(`should redirect to the first existing parent rule if the URL doesn't correspond to a parsed rule with a question`)
	// 	shouldRedirectTo(
	// 		'transport.voiture.motorisation.thermique',
	// 		'transport.voiture.motorisation'
	// 	)
	// })
})

// describe('check question redirection from the URL for sub-simulators', () => {
// 	it(`should redirect to the first question of the sub-simulator /transport/avion`,
// 		() => {
// 			cy.visit(`/simulateur/transport/avion`)
// 			cy.get(`[id="id-question-transport.avion.usager"]`)
// 		}
// 	)
//
// 	it(`should redirect to the first question of the sub-simulator /transport/avion`,
// 		() => {
// 			cy.visit(`/simulateur/divers/produits-consommables`)
// 			cy.get(`[id="id-question-divers.produits-consommables.consommation"]`)
// 		}
// 	)
//
// 	it(`should arrive to the simulation ending page when the last question is answered`,
// 		() => {
// 			cy.visit(`/simulateur/transport/avion`)
// 			cy.get(`[id="id-question-transport.avion.usager"]`)
// 			walkthroughTest({})
// 			cy.get(`[data-cypress-id="simulation-ending"`)
// 		}
// 	)
// })
