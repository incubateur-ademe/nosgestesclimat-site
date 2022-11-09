let { GITHUB_TOKEN } = process.env

exports.handler = async (event, context) => {
	let baseUrl = 'https://api.github.com/repos/',
		{ repo, title, body, labels } = event.queryStringParameters,
		url = baseUrl + repo + '/issues',
		headers = {
			Authorization: `token ${GITHUB_TOKEN}`,
			Accept: 'application/vnd.github.symmetra-preview+json',
		},
		options = {
			method: 'POST',
			headers: headers,
			mode: 'cors',
			cache: 'default',
			body: JSON.stringify({
				title,
				body,
				labels: (labels && labels.split(',')) || ['Contribution'],
			}),
		}

	return fetch(url, options)
		.then((response) => {
			return response.json()
		})
		.then((json) => ({
			statusCode: 200,
			headers: {
				'Content-Type': 'application/json;charset=utf-8',

				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({ url: json['html_url'] }),
		}))
		.catch((error) => ({ statusCode: 422, body: String(error) }))
}
