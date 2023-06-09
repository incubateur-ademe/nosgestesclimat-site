import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from './components/Button'
import GoBackLink from './components/GoBackLink'
import StepperIndicator from './components/StepperIndicator'
import TextInputGroup from './components/TextInputGroup'
import Title from './components/Title'

export default function VosInformations() {
	const [prenom, setPrenom] = useState('')
	const [errorPrenom, setErrorPrenom] = useState('')
	const [email, setEmail] = useState('')

	const { t } = useTranslation()

	const navigate = useNavigate()

	const handleSubmit = () => {
		if (!prenom) {
			setErrorPrenom(t('Ce champ est obligatoire'))
			return
		}

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
					setPrenom(e.target.value)
				}
				error={errorPrenom}
				value={prenom}
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
				onChange={(e) => setEmail(e.target.value)}
				value={email}
			/>
			<Button onClick={handleSubmit} aria-disabled={!prenom}>
				<Trans>Continuer</Trans> →
			</Button>
		</>
	)
}
