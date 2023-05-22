/* eslint-env node */
const HTMLPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
const { NormalModuleReplacementPlugin } = require('webpack')

module.exports.default = {
	watchOptions: {
		// not setting this option resulted in too many files being watched
		// TODO we may have a problem with the number of node dependencies here, some not useful now that publicodes is outside this project. Is there a tool to prune dependencies in package.json ?
		ignored: /node_modules/,
	},
	resolveLoader: {
		modules: ['node_modules', path.resolve('loaders/')],
	},
	resolve: {
		fallback: {
			path: 'path-browserify',
			buffer: 'buffer',
		},
		alias: {
			'@': path.resolve(__dirname, 'source/'),
			Source: path.resolve(__dirname, 'source/'),
			Actions: path.resolve(__dirname, 'source/actions/'),
			Components: path.resolve(__dirname, 'source/components/'),
			Pages: path.resolve(__dirname, 'source/sites/publicodes/pages/'),
			Enquête: path.resolve(__dirname, 'source/sites/publicodes/enquête/'),
			Selectors: path.resolve(__dirname, 'source/selectors/'),
			Reducers: path.resolve(__dirname, 'source/reducers/'),
			Types: path.resolve(__dirname, 'source/types/'),
			Images: path.resolve(__dirname, 'source/images/'),
		},
		extensions: ['.js', '.ts', '.tsx'],
	},
	entry: {
		publicodes: './source/sites/publicodes/entry.js',
		iframe: './source/sites/publicodes/iframe.js',
	},
	output: {
		path: path.resolve('./dist/'),
		globalObject: 'self',
		chunkFilename: '[name].chunk.js',
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				'./manifest.webmanifest',
				'./source/sites/publicodes/sitemap.txt',
				'./source/sites/publicodes/robots.txt',
				'./4dc3300c431ca82c00785768559ea871.html',
				{
					from: './source/images',
					to: 'images',
				},
			],
		}),
		new NormalModuleReplacementPlugin(
			/react-easy-emoji/,
			'Components/emoji.tsx'
		),
	],
}

module.exports.styleLoader = (styleLoader) => ({
	test: /\.css$/,
	use: [
		{ loader: styleLoader },
		{
			loader: 'css-loader',
			options: {
				importLoaders: 1,
			},
		},
		{
			loader: 'postcss-loader',
		},
	],
})

module.exports.commonLoaders = (mode = 'production') => {
	const babelLoader = {
		loader: 'babel-loader',
		options: {
			presets: [
				[
					'@babel/preset-env',
					{
						targets: {
							esmodules: true,
						},
						useBuiltIns: 'entry',
						corejs: '3',
					},
				],
			],
			plugins: [
				// ... other plugins
				mode === 'development' && require.resolve('react-refresh/babel'),
			].filter(Boolean),
		},
	}

	return [
		{
			test: /node_modules\/vfile\/core\.js/,
			use: [
				{
					loader: 'imports-loader',
					options: {
						type: 'commonjs',
						imports: ['single process/browser process'],
					},
				},
			],
		},
		{
			test: /\.(js|ts|tsx)$/,
			use: [babelLoader],
			exclude: /node_modules|dist/,
		},
		{
			test: /\.md/,
			type: 'asset/source',
		},
		{
			test: /\.(jpe?g|png|gif)$/i,
			type: 'asset/resource',
		},
		{
			test: /\.yaml$/,
			use: ['yaml-loader'],
		},
		{
			test: /\.csv$/,
			loader: 'csv-loader',
			options: {
				dynamicTyping: true,
				header: true,
				skipEmptyLines: true,
			},
		},
		{
			test: /\.(ttf|woff2?)$/,
			type: 'asset/resource',
		},
		{
			test: /\.svg$/,
			loader: '@svgr/webpack',
			options: {
				replaceAttrValues: { '#4143d6': 'var(--color)' },
			},
		},
	]
}

module.exports.HTMLPlugins = ({ injectTrackingScript = false } = {}) => [
	new HTMLPlugin({
		template: 'index.html',
		logo: 'https://nosgestesclimat.fr/images/dessin-nosgestesclimat.png',
		chunks: ['publicodes'],
		title: 'Nos Gestes Climat',
		description: 'Connaissez-vous votre empreinte sur le climat ?',
		filename: 'index.html',
		injectTrackingScript,
		base: '/',
	}),
]
