const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const path = require('path')
require('dotenv').config()

const {
	commonLoaders,
	styleLoader,
	HTMLPlugins,
	default: common,
} = require('./webpack.common')

module.exports = {
	...common,
	module: {
		rules: [
			...commonLoaders('development'),
			styleLoader('style-loader'),
			{
				test: /\.(png|jpe?g|gif|md)$/i,
				use: [
					{
						loader: 'file-loader',
					},
				],
			},
		],
	},
	devServer: {
		historyApiFallback: true,
		static: path.join(__dirname, 'dist'),
		hot: true,
		host: '0.0.0.0',
		allowedHosts: ['localhost', '.gitpod.io'],
	},
	mode: 'development',
	plugins: [
		...(common.plugins || []),
		...HTMLPlugins({ injectTrackingScript: true }),
		new webpack.DefinePlugin({
			NODE_ENV: JSON.stringify('development'),
			SERVER_URL: JSON.stringify(process.env.SERVER_URL),
		}),
		new ReactRefreshWebpackPlugin(),
		/*
			 * See eslintrc.required.js for why this is commented
		new ESLintPlugin({
			overrideConfigFile: path.resolve(__dirname, '.eslintrc.required.js'),
		}),
		*/
	],
}
