import { addGroupToUser, setCreatedGroup } from '@/actions/actions'
import { matomoEventCreationGroupe } from '@/analytics/matomo-events'
import Button from '@/components/groupe/Button'
import GoBackLink from '@/components/groupe/GoBackLink'
import TextInputGroup from '@/components/groupe/TextInputGroup'
import Title from '@/components/groupe/Title'
import { useEngine } from '@/components/utils/EngineContext'
import { GROUP_URL } from '@/constants/urls'
import { useMatomo } from '@/contexts/MatomoContext'
import { useGetCurrentSimulation } from '@/hooks/useGetCurrentSimulation'
import { AppState } from '@/reducers/rootReducer'
import { Group } from '@/types/groups'
import { getSimulationResults } from '@/utils/getSimulationResults'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function GroupeAmis() {
	const [prenom, setPrenom] = useState('')
	const [errorPrenom, setErrorPrenom] = useState('')
	const [email, setEmail] = useState('')

	const { trackEvent } = useMatomo()

	const { t } = useTranslation()

	const navigate = useNavigate()

	const dispatch = useDispatch()

	const engine = useEngine()

	const currentSimulation = useGetCurrentSimulation()

	const userId = useSelector((state: AppState) => state.userId)

	const handleSubmit = async () => {
		if (!prenom) {
			setErrorPrenom(t('Vous devez renseigner un prénom ou un pseudonyme.'))
			return
		}

		try {
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
		<div className="p-4 md:p-8">
			<>
				<GoBackLink className="mb-4 font-bold" />
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
					placeholder="Jean-Marc"
					className="mt-4"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setPrenom(e.target.value)
						if (errorPrenom) {
							setErrorPrenom('')
						}
					}}
					error={errorPrenom}
					value={prenom}
				/>
				<TextInputGroup
					label={
						<span>
							{t('Votre adresse email ')}{' '}
							<span className="text-secondary italic"> {t('facultatif')}</span>
						</span>
					}
					helperText={t(
						'Seulement pour vous permettre de retrouver votre groupe ou de supprimer vos données'
					)}
					name="prenom"
					placeholder="jean-marc@nosgestesclimat.fr"
					className="mt-6 mb-6"
					onChange={(e) => setEmail(e.target.value)}
					value={email}
				/>
				<Button onClick={handleSubmit} aria-disabled={!prenom}>
					<Trans>Créer le groupe</Trans>
				</Button>
			</>
		</div>
	)
}
