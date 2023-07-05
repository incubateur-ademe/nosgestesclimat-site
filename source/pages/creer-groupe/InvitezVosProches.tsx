import { useMatomo } from '@/contexts/MatomoContext'
import { AppState } from '@/reducers/rootReducer'
import { Group } from '@/types/groups'
import { fetchGroup } from '@/utils/fetchGroup'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Button from '../../components/groupe/Button'
import Title from '../../components/groupe/Title'

import CopyInput from '@/components/groupe/CopyInput'
import Link from '@/components/groupe/Link'
import StepperIndicator from './components/StepperIndicator'

export default function InvitezVosProches() {
	const [fetchedGroup, setFetchedGroup] = useState<Group | null>(null)
	const { t } = useTranslation()

	const { groupId } = useParams()

	const { trackEvent } = useMatomo()

	const createdGroup = useSelector((state: AppState) => state.createdGroup)

	useEffect(() => {
		const handleFetchGroup = async () => {
			const group = await fetchGroup(groupId || '')

			setFetchedGroup(group)
		}

		if (!fetchedGroup && !createdGroup && groupId) {
			handleFetchGroup()
		}
	}, [createdGroup, fetchedGroup, groupId])

	// eslint-disable-next-line @typescript-eslint/unbound-method
	const isShareDefined = typeof navigator !== 'undefined' && navigator.share

	const sharedURL = `${window.location.origin}/rejoindre-groupe/${
		createdGroup?._id || fetchedGroup?._id
	}`

	const handleShare = () => {
		// TODO: replace with new tracking event
		// trackEvent(getMatomoEventShareMobile(score))
		if (navigator.share) {
			navigator
				.share({
					text: sharedURL,
					url: sharedURL,
					title: 'Rejoindre mon groupe',
				})
				.then(() => console.log('Successful share'))
				.catch((error) => console.log('Error sharing', error))
		}
	}

	return (
		<div className={!createdGroup ? 'p-4' : ''}>
			{createdGroup && <StepperIndicator currentStep={3} numberSteps={3} />}
			<Title
				title={t('Invitez vos proches')}
				subtitle={t(
					`${
						createdGroup ? 'Votre groupe est prêt ! ' : ''
					}Partagez ce lien à vos proches pour les inviter à rejoindre votre groupe.`
				)}
			/>
			<CopyInput textToCopy={sharedURL} className="mt-6 mb-4" />

			{isShareDefined && (
				<Button onClick={handleShare}>
					<Trans>Partager</Trans>
				</Button>
			)}

			<Link href={'/mes-groupes'} className="mt-12">
				<span role="img" aria-label="Emoji pointing right">
					👉
				</span>{' '}
				<Trans>Voir mes groupes</Trans>
			</Link>
		</div>
	)
}
