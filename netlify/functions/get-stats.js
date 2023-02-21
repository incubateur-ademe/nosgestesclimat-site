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
	const json = await response.json()

	//We have to filter the page URL data because of a security flaw that introduced secret data in some URLs
	if (requestParams.includes('Page')) {
		return success(
			json.filter(
				(el) =>
					!el.label.includes('conférence/') && !el.label.includes('sondage/')
			)
		)
	}

	return success(json)
}

const success = (data) => ({ statusCode: 200, body: JSON.stringify(data) })
