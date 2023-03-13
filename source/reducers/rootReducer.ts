import { Action } from 'Actions/actions'
import { omit } from 'Source/utils'

import reduceReducers from 'reduce-reducers'
import { combineReducers, Reducer } from 'redux'
import { generateSimulationName } from 'Source/storage/persistSimulation'
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
	targetUnit: string
	foldedSteps: Array<DottedName>
	unfoldedStep?: DottedName | null
	persona?: string
	date?: Date
	name?: string
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
			name: state?.name || generateSimulationName(new Date()),
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
				situation: {},
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

function currentLang(state = {}, { type, currentLang }) {
	return type === 'SET_LANGUAGE' ? currentLang : state
}

function supportedRegions(state = {}, { type, supportedRegions }) {
	return type === 'SET_SUPPORTED_REGIONS' ? supportedRegions : state
}

function survey(state = null, { type, room, answers, contextFile }) {
	if (type === 'UNSET_SURVEY') return {}
	if (type === 'SET_SURVEY') {
		if (state?.room === room) return state
		return {
			room,
			answers: {},
			contextFile: state?.contextFile,
		}
	}
	if (type === 'ADD_SURVEY_CONTEXT') {
		return {
			room: state?.room,
			answers: state?.answers,
			contextFile,
		}
	}
	if (type === 'ADD_SURVEY_ANSWERS') {
		return {
			room,
			answers: answers.reduce(
				(memo, next) => ({ ...memo, [next.id]: next }),
				state.answers
			),
			contextFile: state?.contextFile,
		}
	} else return state
}

function conference(state = null, { type, room, ydoc, provider }) {
	if (type === 'UNSET_CONFERENCE') return null
	if (type === 'SET_CONFERENCE') {
		return {
			room,
			ydoc,
			provider,
		}
	} else return state
}

//Tutorials are the main tutorial for the /simulateur/bilan simulation,
//but also the small category pages displayed before starting the category, as a pause for the user
function tutorials(state = {}, { type, id, unskip }) {
	if (type === 'SKIP_TUTORIAL') {
		return { ...state, [id]: unskip ? undefined : 'skip' }
	} else if (type === 'RESET_INTRO_TUTORIAL') {
		return Object.fromEntries(
			Object.entries(state)
				.map(([k, v]) => (k.includes('testIntro') ? null : [k, v]))
				.filter(Boolean)
		)
	} else if (type === 'RESET_CATEGORY_TUTORIALS') {
		return Object.fromEntries(
			Object.entries(state)
				.map(([k, v]) => (k.includes('testCategory') ? null : [k, v]))
				.filter(Boolean)
		)
	} else return state
}

function tracking(
	state = {
		endEventFired: false,
		firstQuestionEventFired: false,
		progress50EventFired: false,
		progress90EventFired: false,
	},
	{ type, name, value }
) {
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

// optimized=true will load optimized version of the rules, treated by publiopti
// parsed=false will avoid the rules being parsed, which is a heavy operation
export type RulesOptions = { optimized: Boolean; parsed: Boolean }

//TODO set to false by default in order to go to production. Forced until this error is fixed and tests are run
// https://github.com/EmileRolley/publiopti/issues/4
export const defaultRulesOptions = { optimized: true, parsed: true }

const defaultEngineState = { state: null, options: defaultRulesOptions }

type EngineState = { state: 'requested' | 'ready'; options: RulesOptions }

type EngineAction = {
	type: string
	to: EngineState
}
function engineState(state = defaultEngineState, { type, to }: EngineAction) {
	if (type === 'SET_ENGINE') {
		return to
	} else return state
}

const defaultToNull = (arg) => arg ?? null

type LocalisationAction = {
	type: string
	country: object
	userChosen: boolean
}

function localisation(
	state = null,
	{ type, localisationData }: LocalisationAction
) {
	if (type === 'SET_LOCALISATION') {
		return localisationData
	} else if (type === 'RESET_LOCALISATION') {
		return null
	} else return state
}
function sessionLocalisationBannersRead(state = [], { type, regions }) {
	if (type === 'SET_LOCALISATION_BANNERS_READ') {
		return regions
	} else return state
}

function pullRequestNumber(state = null, { type, number }) {
	if (type === 'SET_PULL_REQUEST_NUMBER') {
		return number
	} else return state
}

const mainReducer = (state: any, action: Action) =>
	combineReducers({
		explainedVariable,
		// We need to access the `rules` in the simulation reducer
		simulation: (a: Simulation | null = null, b: Action): Simulation | null =>
			simulation(a, b),
		previousSimulation: defaultToNull,
		situationBranch,
		rules,
		actionChoices,
		conference,
		survey,
		iframeOptions: defaultToNull,
		tutorials,
		storedTrajets,
		thenRedirectTo,
		tracking,
		localisation,
		sessionLocalisationBannersRead,
		pullRequestNumber,
		engineState,
		currentLang,
		supportedRegions,
	})(state, action)

export default reduceReducers<RootState>(
	mainReducer as any,
	storageRootReducer as any
) as Reducer<RootState>

export type RootState = ReturnType<typeof mainReducer>
