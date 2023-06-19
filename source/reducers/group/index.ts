import { Group } from '@/types/groups'

export const groupReducer = (
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
