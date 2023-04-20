const { defineConfig } = require('cypress')

module.exports = defineConfig({
	projectId: 'dbxhpr',
	env: {
		// This is the URL of the local server that will be used for testing
		base_url: 'http://localhost:8080',
		personas_fr_url: 'https://data.nosgestesclimat.fr/personas-fr.json',
	},
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
	},
})
