export const NETLIFY_FUNCTIONS_URL =
	process.env.NODE_ENV === 'development'
		? 'http://localhost:8888/.netlify/functions'
		: ''
