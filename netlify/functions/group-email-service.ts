import SibApiV3Sdk from 'sib-api-v3-sdk'

const TEMPLATE_ID_GROUP_CREATED = 57
const TEMPLATE_ID_GROUP_JOINED = 58

exports.handler = async (event: { body: string }) => {
	const data = JSON.parse(event.body)

	const { email, shareURL, groupURL, deleteURL, groupName, name, isCreation } =
		data

	const defaultClient = SibApiV3Sdk.ApiClient.instance

	// Configure API key authorization: api-key
	const apiKey = defaultClient.authentications['api-key']
	apiKey.apiKey = process.env.BREVO_API_KEY

	// Add contact to list
	const contactApiInstance = new SibApiV3Sdk.ContactsApi()

	const createContact = new SibApiV3Sdk.CreateContact()

	createContact.email = email
	createContact.name = name
	createContact.attributes = {
		OPT_IN: true,
	}

	try {
		await contactApiInstance.createContact(createContact)
	} catch (e) {
		// Do nothing, contact already exists
	}

	const transacApiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

	const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail() // SendSmtpEmail | Values to send a transactional email
	sendSmtpEmail.sender = {
		name: 'Nos Gestes Climat',
		email: 'contact@nosgestesclimat.fr',
	}
	sendSmtpEmail.replyTo = {
		name: 'Nos Gestes Climat',
		email: 'contact@nosgestesclimat.fr',
	}
	sendSmtpEmail.to = [
		{
			name: email,
			email,
		},
	]
	sendSmtpEmail.templateId = isCreation
		? TEMPLATE_ID_GROUP_CREATED
		: TEMPLATE_ID_GROUP_JOINED
	sendSmtpEmail.params = {
		SHARE_URL: shareURL,
		GROUP_URL: groupURL,
		DELETE_URL: deleteURL,
		GROUP_NAME: groupName,
		NAME: name,
	}

	try {
		await transacApiInstance.sendTransacEmail(sendSmtpEmail)
	} catch (e) {
		return {
			statusCode: 404,
		}
	}

	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'application/json;charset=utf-8',

			'Access-Control-Allow-Origin': '*',
		},
	}
}
