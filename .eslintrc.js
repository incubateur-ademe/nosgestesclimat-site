module.exports = {
	parser: '@babel/eslint-parser',
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
	},

	env: {
		browser: true,
		node: true,
		es6: true,
	},

	plugins: ['react', 'react-hooks', 'jsx-a11y'],

	rules: {
		quotes: [
			1,
			'single',
			{
				avoidEscape: true,
			},
		],
		'import/default': 'off',
		'no-console': 'off',
		'no-empty-pattern': 'off',
		'no-restricted-globals': [2, 'length'],
		'no-global-assign': 'off',
		'no-unsafe-negation': 'off',
		'no-constant-condition': 'warn',
		'import/namespce': 'off',
		'react/prop-types': 'off',
		'react/jsx-no-target-blank': 'off',
		'react/no-unescaped-entities': 'off',
		'react/display-name': 'off',
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'react/jsx-uses-react': 'off',
		'react/jsx-key': 'warn',
		'react/react-in-jsx-scope': 'off',
		'react/no-children-prop': 'warn',
		'react/no-unknown-property': ['error', { ignore: ['css'] }],
	},

	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		// 'plugin:jsx-a11y/strict',
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
			files: ['*.ts', '*.tsx'],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: ['./tsconfig.json'],
			},
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
				'@typescript-eslint/ban-ts-comment': 'warn',
				'@typescript-eslint/no-unsafe-enum-comparison': 'warn',
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
				'@typescript-eslint/prefer-string-starts-ends-with': 'warn',
				'@typescript-eslint/no-unnecessary-type-assertion': 'warn', // has false positives (Object.values result) v 2.29.0
				'@typescript-eslint/no-inferrable-types': 'warn', // causes problems with unknown values v 2.29.0 typescript v 3.8.3
				'@typescript-eslint/no-unused-vars': 'warn',
				'@typescript-eslint/explicit-function-return-type': 'off',
				'@typescript-eslint/no-unsafe-return': 'off',
				'@typescript-eslint/no-var-requires': 'off',
				'@typescript-eslint/explicit-module-boundary-types': 'off',
				'@typescript-eslint/no-floating-promises': 'off',
				'@typescript-eslint/no-extra-semi': 'off',
				'@typescript-eslint/no-unsafe-assignment': 'off',
				'@typescript-eslint/no-unsafe-argument': 'off',
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
		},
	],
}
