import { AppState } from '@/reducers/rootReducer'
import { Group } from '@/types/groups'
import { formatValue } from 'publicodes'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { getTopThreeAndRestMembers } from '../utils/getTopThreeAndRestMembers'
import ClassementMember from './ClassementMember'

export default function Classement({ group }: { group: Group }) {
	const [isExpanded, setIsExpanded] = useState(false)

	const userId = useSelector((state: AppState) => state.user.userId)

	const language = useTranslation().i18n.language

	if (!group) {
		return null
	}

	const { topThreeMembers, restOfMembers } =
		getTopThreeAndRestMembers(group.members) || {}

	const withS = group.members.length - 5 > 1 ? 's' : ''

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
						<span className="leading-[160%] m-none">
							<strong>
								{formatValue(parseFloat(member?.results?.total), {
									language,
								})}
							</strong>{' '}
							<span className="font-light text-sm">
								<Trans>tonnes</Trans>
							</span>
						</span>
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
							isCurrentMember={member.userId === userId}
						/>
					)
				})}
			</ul>
			{restOfMembers.length > 0 && (
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
									<span className="leading-[160%]">
										<strong>
											{formatValue(parseFloat(member?.results?.total), {
												language,
											})}
										</strong>{' '}
										<span className="font-light text-sm">
											<Trans>tonnes</Trans>
										</span>
									</span>
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
			)}

			{group.members.length > 5 && !isExpanded && (
				<button
					onClick={() => setIsExpanded(true)}
					className="bg-transparent border-none text-primary underline text-center mt-4 text-sm w-full"
				>
					<Trans>
						Voir les {String(group.members.length - 5)} autre{withS} participant
						{withS}
					</Trans>
				</button>
			)}
		</>
	)
}
