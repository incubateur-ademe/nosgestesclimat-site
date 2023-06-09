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
	const { groupeName, setGroupeName } = useContext(DataContext)

	const [groupeNameLocalState, setGroupeNameLocalState] = useState(
		groupeName ?? ''
	)
	const [errorGroupeName, setErrorGroupeName] = useState('')

	const { t } = useTranslation()

	const navigate = useNavigate()

	const handleSubmit = () => {
		if (!groupeNameLocalState) {
			setErrorGroupeName(t('Ce champ est obligatoire'))
			return
		}

		setGroupeName(groupeNameLocalState)

		navigate('../inviter-vos-proches')
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
