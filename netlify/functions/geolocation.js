const countries = require('./countries.json')

exports.handler = async function (event) {
	const code = event.headers['x-country'] || 'FR'
	return {
		statusCode: 200,
		body: JSON.stringify({
			country: countries.find((country) => country.code === code),
		}),
	}
}
