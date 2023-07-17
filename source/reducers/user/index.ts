export const userReducer = (
	state = { userId: '', name: '', email: '' },
	{
		type,
		userId,
		name,
		email,
	}: { type: string; userId: string; name: string; email: string }
) => {
	switch (type) {
		case 'SET_USER_ID':
			return { ...state, userId }

		case 'SET_USER_NAME_AND_EMAIL':
			return { ...state, name, email }

		default:
			return state
	}
}
