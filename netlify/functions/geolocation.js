exports.handler = function (event) {
	return Promise.resolve({
		statusCode: 200,
		body: event.headers['x-nf-geo'],
	})
}
