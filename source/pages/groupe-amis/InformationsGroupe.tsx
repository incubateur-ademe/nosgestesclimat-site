import { matomoEventCreationGroupe } from '@/analytics/matomo-events'
import { GROUP_URL } from '@/constants/urls'
import { MatomoContext } from '@/contexts/MatomoContext'
import { useContext, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from './components/Button'
import GoBackLink from './components/GoBackLink'
import StepperIndicator from './components/StepperIndicator'
import TextInputGroup from './components/TextInputGroup'
import Title from './components/Title'
import { DataContext } from './contexts/DataContext'

export default function InformationsGroupe() {
	const { trackEvent } = useContext(MatomoContext)
	const { prenom, email, groupeName, setGroupeName } = useContext(DataContext)

	const [groupeNameLocalState, setGroupeNameLocalState] = useState(
		groupeName ?? ''
	)
	const [errorGroupeName, setErrorGroupeName] = useState('')

	const { t } = useTranslation()

	const navigate = useNavigate()

	const handleSubmit = async () => {
		if (!groupeNameLocalState) {
			setErrorGroupeName(t('Ce champ est obligatoire'))
			return
		}

		try {
			setGroupeName(groupeNameLocalState)

			const response = await fetch(GROUP_URL, {
				method: 'POST',
				body: JSON.stringify({
					name: groupeNameLocalState,
					ownerEmail: email,
					ownerName: prenom,
				}),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			})
			const result = await response.json()

			if (!response.ok) {
				throw new Error(JSON.stringify(result))
			}
			trackEvent(matomoEventCreationGroupe)
			navigate('/creer-groupe-amis/inviter-vos-proches')
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<>
			<GoBackLink className="mb-4 font-bold" />
			<StepperIndicator currentStep={2} numberSteps={3} />
			<Title
				title={t("Créer un groupe d'amis")}
				subtitle={t(
					'Comparez vos résultats avec votre famille ou un groupe d’amis'
				)}
			/>
			<TextInputGroup
				label={t('Choisissez un nom pour ce groupe')}
				helperText={t('Pour le retrouver facilement dans votre liste')}
				name="groupeName"
				placeholder="Famille"
				className="mt-4 mb-6"
				error={errorGroupeName}
				value={groupeNameLocalState}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setGroupeNameLocalState(e.target.value)
				}
			/>
			<Button onClick={handleSubmit} aria-disabled={!groupeNameLocalState}>
				<Trans>Créer le groupe</Trans>
			</Button>
		</>
	)
}
