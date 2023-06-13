const {
	commonLoaders,
	styleLoader,
	HTMLPlugins,
	default: common,
} = require('./webpack.common.js')
const webpack = require('webpack')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// Server-side prerendering is not activated here. If you want to work on this, go see this fork's parent, github.com/betagouv/mon-entreprise

module.exports = {
	...common,
	module: {
		rules: [
			...commonLoaders('production'),
			styleLoader(MiniCssExtractPlugin.loader),
		],
	},
	mode: 'production',
	devtool: 'source-map',
	output: {
		...common.output,
	},
	optimization: {
		minimizer: ['...', new CssMinimizerPlugin()],
	},
	plugins: [
		...(common.plugins || []),
		...HTMLPlugins({
			injectTrackingScript: true,
		}),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: '[name].[contenthash].css',
			chunkFilename: '[id].[contenthash].css',
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
			'process.env.SERVER_URL': JSON.stringify(process.env.SERVER_URL),
			'process.env.CONTEXT': JSON.stringify(process.env.CONTEXT),
			'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN),
			'process.env.ENCRYPTION_KEY': JSON.stringify(process.env.ENCRYPTION_KEY),
		}),
	],
}
