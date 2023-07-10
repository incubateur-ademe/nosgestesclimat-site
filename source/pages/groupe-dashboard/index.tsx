import GoBackLink from '@/components/groupe/GoBackLink'
import Title from '@/components/groupe/Title'
import { GROUP_URL } from '@/constants/urls'
import { AppState } from '@/reducers/rootReducer'
import { Group } from '@/types/groups'
import { captureException } from '@sentry/react'
import { useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

import { matomoEventUpdateGroupName } from '@/analytics/matomo-events'
import Button from '@/components/groupe/Button'
import InlineTextInput from '@/components/groupe/InlineTextInput'
import Separator from '@/components/groupe/Separator'
import Meta from '@/components/utils/Meta'
import { useMatomo } from '@/contexts/MatomoContext'
import Classement from './components/Classement'
import Footer from './components/Footer'
import InviteBlock from './components/InviteBlock'
import PointsFortsFaibles from './components/PointsFortsFaibles'
import VotreEmpreinte from './components/VotreEmpreinte'
import { Results, useGetGroupStats } from './hooks/useGetGroupStats'

export default function GroupeDashboard() {
	const [group, setGroup] = useState<Group | null>(null)
	const [isEditingTitle, setIsEditingTitle] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const [searchParams] = useSearchParams()

	const { trackEvent } = useMatomo()

	const { t } = useTranslation()

	const groupId = searchParams.get('groupId')

	const userId = useSelector((state: AppState) => state.userId)

	const intervalRef = useRef<NodeJS.Timer>()

	const results: Results | null = useGetGroupStats({
		groupMembers: group?.members,
		userId,
	})

	useEffect(() => {
		const handleFetchGroup = async () => {
			try {
				const response = await fetch(`${GROUP_URL}/${groupId}`)

				if (!response.ok) {
					throw new Error('Error while fetching group')
				}

				const groupFetched: Group = await response.json()

				setGroup(groupFetched)
			} catch (error) {
				captureException(error)
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

	return (
		<>
			<main className="p-4">
				<GoBackLink className="mb-4 font-bold" />
				<Meta
					title={t('Mon groupe, nos bilans carbone personnels')}
					description={t(
						"Calculez votre empreinte carbone en groupe et comparez la avec l'empreinte de vos proches grâce au simulateur de bilan carbone personnel Nos Gestes Climat."
					)}
				/>
				{isEditingTitle ? (
					<InlineTextInput
						defaultValue={group?.name}
						label={t('Modifier le nom du groupe')}
						name="group-name-input"
						onClose={() => setIsEditingTitle(false)}
						onSubmit={async (value: string) => {
							setIsSubmitting(true)
							try {
								const response = await fetch(GROUP_URL + '/update', {
									method: 'POST',
									body: JSON.stringify({
										_id: group?._id,
										name: value,
									}),
									headers: {
										Accept: 'application/json',
										'Content-Type': 'application/json',
									},
								})

								const groupUpdated: Group = await response.json()

								if (!response.ok) {
									throw new Error(JSON.stringify(group))
								}

								setGroup(groupUpdated)
								setIsSubmitting(false)
								setIsEditingTitle(false)
								trackEvent(matomoEventUpdateGroupName)
							} catch (e) {
								captureException(e)
							}
						}}
						isLoading={isSubmitting}
						data-cypress-id="group-edit-input-name"
					/>
				) : (
					<Title
						data-cypress-id="group-name"
						title={
							<span className="flex justify-between items-center">
								<span>
									<span>{group?.emoji}</span> <span>{group?.name}</span>
								</span>
								<Button
									className="!p-1"
									onClick={() => setIsEditingTitle(true)}
									color="secondary"
									data-cypress-id="group-name-edit-button"
								>
									<img
										src="/images/pencil.svg"
										alt={t(
											'Modifier le nom du groupe, ouvre un champ de saisie automatiquement focalisé'
										)}
									/>
								</Button>
							</span>
						}
					/>
				)}
				<div className="mt-4">
					<h2 className="font-bold text-lg m-0">
						<Trans>Le classement</Trans>
					</h2>
				</div>
				<Classement group={group} />

				<InviteBlock group={group} />

				{group?.members?.length > 1 ? (
					<>
						<Separator className="mb-8" />
						<PointsFortsFaibles
							pointsFaibles={results?.pointsFaibles}
							pointsForts={results?.pointsForts}
						/>
						<Separator className="mt-10 mb-6" />
					</>
				) : (
					<Separator className="mt-8 mb-6" />
				)}

				<VotreEmpreinte
					categoriesFootprints={results?.currentMemberAllFootprints}
					membersLength={group?.members?.length}
				/>
			</main>
			<Footer />
		</>
	)
}
