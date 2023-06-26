import { Simulation } from './simulation'

export type Member = {
	_id: string
	name: string
	email?: string
	simulation: Simulation
	userId: string
	results: ResultsObject
}

export type Group = {
	_id: string
	name: string
	members: Member[]
	owner: {
		_id: string
		name: string
		email?: string
	}
}

export type ResultsObject = {
	total: string
	transports: string
	alimentation: string
	logement: string
	divers: string
	'services sociétaux': string
}
