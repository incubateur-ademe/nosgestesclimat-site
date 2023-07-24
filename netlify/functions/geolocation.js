exports.handler = async function (event) {
	return {
		statusCode: 200,
		body: JSON.stringify({ code: event.headers['x-country'] || 'fr' }),
	}
}
