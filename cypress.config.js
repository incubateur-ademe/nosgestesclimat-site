import { defineConfig } from 'cypress'

console.log('CYPRESS_baseUrl', process.env.CYPRESS_baseUrl)
export default defineConfig({
	projectId: 'dbxhpr',
	env: {
		// This is the URL of the local server that will be used for testing
		personas_fr_url: 'https://data.nosgestesclimat.fr/personas-fr.json',
		localisation_param: 'FR',
		language_param: 'fr',
	},
	e2e: {
		baseUrl: process.env.CYPRESS_baseUrl ?? 'http://localhost:8080',
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
		experimentalRunAllSpecs: true,
	},
	retries: {
		runMode: 2,
		openMode: 0,
	},
	pageLoadTimeout: 300000,
	defaultCommandTimeout: 60000,
	failOnStatusCode: false,
})
