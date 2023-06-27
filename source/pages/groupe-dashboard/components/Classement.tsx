import { Group, Member } from '@/types/groups'
import { useState } from 'react'
import { Trans } from 'react-i18next'

const ClassementMember = ({ rank, name, quantity, isTopThree }) => {
	return (
		<li className="flex justify-between items-center">
			<div>
				<span className={`mr-2 ${isTopThree ? 'text-2xl' : 'text-lg ml-1'}`}>
					{rank}
				</span>
				{name}
			</div>
			<div>{quantity}</div>
		</li>
	)
}

export default function Classement({ group }: { group: Group }) {
	const [isExpanded, setIsExpanded] = useState(false)

	if (!group) {
		return null
	}

	const sortedMembers = group.members.sort((memberA, memberB) => {
		if (!memberA?.results?.total || !memberB?.results?.total) {
			return -1
		}
		if (
			parseFloat(memberA?.results?.total) < parseFloat(memberB?.results?.total)
		) {
			return 1
		}
		if (
			parseFloat(memberA?.results?.total) > parseFloat(memberB?.results?.total)
		) {
			return -1
		}
		return 0
	})

	const { topThreeMembers, restOfMembers } = sortedMembers.reduce(
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

	return (
		<>
			<ul className="rounded-md bg-primary text-white mt-2 py-4 px-3">
				{topThreeMembers.map((member, index) => {
					let rank
					switch (index) {
						case 0:
							rank = '🥇'
							break
						case 1:
							rank = '🥈'
							break
						case 2:
							rank = '🥉'
							break
						default:
					}

					const quantity = member?.results?.total ? (
						<p className="leading-[160%] m-none">
							<strong>{member?.results?.total}</strong>{' '}
							<span className="font-light text-sm">
								<Trans>tonnes</Trans>
							</span>
						</p>
					) : (
						'...'
					)

					return (
						<ClassementMember
							key={member._id}
							name={member.name}
							rank={rank}
							quantity={quantity}
							isTopThree
						/>
					)
				})}
			</ul>
			<ul className="py-4 px-4">
				{restOfMembers.length > 0 &&
					restOfMembers
						.filter(
							(member, index) =>
								isExpanded || index + topThreeMembers?.length < 5
						)
						.map((member, index) => {
							const rank = `${index + 1 + topThreeMembers?.length}.`

							const quantity = member?.results?.total ? (
								<p className="leading-[160%]">
									<strong>{member?.results?.total}</strong>{' '}
									<span className="font-light text-sm">
										<Trans>tonnes</Trans>
									</span>
								</p>
							) : (
								'...'
							)

							return (
								<ClassementMember
									key={member._id}
									name={member.name}
									rank={rank}
									quantity={quantity}
								/>
							)
						})}
			</ul>
			{group.members.length > 5 && (
				<button className="bg-transparent border-none text-primary underline text-center mt-4 text-sm w-full">
					<Trans>
						Voir les {String(group.members.length)} autres participants
					</Trans>
				</button>
			)}
		</>
	)
}
