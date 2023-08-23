import Title from '@/components/groupe/Title'
import { GROUP_URL } from '@/constants/urls'
import { useSetUserId } from '@/hooks/useSetUserId'
import { AppState } from '@/reducers/rootReducer'
import { Group } from '@/types/groups'
import { captureException } from '@sentry/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import AutoCanonicalTag from '@/components/utils/AutoCanonicalTag'
import Meta from '@/components/utils/Meta'
import { useGetCurrentSimulation } from '@/hooks/useGetCurrentSimulation'
import FeedbackBlock from '../groupe-dashboard/components/FeedbackBlock'
import SondagesBlock from '../groupe-dashboard/components/SondagesBlock'
import CreateFirstGroupSection from './components/CreateFirstGroupSection'
import CreateOtherGroupsSection from './components/CreateOtherGroupsSection'
import NoSimulationSection from './components/NoSimulationSection'
import { ServerErrorSection } from './components/ServerErrorSection'

export default function MesGroupes() {
	const [groups, setGroups] = useState<Group[] | null>(null)
	const [isFetched, setIsFetched] = useState(false)

	const { t } = useTranslation()

	useSetUserId()

	const userId = useSelector((state: AppState) => state.user.userId)

	const currentSimulation = useGetCurrentSimulation()

	useEffect(() => {
		const handleFetchGroups = async () => {
			setIsFetched(true)
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

			<AutoCanonicalTag />

			<Title
				title={t("Groupe d'amis")}
				subtitle={t(
					'Comparez vos résultats avec votre famille ou un groupe d’amis'
				)}
			/>
			<FeedbackBlock />

			{isFetched && !groups && <ServerErrorSection />}

			{!currentSimulation && <NoSimulationSection />}

			{currentSimulation && groups && groups.length === 0 && (
				<CreateFirstGroupSection />
			)}

			{currentSimulation && groups && groups.length > 0 && (
				<CreateOtherGroupsSection groups={groups} />
			)}

			<SondagesBlock />
		</main>
	)
}
