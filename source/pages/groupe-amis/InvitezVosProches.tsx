import { MatomoContext } from '@/contexts/MatomoContext'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Button from './components/Button'
import CopyInput from './components/CopyInput'
import Link from './components/Link'
import StepperIndicator from './components/StepperIndicator'
import Title from './components/Title'

export default function InvitezVosProches() {
	const { t } = useTranslation()
	const { trackEvent } = useContext(MatomoContext)

	// eslint-disable-next-line @typescript-eslint/unbound-method
	const isShareDefined = typeof navigator !== 'undefined' && navigator.share

	const handleShare = () => {
		// TODO: replace with new tracking event
		// trackEvent(getMatomoEventShareMobile(score))
		if (navigator.share) {
			navigator
				.share({
					text: 'toto kiki',
					url: 'https://nosgestesclimat.fr',
					title: 'toto kiki',
				})
				.then(() => console.log('Successful share'))
				.catch((error) => console.log('Error sharing', error))
		}
	}

	return (
		<>
			<StepperIndicator currentStep={3} numberSteps={3} />
			<Title
				title={t('Invitez vos proches')}
				subtitle={t(
					'Votre groupe est prêt ! Partagez ce lien à vos proches pour les inviter à rejoindre votre groupe'
				)}
			/>
			<CopyInput textToCopy={t('Toto kiki')} className="mt-6 mb-4" />

			{isShareDefined && (
				<Button onClick={handleShare}>
					<Trans>Partager</Trans>
				</Button>
			)}

			<Link href={'..'} className="mt-12">
				<span role="img" aria-label="Emoji pointing right">
					👉
				</span>{' '}
				<Trans>Voir mes groupes</Trans>
			</Link>
		</>
	)
}
