import { Group } from '@/types/groups'

export const groupsReducer = (
	state = [],
	{ type, group }: { type: string; group: Group }
) => {
	switch (type) {
		case 'ADD_GROUP':
			return [...state, group]
		case 'REMOVE_GROUP':
			return state.filter((g: Group) => g._id !== group._id)
		case 'UPDATE_GROUP':
			return state.map((g: Group) => (g._id === group._id ? group : g))
		default:
			return state
	}
}

export const createdGroupReducer = (
	state = null,
	{ type, group }: { type: string; group: Group }
) => {
	switch (type) {
		case 'SET_CREATED_GROUP':
			return group
		default:
			return state
	}
}

export const groupToRedirectToReducer = (
	state = null,
	{ type, group }: { type: string; group: Group }
) => {
	switch (type) {
		case 'SET_GROUP_TO_REDIRECT_TO':
			return group
		default:
			return state
	}
}
