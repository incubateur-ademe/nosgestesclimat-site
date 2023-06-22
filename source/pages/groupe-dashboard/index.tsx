import GoBackLink from '@/components/groupe/GoBackLink'
import Title from '@/components/groupe/Title'
import { GROUP_URL } from '@/constants/urls'
import { AppState } from '@/reducers/rootReducer'
import { Group } from '@/types/groups'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ButtonLink from '../groupe-amis/components/ButtonLink'

export default function Groupe() {
	const [group, setGroup] = useState<Group | null>(null)
	const [memberNotInGroup, setMemberNotInGroup] = useState(false)

	const { groupId } = useParams()

	const userId = useSelector((state: AppState) => state.userId)

	const { t } = useTranslation()

	const navigate = useNavigate()

	const dispatch = useDispatch()

	useEffect(() => {
		const handleFetchGroup = async () => {
			try {
				const response = await fetch(`${GROUP_URL}/${groupId}`)

				if (!response.ok) {
					throw new Error('Error while fetching group')
				}

				const group: Group = await response.json()

				// Don't allow users to access groups they are not part of
				if (!group.members.find((member) => member.userId === userId)) {
					setMemberNotInGroup(true)
				}
				setGroup(group)
			} catch (error) {
				console.error(error)
			}
		}
		if (groupId && !group) {
			handleFetchGroup()
		}
	}, [groupId, group, userId])

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
			<div className="mt-4 flex justify-between">
				<h2 className="font-bold text-md text-black">
					<Trans>Le classement</Trans>
				</h2>

				<ButtonLink color="secondary" size="sm" href={'/creer-groupe/'}>
					+ Inviter
				</ButtonLink>
			</div>
		</div>
	)
}
