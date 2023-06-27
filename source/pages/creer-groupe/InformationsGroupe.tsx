import { addGroupToUser, setCreatedGroup } from '@/actions/actions'
import { matomoEventCreationGroupe } from '@/analytics/matomo-events'
import { useEngine } from '@/components/utils/EngineContext'
import { GROUP_URL } from '@/constants/urls'
import { MatomoContext } from '@/contexts/MatomoContext'
import { useGetCurrentSimulation } from '@/hooks/useGetCurrentSimulation'
import { AppState } from '@/reducers/rootReducer'
import { Group } from '@/types/groups'
import { getSimulationResults } from '@/utils/getSimulationResults'
import { useContext, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/groupe/Button'
import GoBackLink from '../../components/groupe/GoBackLink'
import TextInputGroup from '../../components/groupe/TextInputGroup'
import Title from '../../components/groupe/Title'
import StepperIndicator from './components/StepperIndicator'
import { DataContext } from './contexts/DataContext'

export default function InformationsGroupe() {
	const { trackEvent } = useContext(MatomoContext)
	const { prenom, email, groupeName, setGroupeName } = useContext(DataContext)

	const [groupeNameLocalState, setGroupeNameLocalState] = useState(
		groupeName ?? ''
	)
	const [errorGroupeName, setErrorGroupeName] = useState('')
	const [shouldShowErrorSimulation, setShouldShowErrorSimulation] =
		useState(false)

	const { t } = useTranslation()

	const navigate = useNavigate()

	const dispatch = useDispatch()

	const currentSimulation = useGetCurrentSimulation()

	const engine = useEngine()

	const userId = useSelector((state: AppState) => state.userId)

	const handleSubmit = async () => {
		if (!currentSimulation) {
			setShouldShowErrorSimulation(true)
			return
		}

		if (!groupeNameLocalState) {
			setErrorGroupeName(t('Ce champ est obligatoire'))
			return
		}

		try {
			setGroupeName(groupeNameLocalState)

			const results = getSimulationResults({
				simulation: currentSimulation,
				engine,
			})

			const response = await fetch(GROUP_URL + '/create', {
				method: 'POST',
				body: JSON.stringify({
					name: groupeNameLocalState,
					ownerEmail: email,
					ownerName: prenom,
					userId,
					simulation: currentSimulation,
					results,
				}),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			})
			const group: Group = await response.json()

			if (!response.ok) {
				throw new Error(JSON.stringify(group))
			}

			dispatch(addGroupToUser(group))
			dispatch(setCreatedGroup(group))

			trackEvent(matomoEventCreationGroupe)

			navigate('/creer-groupe/inviter-vos-proches')
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
			{shouldShowErrorSimulation && (
				<div className="mt-2text-xs text-red-700">
					<Trans>
						Vous devez compléter votre test avant de créer un groupe.
					</Trans>
				</div>
			)}
		</>
	)
}