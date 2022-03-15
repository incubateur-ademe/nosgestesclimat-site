import { Action } from 'Actions/actions'
import { defaultTo, omit } from 'ramda'
import reduceReducers from 'reduce-reducers'
import { combineReducers, Reducer } from 'redux'
import { SavedSimulation } from 'Selectors/storageSelectors'
import { DottedName } from '../rules/index'
import { objectifsSelector } from '../selectors/simulationSelectors'
import storageRootReducer from './storageReducer'

function explainedVariable(
	state: DottedName | null = null,
	action: Action
): DottedName | null {
	switch (action.type) {
		case 'EXPLAIN_VARIABLE':
			return action.variableName
		case 'STEP_ACTION':
			return null
		default:
			return state
	}
}

function situationBranch(state: number | null = null, action: Action) {
	switch (action.type) {
		case 'SET_SITUATION_BRANCH':
			return action.id
		default:
			return state
	}
}

type QuestionsKind =
	| "à l'affiche"
	| 'non prioritaires'
	| 'liste'
	| 'liste noire'

export type SimulationConfig = {
	objectifs:
		| Array<DottedName>
		| Array<{ icône: string; nom: string; objectifs: Array<DottedName> }>
	'objectifs cachés': Array<DottedName>
	situation: Simulation['situation']
	bloquant?: Array<DottedName>
	questions?: Partial<Record<QuestionsKind, Array<DottedName>>>
	branches?: Array<{ nom: string; situation: SimulationConfig['situation'] }>
	'unité par défaut': string
}

type Situation = Partial<Record<DottedName, any>>
export type Simulation = {
	config: SimulationConfig
	url: string
	hiddenNotifications: Array<string>
	situation: Situation
	initialSituation: Situation
	targetUnit: string
	foldedSteps: Array<DottedName>
	unfoldedStep?: DottedName | null
}

function simulation(
	state: Simulation | null = null,
	action: Action
): Simulation | null {
	if (action.type === 'SET_SIMULATION') {
		const { config, url } = action
		if (state && state.config && !action.situation === config) {
			return state
		}
		return {
			config,
			url,
			hiddenNotifications: state?.hiddenControls || [],
			situation: action.situation || state?.situation || {},
			targetUnit: config['unité par défaut'] || '€/mois',
			foldedSteps: action.foldedSteps || state?.foldedSteps || [],
			unfoldedStep: null,
			persona: action.persona,
		}
	}
	if (state === null) {
		return state
	}

	switch (action.type) {
		case 'HIDE_NOTIFICATION':
			return {
				...state,
				hiddenNotifications: [...state.hiddenNotifications, action.id],
			}
		case 'RESET_SIMULATION':
			return {
				...state,
				hiddenNotifications: [],
				situation: state.initialSituation,
				foldedSteps: [],
				unfoldedStep: null,
				persona: null,
			}
		case 'UPDATE_SITUATION': {
			const targets = objectifsSelector({ simulation: state } as RootState)
			const situation = state.situation
			const { fieldName: dottedName, value } = action
			return {
				...state,
				situation:
					value === undefined
						? omit([dottedName], situation)
						: {
								...(targets.includes(dottedName)
									? omit(targets, situation)
									: situation),
								[dottedName]: value,
						  },
			}
		}
		case 'STEP_ACTION': {
			const { name, step } = action
			if (name === 'fold')
				return {
					...state,
					foldedSteps: state.foldedSteps.includes(step)
						? state.foldedSteps
						: [...state.foldedSteps, step],

					unfoldedStep: null,
				}
			if (name === 'unfold') {
				const previousUnfolded = state.unfoldedStep
				return {
					...state,
					foldedSteps: state.foldedSteps,
					unfoldedStep: step,
				}
			}
			return state
		}
		case 'UPDATE_TARGET_UNIT':
			return {
				...state,
				targetUnit: action.targetUnit,
			}
	}
	return state
}
function rules(state = null, { type, rules }) {
	if (type === 'SET_RULES') {
		return rules
	} else return state
}

function actionChoices(state = {}, { type, action, choice }) {
	if (type === 'SET_ACTION_CHOICE') {
		return { ...state, [action]: choice }
	}
	if (type === 'RESET_ACTION_CHOICES') {
		return {}
	} else return state
}
function survey(state = null, { type, room, answers }) {
	if (type === 'UNSET_SURVEY') return {}
	if (type === 'SET_SURVEY') {
		if (state?.room === room) return state
		return {
			room,
			answers: {},
		}
	}
	if (type === 'ADD_SURVEY_ANSWERS') {
		return {
			room,
			answers: answers.reduce(
				(memo, next) => ({ ...memo, [next.id]: next }),
				state.answers
			),
		}
	} else return state
}

function conference(state = null, { type, room, ydoc, provider }) {
	if (type === 'UNSET_CONFERENCE') return null
	if (type === 'SET_CONFERENCE') {
		if (state?.room === room) return state
		return {
			room,
			ydoc,
			provider,
		}
	} else return state
}
function tutorials(state = {}, { type, id, unskip }) {
	if (type === 'SKIP_TUTORIAL') {
		return { ...state, [id]: unskip ? undefined : 'skip' }
	} else if (type === 'RESET_TUTORIALS') {
		return {}
	} else return state
}
function tracking(state = {}, { type, name, value }) {
	if (type === 'SET_TRACKING_VARIABLE') {
		return { ...state, [name]: value }
	} else return state
}

function storedTrajets(state = {}, { type, vehicule, trajets }) {
	if (type === 'SET_TRAJETS') {
		return { ...state, [vehicule]: trajets }
	} else if (type === 'RESET_TRAJETS') {
		return {}
	} else return state
}

function thenRedirectTo(state = null, { type, to }) {
	if (type === 'SET_THEN_REDIRECT_TO') {
		return to
	} else return state
}

const mainReducer = (state: any, action: Action) =>
	combineReducers({
		explainedVariable,
		// We need to access the `rules` in the simulation reducer
		simulation: (a: Simulation | null = null, b: Action): Simulation | null =>
			simulation(a, b),
		previousSimulation: defaultTo(null) as Reducer<SavedSimulation | null>,
		situationBranch,
		rules,
		actionChoices,
		conference,
		survey,
		iframeOptions: defaultTo(null),
		tutorials,
		storedTrajets,
		thenRedirectTo,
		tracking,
	})(state, action)

export default reduceReducers<RootState>(
	mainReducer as any,
	storageRootReducer as any
) as Reducer<RootState>

export type RootState = ReturnType<typeof mainReducer>
