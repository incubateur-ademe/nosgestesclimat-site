import { GROUP_URL } from '@/constants/urls'
import { Group } from '@/types/groups'

export const fetchGroup = async (groupId: string) => {
	const response = await fetch(`${GROUP_URL}/${groupId}`)

	if (!response.ok) {
		throw new Error('Error while fetching group')
	}

	const group: Group = await response.json()

	return group
}
