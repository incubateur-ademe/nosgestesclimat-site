import { useContext, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/groupe/Button'
import TextInputGroup from '../../components/groupe/TextInputGroup'
import Title from '../../components/groupe/Title'
import GoBackLink from './components/GoBackLink'
import StepperIndicator from './components/StepperIndicator'
import { DataContext } from './contexts/DataContext'

export default function VosInformations() {
	const { prenom, setPrenom, email, setEmail } = useContext(DataContext)

	const [prenomLocalState, setPrenomLocalState] = useState(prenom ?? '')
	const [errorPrenom, setErrorPrenom] = useState('')
	const [emailLocalState, setEmailLocalState] = useState(email ?? '')

	const { t } = useTranslation()

	const navigate = useNavigate()

	const handleSubmit = () => {
		if (!prenomLocalState) {
			setErrorPrenom(t('Ce champ est obligatoire'))
			return
		}

		setPrenom(prenomLocalState)
		setEmail(emailLocalState)

		navigate('../informations-de-groupe')
	}

	return (
		<>
			<GoBackLink className="mb-4 font-bold" />
			<StepperIndicator currentStep={1} numberSteps={3} />
			<Title
				title={t("Créer un groupe d'amis")}
				subtitle={t(
					'Comparez vos résultats avec votre famille ou un groupe d’amis'
				)}
			/>
			<TextInputGroup
				label={t('Votre prénom (ou pseudo)')}
				helperText={t(
					'Il sera visible uniquement par les participants du groupe'
				)}
				name="prenom"
				placeholder="Jean-Michel"
				className="mt-4"
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setPrenomLocalState(e.target.value)
				}
				error={errorPrenom}
				value={prenomLocalState}
			/>
			<TextInputGroup
				label={
					<span>
						{t('Votre adresse email ')}{' '}
						<span className="text-pink-700 italic"> {t('facultatif')}</span>
					</span>
				}
				helperText={t(
					'Seulement pour te permettre de le retrouver ou de supprimer les données par la suite'
				)}
				name="prenom"
				placeholder="jean-michel@nosgestesclimat.fr"
				className="mt-6 mb-6"
				onChange={(e) => setEmailLocalState(e.target.value)}
				value={emailLocalState}
			/>
			<Button onClick={handleSubmit} aria-disabled={!prenom}>
				<Trans>Continuer</Trans> →
			</Button>
		</>
	)
}
