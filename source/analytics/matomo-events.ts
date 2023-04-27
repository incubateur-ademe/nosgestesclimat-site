import { DottedName } from 'Rules'

/*
 * Matomo events
 * https://matomo.org/docs/event-tracking/
 * [
 * 	'trackEvent', // Type de l'évènement
 * 	'Category' (string), // Catégorie de l'évènement à rattacher à son contexte (cf. exemples ci-dessous)
 * 	'Action' (string), // Action concrête mesurée (clic sur machin, submit de tel truc, etc.)
 * 	'Name' (string), // Nom de l'évènement (optionnel) si besoin de détailier l'action
 * 	'Value' (number) // Une valeur numérique (optionnelle)
 * ]
 */

// Mobile partage fin de score
export const getMatomoEventShareMobile = (score: number) => [
	'trackEvent',
	'Partage',
	'Partage page de fin',
	'Clic bouton "Partager mes résultats" sur mobile',
	score,
]

// Desktop partage fin de score
export const getMatomoEventShareDesktop = (score: number) => [
	'trackEvent',
	'Partage',
	'Partage page de fin',
	'Clic bouton "Partager mes résultats" sur desktop',
	score,
]

// Click bouton je ne sais pas
export const getMatomoEventClickNextQuestion = (currentQuestion: string) => [
	'trackEvent',
	'Formulaire',
	'Clic bouton "Suivant"',
	currentQuestion,
]

// Click bouton je ne sais pas
export const getMatomoEventClickDontKnow = (currentQuestion: string) => [
	'trackEvent',
	'Formulaire',
	'Clic bouton "Je ne sais pas"',
	currentQuestion,
]

// Click help button in form
export const getMatomoEventClickHelp = (dottedName: DottedName) => [
	'trackEvent',
	'Formulaire',
	'Clic bouton "Aide" (?)',
	dottedName,
]

// Use Kilometer help
export const matomoEventKilometerHelp = [
	'trackEvent',
	'Formulaire',
	'Utilisation aide à la saisie km voiture',
]

// Use amortissement avion
export const getMatomoEventAmortissement = (dottedName: DottedName) => [
	'trackEvent',
	'Formulaire',
	'Utilisation amortissement avion',
	dottedName,
]

// TODO : Change language

// Visites via iframe
export const getMatomoEventVisitViaIframe = (url: string) => [
	'trackEvent',
	'Iframe',
	'Visites via iframe',
	url,
]

// TODO : revoir la stratégie de tracking des actions

// Mode groupe
export const matomoEventModeGroupeFiltres = [
	'trackEvent',
	'Mode Groupe',
	'Ouverture filtres',
]
export const getMatomoEventModeGroupeRealtimeActivation = (
	isRealTime: boolean
) => [
	'trackEvent',
	'Mode groupe',
	isRealTime
		? 'Désactivation du mode temps réel'
		: 'Activation du mode temps réel',
]
export const getMatomoEventModeGroupeRoomCreation = (mode: string) => [
	'trackEvent',
	'Mode Groupe',
	'Création salle',
	mode,
]
export const matomoEventModeGroupeCTAStart = [
	'trackEvent',
	'Mode Groupe',
	'Clic CTA accueil',
]

// Parcours test
export const matomoEventParcoursTestStart = [
	'trackEvent',
	'Parcours test',
	'Clic CTA accueil',
	'Faire le test',
]
export const matomoEventParcoursTestReprendre = [
	'trackEvent',
	'Parcours test',
	'Clic CTA accueil',
	'Reprendre mon test',
]
export const getMatomoEventParcoursTestTutorial = (
	last: boolean,
	index: number
) => [
	'trackEvent',
	'Parcours test',
	'Tutoriel',
	last ? 'Passer' : `Étape ${index} passée`,
]
export const getMatomoEventParcoursTestCategoryStarted = (category: string) => [
	'trackEvent',
	'Parcours test',
	'Catégorie démarrée',
	category,
]
export const getMatomoEventParcoursTestOver = (bilan: number | undefined) => [
	'trackEvent',
	'Parcours test',
	'Test terminé',
	'Bilan carbone',
	bilan || '',
]
