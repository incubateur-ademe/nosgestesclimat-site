exports.handler = function (event) {
	console.log(event.headers)
	return Promise.resolve({
		statusCode: 200,
		body: event.headers['x-nf-geo'],
	})
}
