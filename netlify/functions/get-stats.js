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

	// Remove secret pages that would reveal groupe names that should stay private
	if (requestParams.includes('Page')) {
		return success(
			json.filter(
				(el) =>
					!isPrivate(el.label) &&
					!(el.subtable && el.subtable.find((t) => isPrivate(t.url)))
			)
		)
	}

	return success(json)
}

const success = (data) => ({
	statusCode: 200,
	body: JSON.stringify(data),
	headers: {
		'Content-Type': 'application/json; charset=utf-8',
		'Access-Control-Allow-Origin': '*',
	},
})

const isPrivate = (rawString) => {
	const string = decodeURIComponent(rawString)
	return (
		string != undefined &&
		(string.includes('conférence/') ||
			string.includes('conference/') ||
			string.includes('sondage/'))
	)
}
