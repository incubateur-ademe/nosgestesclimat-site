import { Trans, useTranslation } from 'react-i18next'
import ButtonLink from './components/ButtonLink'
import GoBackLink from './components/GoBackLink'
import StepperIndicator from './components/StepperIndicator'
import TextInputGroup from './components/TextInputGroup'
import Title from './components/Title'

export default function InformationsGroupe() {
	const { t } = useTranslation()
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
			/>
			<ButtonLink href="../inviter-vos-proches">
				<Trans>Créer le groupe</Trans>
			</ButtonLink>
		</>
	)
}
