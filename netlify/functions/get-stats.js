import fetch from 'node-fetch'

const idSite = 153

let { MATOMO_TOKEN } = process.env

exports.handler = async (event, context) => {
	const simulationsResponse = await fetch(
		`https://stats.data.gouv.fr/?module=API&method=Events.getAction&idSite=${idSite}&period=range&date=last6000&format=JSON&token_auth=${MATOMO_TOKEN}`
	)
	const simulations = await simulationsResponse.json()
	return { statusCode: 200, body: JSON.stringify({ simulations }) }
}
