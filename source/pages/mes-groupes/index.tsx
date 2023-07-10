import Title from '@/components/groupe/Title'
import { GROUP_URL } from '@/constants/urls'
import { useSetUserId } from '@/hooks/useSetUserId'
import { AppState } from '@/reducers/rootReducer'
import { Group } from '@/types/groups'
import { captureException } from '@sentry/react'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ButtonLink from '../../components/groupe/ButtonLink'

import Container from '@/components/groupe/Container'
import Separator from '@/components/groupe/Separator'
import Meta from '@/components/utils/Meta'
import GroupList from './components/GroupList'

export default function MesGroupes() {
	const [groups, setGroups] = useState<Group[] | null>(null)

	const { t } = useTranslation()

	useSetUserId()

	const userId = useSelector((state: AppState) => state.userId)

	useEffect(() => {
		const handleFetchGroups = async () => {
			try {
				const response = await fetch(`${GROUP_URL}/user-groups/${userId}`)
				if (!response.ok) {
					throw new Error('Error while fetching groups')
				}

				const groupsFetched: Group[] = await response.json()

				setGroups(groupsFetched)
			} catch (error) {
				captureException(error)
			}
		}

		if (userId && !groups) {
			handleFetchGroups()
		}
	}, [groups, userId])

	return (
		<main className="p-4 md:p-8">
			<Meta
				title={t("Mes groupes, simulateur d'empreinte carbone")}
				description={t(
					"Calculez votre empreinte carbone en groupe et comparez la avec l'empreinte de vos proches grâce au simulateur de bilan carbone personnel Nos Gestes Climat."
				)}
			/>

			<Title
				title={t("Groupe d'amis")}
				subtitle={t(
					'Comparez vos résultats avec votre famille ou un groupe d’amis'
				)}
			/>

			{groups && groups.length === 0 && (
				<Container className="mt-7 bg-gray-100 p-4">
					<h2 className="text-md font-medium mb-2 mt-0">
						<Trans>Créez votre premier groupe</Trans>
					</h2>
					<p className="text-sm mb-6">
						Invitez vos proches pour comparer vos résultats. Cela prend{' '}
						<strong className="text-secondary">1 minute</strong> !
					</p>
					<ButtonLink
						href={'/groupes/creer'}
						data-cypress-id="button-create-first-group"
					>
						<Trans>Commencer</Trans>
					</ButtonLink>
				</Container>
			)}

			{groups && groups.length > 0 && (
				<>
					<GroupList groups={groups} className="mt-8" />
					<Separator className="mb-4 mt-8" />
					<h3 className="text-md font-bold mb-1">
						<Trans>Créez un autre groupe</Trans>
					</h3>
					<p className="text-sm mb-6">
						Vous pouvez créer un nouveau groupe avec d’autres amis.
					</p>
					<ButtonLink
						href={'/groupes/creer'}
						color="secondary"
						data-cypress-id="button-create-other-group"
					>
						<Trans>Créer un autre groupe</Trans>
					</ButtonLink>
				</>
			)}
		</main>
	)
}
