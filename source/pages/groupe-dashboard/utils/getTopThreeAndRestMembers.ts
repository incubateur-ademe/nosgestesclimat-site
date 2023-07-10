import { Member } from '@/types/groups'

export const getTopThreeAndRestMembers = (members: Member[] = []) => {
	const sortedMembers = members.sort((memberA, memberB) => {
		if (!memberA?.results?.total || !memberB?.results?.total) {
			return -1
		}
		if (
			parseFloat(memberA?.results?.total) < parseFloat(memberB?.results?.total)
		) {
			return -1
		}
		if (
			parseFloat(memberA?.results?.total) > parseFloat(memberB?.results?.total)
		) {
			return 1
		}
		return 0
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
