import { Simulation } from './simulation'

export type Member = {
	_id: string
	name: string
	email: string
	simulation: Simulation
}

export type Group = {
	_id: string
	name: string
	members: Member[]
	owner: {
		_id: string
		name: string
		email: string
	}
}
