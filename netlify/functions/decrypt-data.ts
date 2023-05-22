import CryptoJS from 'crypto-js'

// eslint-disable-next-line @typescript-eslint/require-await
exports.handler = async (event) => {
	const data = String(event.body)

	const decryptedData = CryptoJS.AES.decrypt(
		data,
		process.env.ENCRYPTION_KEY
	).toString(CryptoJS.enc.Utf8)

	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify(decryptedData),
	}
}
