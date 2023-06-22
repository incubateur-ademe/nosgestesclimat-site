import { Simulation } from './simulation'

export type Member = {
	_id: string
	name: string
	email?: string
	simulation: Simulation
	userId: string
	results: {
		total: number
		transports: number
		alimentation: number
		logement: number
		divers: number
		services_societaux: number
	}
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
