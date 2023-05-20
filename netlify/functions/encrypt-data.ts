import CryptoJS from 'crypto-js'

exports.handler = async (event) => {
	const data = JSON.parse(event.body)

	const encryptedData = CryptoJS.AES.encrypt(
		data,
		process.env.ENCRYPTION_KEY
	).toString(CryptoJS.enc.Utf8)

	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: encryptedData,
	}
}
