import { Action } from '@/actions/actions'
import { Localisation, SupportedRegions } from '@/components/localisation/utils'
import { DottedName, NGCRules } from '@/components/publicodesUtils'
import storageRootReducer from '@/reducers/storageReducer'
import { objectifsSelector } from '@/selectors/simulationSelectors'
import {
	Enquête,
	SavedSimulation,
	SavedSimulationList,
} from '@/selectors/storageSelectors'
import { generateSimulationId } from '@/storage/persistSimulation'
import { omit } from '@/utils'
import reduceReducers from 'reduce-reducers'
import { CombinedState, combineReducers, Reducer } from 'redux'

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

export type ObjectifsConfig =
	| Array<DottedName>
	| Array<{ icône: string; nom: string; objectifs: Array<DottedName> }>

export type SimulationConfig = {
	objectifs: ObjectifsConfig
	'objectifs cachés': Array<DottedName>
	situation: Simulation['situation']
	bloquant?: Array<DottedName>
	questions?: Partial<Record<QuestionsKind, Array<DottedName>>>
	branches?: Array<{ nom: string; situation: SimulationConfig['situation'] }>
	'unité par défaut': string
}

export function objectifsConfigToDottedNameArray(
	obj: ObjectifsConfig
): Array<DottedName> {
	if (obj.length === 0) {
		return []
	} else if (typeof obj[0] === 'object') {
		return obj.flatMap((v: any) => v.objectifs)
	}
	// FIXME(@EmileRolley): more explicit type should be used here?
	return obj
}

export type Situation = Record<DottedName, any>
export type StoredTrajets = Record<DottedName, any>

export type Simulation = {
	config: SimulationConfig
	url: string
	hiddenNotifications: Array<string>
	situation: Situation
	hiddenControls?: Array<string>
	targetUnit?: string
	foldedSteps?: Array<DottedName>
	unfoldedStep?: DottedName | null
	persona?: string
	date?: Date
	id?: string
	eventsSent?: Record<string, boolean>
	actionChoices?: Record<string, boolean>
	storedTrajets?: StoredTrajets
}

function simulation(
	state: Simulation | null = null,
	action: Action
): Simulation {
	if (state === null) {
		return { ...(state ?? {}), eventsSent: {} }
	}

	switch (action.type) {
		case 'SET_CURRENT_SIMULATION': {
			// Update the date when loading the simulation.
			// Also triggers an update of the 'simulationsList' component when changing simulations.
			action.simulation.date = new Date()
			return action.simulation
		}
		case 'SET_SIMULATION': {
			const { config, url } = action
			// FIXME(@EmileRolley): I don't understand what is going on here
			if (state && state.config && !action.situation === config) {
				return state
			}

			return {
				config,
				url: url ?? state?.url ?? '',
				hiddenNotifications: state?.hiddenControls ?? [], // todo : hiddenControls ?
				situation: action.situation ?? state?.situation ?? {},
				targetUnit: config['unité par défaut'] ?? '€/mois',
				foldedSteps: action.foldedSteps ?? state?.foldedSteps ?? [],
				unfoldedStep: null,
				persona: action.persona,
				id: action.persona ?? state?.id ?? generateSimulationId(), // Unique identifier of the simulation, used for the 'currentSimulationId' pointer.
				date: !action.persona && state?.date ? state?.date : new Date(),
				eventsSent: state?.eventsSent ?? {},
			}
		}
		case 'HIDE_NOTIFICATION': {
			return {
				...state,
				hiddenNotifications: [...state.hiddenNotifications, action.id],
			}
		}
		case 'RESET_SIMULATION': {
			return {
				...state,
				hiddenNotifications: [],
				situation: {},
				foldedSteps: [],
				unfoldedStep: null,
				persona: undefined,
				eventsSent: {},
			}
		}
		case 'UPDATE_SITUATION': {
			const targets = objectifsSelector({ simulation: state } as AppState)
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
			if (name === 'fold') {
				return {
					...state,
					foldedSteps: state.foldedSteps?.includes(step)
						? state.foldedSteps
						: [...state.foldedSteps, step],
					unfoldedStep: null,
				}
			} else if (name === 'unfold') {
				return {
					...state,
					unfoldedStep: step,
				}
			}
			return state
		}
		case 'UPDATE_TARGET_UNIT': {
			return {
				...state,
				targetUnit: action.targetUnit,
			}
		}
		case 'UPDATE_EVENTS_SENT': {
			return {
				...state,
				eventsSent: {
					...state.eventsSent,
					...action.eventSent,
				},
			}
		}
	}
	return state
}

function rules(state = null, { type, rules }) {
	if (type === 'SET_RULES') {
		return rules
	} else return state
}

function actionChoices(state = {}, { type, action, choice, actionsChoices }) {
	switch (type) {
		case 'SET_ACTIONS_CHOICES':
			return actionsChoices
		case 'SET_ACTION_CHOICE': {
			return { ...state, [action]: choice }
		}
		case 'RESET_ACTION_CHOICES': {
			return {}
		}
		default:
			return state
	}
}

function currentLang(state = {}, { type, currentLang }) {
	return type === 'SET_LANGUAGE' ? currentLang : state
}

function supportedRegions(state = {}, { type, supportedRegions }) {
	return type === 'SET_SUPPORTED_REGIONS' ? supportedRegions : state
}

function survey(
	state = null,
	{ type, room, answers, contextFile, contextRules }
) {
	if (type === 'UNSET_SURVEY') return {}
	if (type === 'SET_SURVEY') {
		if (state?.room === room) return state
		return {
			room,
			answers: {},
			contextFile: state?.contextFile,
			contextRules: state?.contextRules,
		}
	}
	if (type === 'ADD_SURVEY_CONTEXT') {
		return {
			room: state?.room,
			answers: state?.answers,
			contextFile,
			contextRules: state?.contextRules,
		}
	}
	if (type === 'ADD_CONTEXT_RULES') {
		return {
			room: state?.room,
			answers: state?.answers,
			contextFile: state?.contextFile,
			contextRules,
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
			contextRules: state?.contextRules,
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

export type TutorialStateStatus = 'skip' | 'done' | undefined
export type TutorialState = {
	[id: string]: TutorialStateStatus
	/** fromRule is used to know if the tutorial was triggered by a specific rule
	 (appart from 'bilan') and if so, to know if it was skipped or not.*/
	fromRule?: TutorialStateStatus
}

// Tutorials are the main tutorial for the /simulateur/bilan simulation,
// but also the small category pages displayed before starting the category,
// as a pause for the user
function tutorials(state: TutorialState = {}, { type, id, unskip, fromRule }) {
	if (type === 'SKIP_TUTORIAL') {
		return {
			...state,
			[id]: unskip ? undefined : 'skip',
			fromRule: !fromRule ? state.fromRule : fromRule,
		}
	} else if (type === 'RESET_INTRO_TUTORIAL') {
		return Object.fromEntries(
			Object.entries(state)
				.map(([k, v]) => (k.includes('testIntro') ? undefined : [k, v]))
				.filter(Boolean)
		)
	} else if (type === 'RESET_CATEGORY_TUTORIALS') {
		return Object.fromEntries(
			Object.entries(state)
				.map(([k, v]) => (k.includes('testCategory') ? undefined : [k, v]))
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

function storedTrajets(state = {}, { type, vehicule, trajets, allTrajets }) {
	switch (type) {
		case 'SET_ALL_TRAJETS':
			return allTrajets
		case 'SET_TRAJETS':
			return { ...state, [vehicule]: trajets }
		case 'RESET_TRAJETS':
			return {}
		default:
			return state
	}
}

function storedAmortissementAvion(
	state = {},
	{ type, amortissementAvionObject }
) {
	if (type === 'SET_AMORTISSEMENT') {
		return {
			...(state || {}),
			[amortissementAvionObject.dottedName]:
				amortissementAvionObject.amortissementObject,
		}
	} else if (type === 'RESET_AMORTISSEMENT') {
		return {}
	} else return state
}

function hasSubscribedToNewsletter(state = false, { type }) {
	if (type === 'SET_HAS_SUBSCRIBED_TO_NEWSLETTER') return true
	else return state
}

// optimized=true will load optimized version of the rules, treated by publiopti
// parsed=false will avoid the rules being parsed, which is a heavy operation
export type RulesOptions = { optimized: boolean; parsed: boolean }

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

type LocalisationAction = { type: string } & Localisation

function localisation(
	state = null,
	{ type, country, userChosen }: LocalisationAction
): Localisation | null {
	if (type === 'SET_LOCALISATION') {
		return { country, userChosen }
	} else if (type === 'RESET_LOCALISATION') {
		return null
	} else {
		return state
	}
}
function sessionLocalisationBannersRead(state = [], { type, regions }) {
	if (type === 'SET_LOCALISATION_BANNERS_READ') {
		return regions
	}
	return state
}

function pullRequestNumber(state = null, { type, number }) {
	if (type === 'SET_PULL_REQUEST_NUMBER') {
		return number
	}
	return state
}

function enquête(state: Enquête | null = null, { type, userID, date }) {
	if (type === 'SET_ENQUÊTE') {
		return { userID, date }
	}
	if (type === 'QUIT_ENQUÊTE') {
		return null
	}
	return state
}
// This reducer updates the list of simulations that will be stored in local storage
// Ideally, it will replace the 'simulation' reducer
function simulations(
	state: SavedSimulationList = [],
	action: Action
): SavedSimulationList {
	switch (action.type) {
		case 'DELETE_SIMULATION':
			return state.filter((simulation) => simulation.id !== action.id)
		case 'ADD_SIMULATION_TO_LIST':
			if (!state.find((simulation) => simulation.id === action.simulation.id)) {
				return [...state, action.simulation]
			}
			return state
		default:
			return state
	}
}

// for northstar ratings Pick<Person, "address.postalCode">
function ratings(
	state: SavedSimulation['ratings'] = {
		learned: 'no_display',
		action: 'no_display',
	},
	{ type, value }
) {
	switch (type) {
		case 'SET_RATING_LEARNED':
			return { ...state, learned: value }
		case 'SET_RATING_ACTION':
			return { ...state, action: value }
		default:
			return state
	}
}

// Pointer to the current simulation in the 'simulations' list
function currentSimulationId(
	state: string | null = null,
	action: Action
): string | null {
	switch (action.type) {
		case 'SET_CURRENT_SIMULATION':
			return action.simulation.id
		default:
			return state
	}
}

export type AppState = CombinedState<{
	explainedVariable: any
	simulation: Simulation
	previousSimulation: any
	simulations: SavedSimulationList
	currentSimulationId: string | null
	situationBranch: any
	rules: NGCRules
	actionChoices: any
	conference: never
	survey: never
	iframeOptions: any
	tutorials: TutorialState
	storedTrajets: StoredTrajets
	storedAmortissementAvion: any
	thenRedirectTo: any
	tracking: {
		endEventFired: boolean
		firstQuestionEventFired: boolean
		progress50EventFired: boolean
		progress90EventFired: boolean
	}
	localisation: Localisation | null
	sessionLocalisationBannersRead: any
	pullRequestNumber: any
	engineState: EngineState
	currentLang: any
	supportedRegions: SupportedRegions
	ratings: SavedSimulation['ratings']
	hasSubscribedToNewsletter: boolean
	enquête: Enquête
}>

const mainReducer = (state: any, action: Action) =>
	combineReducers({
		explainedVariable,
		// We need to access the `rules` in the simulation reducer
		simulation: (a: Simulation | null = null, b: Action): Simulation | null =>
			simulation(a, b),
		previousSimulation: defaultToNull, // TODO : delete
		simulations,
		currentSimulationId,
		situationBranch,
		rules,
		actionChoices,
		conference,
		survey,
		iframeOptions: defaultToNull,
		tutorials,
		storedTrajets,
		storedAmortissementAvion,
		tracking,
		localisation,
		sessionLocalisationBannersRead,
		pullRequestNumber,
		engineState,
		currentLang,
		supportedRegions,
		enquête,
		ratings,
		hasSubscribedToNewsletter,
	})(state, action)

export default reduceReducers<AppState>(
	mainReducer as any,
	storageRootReducer as any
) as Reducer<AppState>
