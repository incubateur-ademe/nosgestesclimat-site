import SibApiV3Sdk from 'sib-api-v3-sdk'

const NGC_LIST_ID = 22

exports.handler = async (event) => {
	const data = JSON.parse(event.body)

	const { email, shareURL, simulationURL } = data

	const defaultClient = SibApiV3Sdk.ApiClient.instance

	// Configure API key authorization: api-key
	const apiKey = defaultClient.authentications['api-key']
	apiKey.apiKey = process.env.BREVO_API_KEY

	// Add contact to list
	const contactApiInstance = new SibApiV3Sdk.ContactsApi()

	const createContact = new SibApiV3Sdk.CreateContact()

	createContact.email = email
	createContact.attributes = {
		OPT_IN: true,
	}

	createContact.listIds = [NGC_LIST_ID]
	try {
		await contactApiInstance.createContact(createContact)
	} catch (e) {
		// Do nothing, contact already exists
	}

	const transacApiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

	const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail() // SendSmtpEmail | Values to send a transactional email
	sendSmtpEmail.to = [
		{
			name: email,
			email,
		},
	]
	sendSmtpEmail.templateId = 55
	sendSmtpEmail.params = {
		SHARE_URL: shareURL,
		SIMULATION_URL: simulationURL,
	}

	try {
		await transacApiInstance.sendTransacEmail(sendSmtpEmail)
	} catch (e) {
		console.log(e)
	}

	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'application/json;charset=utf-8',

			'Access-Control-Allow-Origin': '*',
		},
	}
}
