import Crypto from 'crypto-js'

exports.handler = async (event) => {
	const data = JSON.parse(event.body)

	const decryptedData = Crypto.AES.decrypt(
		data,
		process.env.ENCRYPTION_KEY
	).toString()

	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: decryptedData,
	}
}
