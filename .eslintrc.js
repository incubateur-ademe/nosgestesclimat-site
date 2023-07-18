module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		tsconfigRootDir: __dirname,
		project: ['./tsconfig.json'],
	},
	ignorePatterns: ['node_modules/', 'webpack.*.js', 'tailwind.config.js'],

	settings: {
		react: {
			version: 'detect',
		},
		'import/resolver': {
			typescript: {},
		},
	},

	plugins: ['react', 'react-hooks', 'jsx-a11y', '@typescript-eslint'],

	rules: {
		quotes: [
			1,
			'single',
			{
				avoidEscape: true,
			},
		],
		'no-console': 'warn',
		'no-restricted-globals': [2, 'length'],
		'no-global-assign': 'off',
		'no-unsafe-negation': 'off',
		'react/prop-types': 'off',
		'react/jsx-no-target-blank': 'off',
		'react/no-unescaped-entities': 'off',
		'react/display-name': 'off',
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'error',
		'react/jsx-uses-react': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/no-unknown-property': ['error', { ignore: ['css'] }],
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/member-delimiter-style': [
			2,
			{
				multiline: {
					delimiter: 'none',
				},
			},
		],
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/prefer-string-starts-ends-with': 'warn',
		'@typescript-eslint/no-unnecessary-type-assertion': 'warn', // has false positives (Object.values result) v 2.29.0
		'@typescript-eslint/no-inferrable-types': 'warn', // causes problems with unknown values v 2.29.0 typescript v 3.8.3
		'@typescript-eslint/no-var-requires': 'off',
		// TODO - enable these new recommended rules, a first step would be to switch from "off" to "warn"
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-floating-promises': 'off',
		'@typescript-eslint/no-extra-semi': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
		'@typescript-eslint/restrict-plus-operands': 'off',
		'@typescript-eslint/restrict-template-expressions': 'off',
		'@typescript-eslint/naming-convention': 'off',
		'@typescript-eslint/prefer-regexp-exec': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-misused-promises': 'off',
	},

	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:jsx-a11y/strict',
		'plugin:react-hooks/recommended',
		'plugin:import/errors',
		'plugin:import/typescript',
		'plugin:cypress/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier',
	],

	overrides: [
		{
			files: ['*.js'],
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
			},
			env: {
				browser: true,
				node: true,
			},
		},
	],
}
