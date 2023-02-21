import fetch from 'node-fetch'

const idSite = 153

let { MATOMO_TOKEN } = process.env

exports.handler = async (event, context) => {
	const requestParams = decodeURIComponent(
		event.queryStringParameters.requestParams
	)

	const response = await fetch(
		'https://stats.data.gouv.fr/?' +
			requestParams +
			'&token_auth=' +
			MATOMO_TOKEN
	)
	const data = await response.json()

	return { statusCode: 200, body: JSON.stringify(data) }
}
