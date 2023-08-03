import { GROUP_URL } from '@/constants/urls'
import { Group, SimulationResults } from '@/types/groups'
import { Simulation } from '@/types/simulation'

type Props = {
	group: Group
	name: string
	email?: string
	userId: string
	simulation?: Simulation
	results?: SimulationResults
}

export const fetchAddUserToGroup = async ({
	group,
	name,
	email,
	userId,
	simulation,
	results,
}: Props) => {
	const response = await fetch(`${GROUP_URL}/add-member`, {
		method: 'POST',
		body: JSON.stringify({
			_id: group._id,
			member: {
				name,
				email: email || '',
				userId,
				simulation,
				results,
			},
		}),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	})

	if (!response.ok) {
		throw new Error('Error while updating group')
	}
}
