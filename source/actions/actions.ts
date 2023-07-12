import { Localisation } from '@/components/localisation/utils'
import { DottedName } from '@/components/publicodesUtils'
import { AppState, TutorialStateStatus } from '@/reducers/rootReducer'
import { Group } from '@/types/groups'
import { Rating } from '@/types/rating'
import { Simulation, SimulationConfig, StoredTrajets } from '@/types/simulation'
import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'

/**
 * The type of the actions that can be dispatched in the app.
 *
 * NOTE(@EmileRolley): The workflow to add a new action is the following:
 * 1. Create a new type for the action in this file
 *		(e.g. `type MyAction = { type: 'MY_ACTION' }`)
 * 2. Add the new type to the union type `Action`
 *		(e.g. `Action = MyAction | ...`)
 * 3. Create a new function to dispatch the action in `actions.ts`
 *		(e.g. `export const myAction = (): Action => ({ type: 'MY_ACTION' })`)
 */
export type Action =
	| AddSimulationToListAction
	| DeletePreviousSimulationAction
	| DeleteSimulationByIdAction
	| ExplainVariableAction
	| HasSubscribedToNewsletterAction
	| HideNotificationAction
	| LoadPreviousSimulationAction
	| ResetSimulationAction
	| ResetActionChoicesAction
	| ResetIntroTutorialAction
	| ResetCategoryTutorialsAction
	| ResetStoredTrajetsAction
	| SetActiveTargetAction
	| SetCurrentSimulationAction
	| SetRatingAction
	| SetActionChoiceAction
	| SetActionsChoicesAction
	| SetSimulationAction
	| SetSituationBranchAction
	| SetTrackingVariableAction
	| SetAllStoredTrajetsAction
	| StepAction
	| SkipTutorialAction
	| UpdateEventsSentAction
	| UpdateSituationAction
	| UpdateTargetUnitAction
	| SetStoredTrajets
	| SetLocalisationAction
	| SetRatingAction
	| ResetLocalisationAction
	| UpdateAmortissementAvionAction

export type ThunkResult<R = void> = ThunkAction<R, AppState, {}, Action>

type StepAction = {
	type: 'STEP_ACTION'
	name: 'fold' | 'unfold'
	step: DottedName
}

type SetSimulationAction = {
	type: 'SET_SIMULATION'
} & Simulation

type SetCurrentSimulationAction = {
	type: 'SET_CURRENT_SIMULATION'
	simulation: Simulation
}

type AddSimulationToListAction = {
	type: 'ADD_SIMULATION_TO_LIST'
	simulation: Simulation
}

export type SetRatingAction = {
	type: 'SET_RATING_LEARNED' | 'SET_RATING_ACTION'
	value: Rating
}

type DeletePreviousSimulationAction = {
	type: 'DELETE_PREVIOUS_SIMULATION'
}

type DeleteSimulationByIdAction = {
	type: 'DELETE_SIMULATION'
	id: string
}

type UpdateSituationAction = {
	type: 'UPDATE_SITUATION'
	fieldName: DottedName
	value: unknown
}

type LoadPreviousSimulationAction = {
	type: 'LOAD_PREVIOUS_SIMULATION'
}

type HideNotificationAction = {
	type: 'HIDE_NOTIFICATION'
	id: string
}

type SetSituationBranchAction = {
	type: 'SET_SITUATION_BRANCH'
	id: number
}

type SetActiveTargetAction = {
	type: 'SET_ACTIVE_TARGET_INPUT'
	name: DottedName
}

type ExplainVariableAction = {
	type: 'EXPLAIN_VARIABLE'
	variableName: DottedName | null
}

type UpdateTargetUnitAction = {
	type: 'UPDATE_TARGET_UNIT'
	targetUnit: string
}

type UpdateEventsSentAction = {
	type: 'UPDATE_EVENTS_SENT'
	eventSent: { [key: string]: boolean }
}

type HasSubscribedToNewsletterAction = {
	type: 'SET_HAS_SUBSCRIBED_TO_NEWSLETTER'
}

type ResetSimulationAction = {
	type: 'RESET_SIMULATION'
}

type ResetCategoryTutorialsAction = {
	type: 'RESET_CATEGORY_TUTORIALS'
}

type ResetIntroTutorialAction = {
	type: 'RESET_INTRO_TUTORIAL'
}

type ResetActionChoicesAction = {
	type: 'RESET_ACTION_CHOICES'
}

type ResetStoredTrajetsAction = {
	type: 'RESET_TRAJETS'
}

type SkipTutorialAction = {
	type: 'SKIP_TUTORIAL'
	id: string
	unskip: boolean
	fromRule?: TutorialStateStatus
}

type SetTrackingVariableAction = {
	type: 'SET_TRACKING_VARIABLE'
	name: string
	value: boolean
}

type SetActionChoiceAction = {
	type: 'SET_ACTION_CHOICE'
	action: string
	choice: boolean
}

type SetActionsChoicesAction = {
	type: 'SET_ACTIONS_CHOICES'
	actionsChoices?: Record<string, boolean>
}

type SetAllStoredTrajetsAction = {
	type: 'SET_ALL_TRAJETS'
	allTrajets: StoredTrajets
}

type SetStoredTrajets = {
	type: 'SET_TRAJETS'
	vehicule: string
	// TODO(@EmileRolley): type this
	trajets: object
}

type SetLocalisationAction = {
	type: 'SET_LOCALISATION'
} & Localisation

type ResetLocalisationAction = {
	type: 'RESET_LOCALISATION'
}

type UpdateAmortissementAvionAction = {
	type: 'SET_AMORTISSEMENT'
	// TODO(@EmileRolley): type this
	amortissementAvionObject: Object
}

export const resetSimulation = (): Action => ({
	type: 'RESET_SIMULATION',
})

export const resetActionChoices = (): Action => ({
	type: 'RESET_ACTION_CHOICES',
})

export const resetIntroTutorial = (): Action => ({
	type: 'RESET_INTRO_TUTORIAL',
})

export const resetCategoryTutorials = (): Action => ({
	type: 'RESET_CATEGORY_TUTORIALS',
})

export const resetStoredTrajets = (): Action => ({
	type: 'RESET_TRAJETS',
})

export const resetStoredAmortissementAvion = () => ({
	type: 'RESET_AMORTISSEMENT',
})

export const goToQuestion = (question: DottedName): Action => ({
	type: 'STEP_ACTION',
	name: 'unfold',
	step: question,
})

export const validateWithDefaultValue =
	(dottedName: DottedName): ThunkResult<void> =>
	(dispatch) => {
		dispatch(updateSituation(dottedName, undefined))
		dispatch({
			type: 'STEP_ACTION',
			name: 'fold',
			step: dottedName,
		})
	}

export const setSituationBranch = (id: number): Action => ({
	type: 'SET_SITUATION_BRANCH',
	id,
})

const setSimulation = (
	simulation: Partial<Simulation> | Simulation
): AnyAction => ({
	type: 'SET_SIMULATION',
	...simulation,
})

export const setDifferentSituation =
	({
		situation,
		config,
		url,
		persona,
		foldedSteps,
	}: Simulation): ThunkResult<void> =>
	(dispatch, getState) => {
		dispatch(setSimulation({ situation, config, url, persona, foldedSteps }))
		dispatch(addSimulationToList(getState().simulation))
		dispatch(setCurrentSimulation(getState().simulation))
	}

export const addSimulationToList = (simulation: Simulation): Action => ({
	type: 'ADD_SIMULATION_TO_LIST',
	simulation,
})

export const setCurrentSimulation = (simulation: Simulation): Action => ({
	type: 'SET_CURRENT_SIMULATION',
	simulation,
})

export const setSimulationConfig =
	(config: SimulationConfig, url?: string): ThunkResult =>
	(dispatch, getState): void => {
		const pastSimulationConfig = getState().simulation?.config
		if (pastSimulationConfig === config) {
			return
		}
		dispatch(setSimulation({ config, url: url ?? '' }))
		dispatch(addSimulationToList(getState().simulation))
		dispatch(setCurrentSimulation(getState().simulation))
	}

export const setActiveTarget = (targetName: DottedName): Action => ({
	type: 'SET_ACTIVE_TARGET_INPUT',
	name: targetName,
})

export const deleteSimulationById = (id: string): Action => ({
	type: 'DELETE_SIMULATION',
	id,
})

export const updateSituation = (
	fieldName: DottedName,
	value: unknown
): Action => ({
	type: 'UPDATE_SITUATION',
	fieldName,
	value,
})

export const skipTutorial = (
	id: string,
	unskip: boolean = false,
	fromRule?: TutorialStateStatus
): Action => ({
	type: 'SKIP_TUTORIAL',
	id,
	unskip,
	fromRule,
})

export const setTrackingVariable = (name: string, value: boolean): Action => ({
	type: 'SET_TRACKING_VARIABLE',
	name,
	value,
})

export const updateUnit = (targetUnit: string): Action => ({
	type: 'UPDATE_TARGET_UNIT',
	targetUnit,
})

export const loadPreviousSimulation = (): Action => ({
	type: 'LOAD_PREVIOUS_SIMULATION',
})

export const hideNotification = (id: string): Action => ({
	type: 'HIDE_NOTIFICATION',
	id,
})

export const explainVariable = (
	variableName: DottedName | null = null
): Action => ({
	type: 'EXPLAIN_VARIABLE',
	variableName,
})

export const setActionChoice = (action: string, choice: boolean): Action => ({
	type: 'SET_ACTION_CHOICE',
	action,
	choice,
})

export const setActionsChoices = (
	actionsChoices?: Record<string, boolean>
): Action => ({
	type: 'SET_ACTIONS_CHOICES',
	actionsChoices,
})

export const setAllStoredTrajets = (allTrajets: StoredTrajets) => ({
	type: 'SET_ALL_TRAJETS',
	allTrajets,
})

export const setStoredTrajets = (
	vehicule: string,
	trajets: object
): Action => ({
	type: 'SET_TRAJETS',
	vehicule,
	trajets,
})

export const setLocalisation = (localisationData: Localisation): Action => ({
	type: 'SET_LOCALISATION',
	...localisationData,
})

export const setRatings = (
	type: SetRatingAction['type'],
	value: Rating
): Action => ({
	type,
	value,
})

export const resetLocalisation = (): Action => ({
	type: 'RESET_LOCALISATION',
})

export const updateAmortissementAvion = (
	amortissementAvionObject: Object
): Action => ({
	type: 'SET_AMORTISSEMENT',
	amortissementAvionObject,
})

export const updateEventsSent = (eventSent: {
	[key: string]: boolean
}): Action => ({
	type: 'UPDATE_EVENTS_SENT',
	eventSent,
})

export const setHasSubscribedToNewsletter = (): Action => ({
	type: 'SET_HAS_SUBSCRIBED_TO_NEWSLETTER',
})

export const addGroupToUser = (group: Group) => ({
	type: 'ADD_GROUP',
	group,
})

export const removeGroupFromUser = (group: Group) => ({
	type: 'REMOVE_GROUP',
	group,
})

export const updateGroup = (group: Group) => ({
	type: 'UPDATE_GROUP',
	group,
})

export const setCreatedGroup = (group: Group) => ({
	type: 'SET_CREATED_GROUP',
	group,
})

export const setUserId = (userId: string) => ({
	type: 'SET_USER_ID',
	userId,
})

export const setGroupToRedirectTo = (group: Group) => ({
	type: 'SET_GROUP_TO_REDIRECT_TO',
	group,
})

export const setUserNameAndEmail = (name: string, email: string) => ({
	type: 'SET_USER_NAME_AND_EMAIL',
	name,
	email,
})
