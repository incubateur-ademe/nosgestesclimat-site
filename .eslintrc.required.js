//const baseEslintConfig = require('./.eslintrc')

// I can't make this file work. The aim is to check only for accessibility errors
// but for whatever reason, Eslint checks other errors as well

module.exports = {
	plugins: ['jsx-a11y'],
	extends: ['plugin:jsx-a11y/strict'],
	rules: {},
	overrides: [],
}
