import fetch from 'node-fetch'

let { MATOMO_TOKEN } = process.env

const authorizedMethods = [
	'VisitsSummary.getVisits',
	'VisitsSummary.getVisits',
	'VisitorInterest.getNumberOfVisitsPerVisitDuration',
	'VisitFrequency.get',
	'Actions.getPageUrl',
	'Referrers.getWebsites',
	'Referrers.getSocials',
	'Referrers.getKeywords',
	'Actions.getEntryPageUrls',
	'Actions.getPageUrls',
	'Events.getAction',
]

// This function authorizes requests made from our front-end to fetch stats properties
// Our full stats data are now private, since they could expose sensitive informations
exports.handler = async (event, context) => {
	const requestParams = decodeURIComponent(
		event.queryStringParameters.requestParams
	)

	const matomoMethod = new URLSearchParams(requestParams).get('method'),
		authorizedMethod = authorizedMethods.includes(matomoMethod)

	const authorizedSiteId = idSite === '153'

	if (!authorizedMethod || !authorizedSiteId)
		return {
			statusCode: 401,
		}

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
	},
})

const privateURLs = [ 'conférence/', 'conference/', 'sondage/' ]

const isPrivate = (rawString) => {
	const uriComponents = decodeURIComponent(rawString)
	
	return privateURLs.string?.
		uriComponents != undefined &&
		privateURLs.some((url) => uriComponents.includes(url))
	)
}
