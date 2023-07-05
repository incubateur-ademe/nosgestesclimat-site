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
	emoji: string
	members: Member[]
	owner: {
		_id: string
		name: string
		email?: string
	}
}

export type ResultsObject = {
	total: string
	'transport . empreinte': {
		value: string
		variation: string
	}
	transports: {
		value: string
		variation: string
	}
	alimentation: {
		value: string
		variation: string
	}
	logement: {
		value: string
		variation: string
	}
	divers: {
		value: string
		variation: string
	}
	'services sociétaux': {
		value: string
		variation: string
	}
}
