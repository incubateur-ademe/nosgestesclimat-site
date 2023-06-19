import { AppState } from '@/reducers/rootReducer'

export const getGroups = (state: AppState) => state.groups

export const getCreatedGroup = (state: AppState) => state.createdGroup
