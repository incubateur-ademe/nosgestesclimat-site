import GoBackLink from '@/components/groupe/GoBackLink'
import Title from '@/components/groupe/Title'
import { GROUP_URL } from '@/constants/urls'
import { AppState } from '@/reducers/rootReducer'
import { Group } from '@/types/groups'
import * as Sentry from '@sentry/react'
import { useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ButtonLink from '../creer-groupe/components/ButtonLink'
import Classement from './components/Classement'
import VotreEmpreinte from './components/VotreEmpreinte'
import { useGetGroupStats } from './hooks/useGetGroupStats'

export default function Groupe() {
	const [group, setGroup] = useState<Group | null>(null)
	const [memberNotInGroup, setMemberNotInGroup] = useState(false)

	const { groupId } = useParams()

	const userId = useSelector((state: AppState) => state.userId)

	const { t } = useTranslation()

	const intervalRef = useRef<NodeJS.Timer>()

	const results =
		useGetGroupStats({
			groupMembers: group?.members,
			userId,
		}) || {}
	console.log({ results })

	useEffect(() => {
		const handleFetchGroup = async () => {
			try {
				const response = await fetch(`${GROUP_URL}/${groupId}`)

				if (!response.ok) {
					throw new Error('Error while fetching group')
				}

				const groupFetched: Group = await response.json()

				// Don't allow users to access groups they are not part of
				if (!groupFetched.members.find((member) => member.userId === userId)) {
					setMemberNotInGroup(true)
				}
				setGroup(groupFetched)
			} catch (error) {
				Sentry.captureException(error)
			}
		}

		if (groupId && !group) {
			handleFetchGroup()

			intervalRef.current = setInterval(() => handleFetchGroup(), 60000)
		}
	}, [groupId, group, userId])

	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, [])

	if (!group) {
		return null
	}

	if (memberNotInGroup) {
		return (
			<div className="p-4">
				<Title
					title={
						<Trans>Vous n'avez pas été invité à rejoindre ce groupe</Trans>
					}
					subtitle={t(
						"Veuillez confirmer avec le créateur du groupe qu'il vous a bien envoyé un lien d'invitation."
					)}
				/>
				<ButtonLink href={'/mes-groupes'} className="mt-4">
					<Trans>Retourner à mes groupes</Trans>
				</ButtonLink>
			</div>
		)
	}

	return (
		<div className="p-4">
			<GoBackLink className="mb-4 font-bold" />
			<Title title={group?.name} />
			<div className="mt-4 flex justify-between items-center">
				<h2 className="font-bold text-md m-0">
					<Trans>Le classement</Trans>
				</h2>

				<ButtonLink color="secondary" size="sm" href={'inviter'}>
					+ Inviter
				</ButtonLink>
			</div>
			<Classement group={group} />

			<VotreEmpreinte
				results={
					group?.members?.find((member) => member.userId === userId)?.results
				}
			/>
		</div>
	)
}
