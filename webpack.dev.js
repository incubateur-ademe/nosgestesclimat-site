const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const path = require('path')

const {
	commonLoaders,
	styleLoader,
	HTMLPlugins,
	default: common,
} = require('./webpack.common')

module.exports = {
	...common,
	devtool: 'eval-source-map',
	module: {
		rules: [...commonLoaders('development'), styleLoader('style-loader')],
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
			'process.env.NODE_ENV': JSON.stringify('development'),
			'process.env.BRANCH': JSON.stringify(process.env.BRANCH),
			'process.env.SERVER_URL': JSON.stringify(process.env.SERVER_URL),
			'process.env.CONTEXT': JSON.stringify(process.env.CONTEXT),
			'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN),
			'process.env.ENCRYPTION_KEY': JSON.stringify(process.env.ENCRYPTION_KEY),
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
