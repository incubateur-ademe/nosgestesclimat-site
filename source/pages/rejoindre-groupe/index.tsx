import { addGroupToUser, setGroupToRedirectTo } from '@/actions/actions'
import Button from '@/components/groupe/Button'
import TextInputGroup from '@/components/groupe/TextInputGroup'
import Title from '@/components/groupe/Title'
import { useEngine } from '@/components/utils/EngineContext'
import { useSetUserId } from '@/hooks/useSetUserId'
import { AppState } from '@/reducers/rootReducer'
import { Group } from '@/types/groups'
import { fetchAddUserToGroup } from '@/utils/fetchAddUserToGroup'
import { fetchGroup } from '@/utils/fetchGroup'
import { getSimulationResults } from '@/utils/getSimulationResults'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { redirect, useNavigate, useParams } from 'react-router-dom'

export default function RejoindreGroupe() {
	const [group, setGroup] = useState<Group | null>(null)

	const [prenomLocalState, setPrenomLocalState] = useState('')
	const [errorPrenom, setErrorPrenom] = useState('')
	const [emailLocalState, setEmailLocalState] = useState('')

	const { groupId } = useParams()

	// Ajoute userId si non présente
	useSetUserId()

	const userId = useSelector((state: AppState) => state.userId)

	const { t } = useTranslation()

	const navigate = useNavigate()

	const dispatch = useDispatch()

	const currentSimulationId = useSelector(
		(state: AppState) => state.currentSimulationId
	)

	const simulationList = useSelector((state: AppState) => state.simulations)

	const currentSimulation = simulationList.find(
		(simulation) => simulation.id === currentSimulationId
	)

	useEffect(() => {
		const handleFetchGroup = async () => {
			try {
				const group = await fetchGroup(groupId || '')

				setGroup(group)
			} catch (error) {
				console.error(error)
			}
		}
		if (groupId && !group) {
			handleFetchGroup()
		}
	}, [groupId, group])

	const engine = useEngine()

	const handleSubmit = async () => {
		if (!group) {
			return
		}

		if (!prenomLocalState) {
			setErrorPrenom(t('Ce champ est obligatoire'))
			return
		}

		const results = getSimulationResults({
			simulation: currentSimulation,
			engine,
		})

		try {
			await fetchAddUserToGroup({
				group,
				name: prenomLocalState,
				email: emailLocalState,
				userId: userId ?? '',
				simulation: currentSimulation ?? undefined,
				results,
			})

			// Vérifier si l'utilisateur n'est pas déjà dans le groupe
			dispatch(addGroupToUser(group))

			// Si l'utilisateur a déjà une simulation de complétée, on le redirige vers le dashboard
			if (currentSimulation) {
				navigate(`/groupe/${group._id}`)
			} else {
				// sinon on le redirige vers le simulateur
				dispatch(setGroupToRedirectTo(group))
				navigate('/simulateur/bilan')
			}
		} catch (error) {
			console.error(error)
		}
	}

	// Show nothing if group is not fetched yet
	if (!group) {
		return null
	}

	// If user is already in the group, redirect to group page
	if (group?.members?.find((member) => member.userId === userId)) {
		return redirect(`/groupe/${group._id}`)
	}

	return (
		<div className="p-4">
			<Title
				title={
					<Trans>
						{group?.owner?.name} vous a invité à rejoindre le groupe{' '}
						<span className="text-violet-900">{group?.name}</span>
					</Trans>
				}
				subtitle={t(
					"Comparez vos résultats avec votre famille ou un groupe d'amis."
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
			<Button onClick={handleSubmit} aria-disabled={!prenomLocalState}>
				<Trans>Rejoindre</Trans>
			</Button>
		</div>
	)
}
