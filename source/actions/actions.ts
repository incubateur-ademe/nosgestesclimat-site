import { RootState, SimulationConfig } from 'Reducers/rootReducer'
import { ThunkAction } from 'redux-thunk'
import { DottedName } from 'Rules'
import { Localisation } from '../components/localisation/utils'
import { Simulation } from '../reducers/rootReducer'

export type Action =
	| ResetSimulationAction
	| StepAction
	| UpdateAction
	| SetSimulationConfigAction
	| DeletePreviousSimulationAction
	| DeleteSimulationByIdAction
	| ExplainVariableAction
	| UpdateSituationAction
	| HideNotificationAction
	| LoadPreviousSimulationAction
	| SetSituationBranchAction
	| UpdateTargetUnitAction
	| SetActiveTargetAction
	| AddSimulationToListAction
	| SetCurrentSimulationAction

export type ThunkResult<R = void> = ThunkAction<R, RootState, {}, Action>

type StepAction = {
	type: 'STEP_ACTION'
	name: 'fold' | 'unfold'
	step: DottedName
}

type SetSimulationConfigAction = {
	type: 'SET_SIMULATION'
	url: string
	config: SimulationConfig
}

type SetCurrentSimulationAction = {
	type: 'SET_CURRENT_SIMULATION'
	simulation: Simulation
}

type AddSimulationToListAction = {
	type: 'ADD_SIMULATION_TO_LIST'
	simulation
}

type DeletePreviousSimulationAction = {
	type: 'DELETE_PREVIOUS_SIMULATION'
}

type DeleteSimulationByIdAction = {
	type: 'DELETE_SIMULATION'
}

type ResetSimulationAction = ReturnType<typeof resetSimulation>
type UpdateAction = ReturnType<typeof updateSituation>
type UpdateSituationAction = ReturnType<typeof updateSituation>
type LoadPreviousSimulationAction = ReturnType<typeof loadPreviousSimulation>
type SetSituationBranchAction = ReturnType<typeof setSituationBranch>
type SetActiveTargetAction = ReturnType<typeof setActiveTarget>
type HideNotificationAction = ReturnType<typeof hideNotification>
type ExplainVariableAction = ReturnType<typeof explainVariable>
type UpdateTargetUnitAction = ReturnType<typeof updateUnit>

export const resetSimulation = () =>
	({
		type: 'RESET_SIMULATION',
	} as const)
export const resetActionChoices = () =>
	({
		type: 'RESET_ACTION_CHOICES',
	} as const)
export const resetIntroTutorial = () =>
	({
		type: 'RESET_INTRO_TUTORIAL',
	} as const)
export const resetCategoryTutorials = () =>
	({
		type: 'RESET_CATEGORY_TUTORIALS',
	} as const)
export const resetStoredTrajets = () =>
	({
		type: 'RESET_TRAJETS',
	} as const)

export const resetStoredAmortissementAvion = () => ({
	type: 'RESET_AMORTISSEMENT',
})

export const goToQuestion = (question: DottedName) =>
	({
		type: 'STEP_ACTION',
		name: 'unfold',
		step: question,
	} as const)

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

export const setSituationBranch = (id: number) =>
	({
		type: 'SET_SITUATION_BRANCH',
		id,
	} as const)

export const setDifferentSituation =
	({
		situation,
		config,
		url,
		persona,
		foldedSteps,
	}: Simulation): ThunkResult<void> =>
	(dispatch, getState) => {
		dispatch({
			type: 'SET_SIMULATION',
			situation,
			config,
			url,
			persona,
			foldedSteps,
		})
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
	(config: Object, url): ThunkResult<void> =>
	(dispatch, getState, {}): void => {
		const pastSimulationConfig = getState().simulation?.config
		if (pastSimulationConfig === config) {
			return
		}
		dispatch({
			type: 'SET_SIMULATION',
			url,
			config,
		})
		dispatch(addSimulationToList(getState().simulation))
		dispatch(setCurrentSimulation(getState().simulation))
	}

export const setActiveTarget = (targetName: DottedName) =>
	({
		type: 'SET_ACTIVE_TARGET_INPUT',
		name: targetName,
	} as const)

export const deleteSimulationById = (id: string) =>
	({
		type: 'DELETE_SIMULATION',
		id,
	} as const)

export const updateSituation = (fieldName: DottedName, value: unknown) =>
	({
		type: 'UPDATE_SITUATION',
		fieldName,
		value,
	} as const)

export const skipTutorial = (id: string, unskip: boolean) => ({
	type: 'SKIP_TUTORIAL',
	id,
	unskip,
})

export const setTrackingVariable = (name: string, value: boolean) => ({
	type: 'SET_TRACKING_VARIABLE',
	name,
	value,
})

export const updateUnit = (targetUnit: string) =>
	({
		type: 'UPDATE_TARGET_UNIT',
		targetUnit,
	} as const)

export function loadPreviousSimulation() {
	return {
		type: 'LOAD_PREVIOUS_SIMULATION',
	} as const
}

export function hideNotification(id: string) {
	return { type: 'HIDE_NOTIFICATION', id } as const
}

export const explainVariable = (variableName: DottedName | null = null) =>
	({
		type: 'EXPLAIN_VARIABLE',
		variableName,
	} as const)

export const setActionChoice = (action: string, choice: boolean) =>
	({
		type: 'SET_ACTION_CHOICE',
		action,
		choice,
	} as const)

export const setActionsChoices = (actionsChoices: Object) =>
	({
		type: 'SET_ACTIONS_CHOICES',
		actionsChoices,
	} as const)

export const setAllStoredTrajets = (allTrajets: Object) =>
	({
		type: 'SET_ALL_TRAJETS',
		allTrajets,
	} as const)

export const setStoredTrajets = (vehicule: string, trajets: object) =>
	({
		type: 'SET_TRAJETS',
		vehicule,
		trajets,
	} as const)

export const setLocalisation = (localisationData: Localisation) =>
	({
		type: 'SET_LOCALISATION',
		...localisationData,
	} as const)

export const resetLocalisation = () =>
	({
		type: 'RESET_LOCALISATION',
	} as const)

export const updateAmortissementAvion = (amortissementAvionObject: Object) => ({
	type: 'SET_AMORTISSEMENT',
	amortissementAvionObject,
})
