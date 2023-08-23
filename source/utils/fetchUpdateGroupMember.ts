import { GROUP_URL } from '@/constants/urls'
import { SavedSimulation } from '@/selectors/storageSelectors'
import { Group, SimulationResults } from '@/types/groups'

type Props = {
	group: Group
	userId: string
	simulation: SavedSimulation
	results: SimulationResults
}

export const fetchUpdateGroupMember = async ({
	group,
	userId,
	simulation,
	results,
}: Props) => {
	const response = await fetch(`${GROUP_URL}/update-member`, {
		method: 'POST',
		body: JSON.stringify({
			_id: group._id,
			memberUpdates: {
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
