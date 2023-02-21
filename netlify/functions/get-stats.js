import fetch from 'node-fetch'

const idSite = 153

let { MATOMO_TOKEN } = process.env

const queries = (chartDate, chartPeriod) => [
	[
		'chart',
		`https://stats.data.gouv.fr/?module=API&date=last${chartDate}&period=${chartPeriod}&format=json&idSite=${idSite}&method=VisitsSummary.getVisits&token_auth=${MATOMO_TOKEN}`,
		(res) => res.data,
	],
	[
		'simulations',
		`https://stats.data.gouv.fr/?module=API&method=Events.getAction&idSite=${idSite}&period=range&date=last6000&format=JSON&token_auth=${MATOMO_TOKEN}`,

		(res) =>
			res.data.find((action) => action.label === 'A terminé la simulation'),
	],
]
exports.handler = async (event, context) => {
	const { chartDate, chartPeriod } = event.queryStringParameters

	const promises = queries(chartDate, chartPeriod).map(
		([key, URL, transform]) =>
			fetch(URL)
				.then((res) => res.json())
				.then((json) => [key, transform(json)])
	)
	const data = await Promise.all(promises)

	return { statusCode: 200, body: JSON.stringify(data) }
}
