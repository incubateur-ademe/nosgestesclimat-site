const { defineConfig } = require('cypress')

module.exports = defineConfig({
	projectId: 'dbxhpr',
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
	},
})
