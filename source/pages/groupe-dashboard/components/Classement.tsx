import { Group } from '@/types/groups'
import { useState } from 'react'
import { Trans } from 'react-i18next'

const ClassementMember = ({ rank, name, quantity }) => {
	return (
		<li className="flex justify-between">
			<div>
				<span className="mr-2 text-2xl">{rank}</span>
				{name}
			</div>
			<div>{quantity}</div>
		</li>
	)
}

export default function Classement({ group }: { group: Group }) {
	const [isExpanded, setIsExpanded] = useState(false)
	console.log(group.members)

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

	const topThreeMembers = sortedMembers.slice(0, 3)

	const restOfMembers = sortedMembers.slice(3)

	return (
		<>
			<ul className="rounded-md bg-primary text-white mt-2 py-4 px-4">
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
					console.log(member?.results?.total)
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
						/>
					)
				})}
			</ul>
			<ul>
				{restOfMembers.length > 0 &&
					restOfMembers
						.filter((member, index) => isExpanded || index < 2)
						.map((member, index) => {
							const rank = `${index + 4}.`

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
