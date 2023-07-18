import {
	clickCategoryStartButton,
	clickDontKnowButton,
	clickNextButton,
	clickUnderstoodButton,
	startTestAndSkipTutorial,
} from '../utils'

function getAll3FirstLogementQuestions() {
	cy.get('[id="id-question-logement.saisie-habitants"]')
	clickDontKnowButton()
	cy.get('[id="id-question-logement.appartement"]')
	clickDontKnowButton()
	cy.get('[id="id-question-logement.surface"]')
}

function getAll3firstAlimentationQuestions() {
	cy.get('[id="id-question-alimentation.boisson.chaude.café.nombre"]')
	clickDontKnowButton()
	cy.get('[id="id-question-alimentation.boisson.eau-en-bouteille.affirmatif"]')
	clickDontKnowButton()
	cy.get('[id="id-question-alimentation.boisson.sucrées.litres"]')
}

describe('validate the question order behavior', () => {
	beforeEach(() => {
		cy.visit(
			`/?loc=${Cypress.env('localisation_param')}&lang=${Cypress.env(
				'language_param'
			)}`
		)
		startTestAndSkipTutorial()
	})

	it('should follow the question order when specified the catégorie search param', () => {
		cy.visit('/simulateur/bilan?catégorie=logement')
		clickUnderstoodButton()
		clickCategoryStartButton()
		getAll3FirstLogementQuestions()
	})

	it('should follow the question order when clicked on a specific category', () => {
		cy.get('[data-cypress-id="sub-category-bar-logement"]').click()
		cy.get('[data-cypress-id="category-title-logement"]')
		clickCategoryStartButton()
		getAll3FirstLogementQuestions()
	})

	it('should follow the question order when clicked on a specific category two times', () => {
		cy.get('[data-cypress-id="sub-category-bar-logement"]').click()
		cy.get('[data-cypress-id="category-title-logement"]')
		clickCategoryStartButton()
		getAll3FirstLogementQuestions()

		cy.get('[data-cypress-id="sub-category-bar-alimentation"]').click()
		cy.get('[data-cypress-id="category-title-alimentation"]')
		clickCategoryStartButton()
		getAll3firstAlimentationQuestions()
	})

	it('should follow the question order (transports, alimentation, logement, divers, services publiques)', () => {
		// Prevents https://github.com/datagir/nosgestesclimat-site/pull/1049 from happening again
		// Questions where skipped when the value passed was too low
		cy.url().should('include', 'question=transport')
		cy.get('button.suggestion').first().click()
		clickNextButton()
		cy.url().should('include', 'question=transport')
		clickDontKnowButton()
		cy.url().should('include', 'question=transport')
	})
})
