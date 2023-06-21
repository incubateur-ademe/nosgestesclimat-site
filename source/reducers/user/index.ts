export const userIdReducer = (
	state = null,
	{ type, userId }: { type: string; userId: string }
) => {
	switch (type) {
		case 'SET_USER_ID':
			return userId
		default:
			return state
	}
}
