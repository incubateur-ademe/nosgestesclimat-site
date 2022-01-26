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
		rules: [...commonLoaders('development'), styleLoader('style-loader')],
	},
	devServer: {
		historyApiFallback: true,
		static: path.join(__dirname, 'dist'),
		hot: true,
	},
	mode: 'development',
	plugins: [
		...(common.plugins || []),
		...HTMLPlugins({ injectTrackingScript: true }),
		new webpack.DefinePlugin({
			NODE_ENV: JSON.stringify('development'),
			PARSE_SERVER_URL: JSON.stringify(process.env.PARSE_SERVER_URL),
			PARSE_APPLICATION_ID: JSON.stringify(process.env.PARSE_APPLICATION_ID),
			PARSE_JAVASCRIPT_KEY: JSON.stringify(process.env.PARSE_JAVASCRIPT_KEY),
		}),
		new webpack.HotModuleReplacementPlugin(),
		new ReactRefreshWebpackPlugin(),
	],
}
