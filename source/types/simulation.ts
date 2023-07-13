import { DottedName } from '@/components/publicodesUtils'

export type Situation = Record<DottedName, any>

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
