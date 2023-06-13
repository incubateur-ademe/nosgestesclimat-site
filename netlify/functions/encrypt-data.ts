/* eslint-disable @typescript-eslint/require-await */
import CryptoJS from 'crypto-js'

/**
 * Encrypts data with AES
 * @param {string} data - Data to encrypt
 */
exports.handler = async (event) => {
	const data = JSON.parse(event.body as string)

	const encryptedData = CryptoJS.AES.encrypt(
		data,
		process.env.ENCRYPTION_KEY
	).toString()

	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify(encryptedData),
	}
}
