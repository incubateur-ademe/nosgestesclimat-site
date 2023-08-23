import { Member } from '@/types/groups'

export const getTopThreeAndRestMembers = (members: Member[] = []) => {
const sortedMembers = members.sort((memberA, memberB) => {
	const totalA = memberA?.results?.total
	const totalB = memberB?.results?.total

	return totalA !== undefined && totalA !== undefined
		? parseFloat(totalA) - parseFloat(totalB)
		: -1
})


	return sortedMembers.reduce(
		(acc, member, index) => {
			if (index < 3 && member?.results?.total !== undefined) {
				acc.topThreeMembers.push(member)
			} else {
				acc.restOfMembers.push(member)
			}
			return acc
		},
		{ topThreeMembers: [], restOfMembers: [] } as {
			topThreeMembers: Member[]
			restOfMembers: Member[]
		}
	)
}
