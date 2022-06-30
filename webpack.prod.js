const {
	commonLoaders,
	styleLoader,
	HTMLPlugins,
	default: common,
} = require('./webpack.common.js')
const webpack = require('webpack')
const ESLintPlugin = require('eslint-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

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
			NODE_ENV: JSON.stringify('production'),
			SERVER_URL: JSON.stringify(process.env.SERVER_URL),
		}),
	],
}
