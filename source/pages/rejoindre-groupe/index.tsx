import { addGroupToUser, setGroupToRedirectTo } from '@/actions/actions'
import { getMatomoEventJoinedGroupe } from '@/analytics/matomo-events'
import Button from '@/components/groupe/Button'
import EmailInput from '@/components/groupe/EmailInput'
import PrenomInput from '@/components/groupe/PrenomInput'
import Title from '@/components/groupe/Title'
import { useEngine } from '@/components/utils/EngineContext'
import { useMatomo } from '@/contexts/MatomoContext'
import { useGetCurrentSimulation } from '@/hooks/useGetCurrentSimulation'
import { useSetUserId } from '@/hooks/useSetUserId'
import { AppState } from '@/reducers/rootReducer'
import { Group } from '@/types/groups'
import { fetchAddUserToGroup } from '@/utils/fetchAddUserToGroup'
import { fetchGroup } from '@/utils/fetchGroup'
import { getSimulationResults } from '@/utils/getSimulationResults'
import { captureException } from '@sentry/react'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { redirect, useNavigate, useSearchParams } from 'react-router-dom'

export default function RejoindreGroupe() {
	const [group, setGroup] = useState<Group | null>(null)
	const [prenom, setPrenom] = useState('')
	const [errorPrenom, setErrorPrenom] = useState('')
	const [email, setEmail] = useState('')
	const [errorEmail, setErrorEmail] = useState('')

	const [searchParams] = useSearchParams()

	const groupId = searchParams.get('groupId')

	const groupURL = `/groupe/resultats?groupId=${group?._id}`

	// Ajoute userId si non présente
	useSetUserId()

	const userId = useSelector((state: AppState) => state.userId)

	const { t } = useTranslation()

	const navigate = useNavigate()

	const dispatch = useDispatch()

	const currentSimulation = useGetCurrentSimulation()

	const engine = useEngine()

	const { trackEvent } = useMatomo()

	useEffect(() => {
		const handleFetchGroup = async () => {
			try {
				const group = await fetchGroup(groupId || '')

				setGroup(group)
			} catch (error) {
				captureException(error)
			}
		}
		if (groupId && !group) {
			handleFetchGroup()
		}
	}, [groupId, group])

	const handleSubmit = async () => {
		if (!group) {
			return
		}

		if (!prenom) {
			setErrorPrenom(t('Veuillez renseigner un prénom ou un pseudonyme.'))
			return
		}

		if (
			!email.match(
				/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
			)
		) {
			setErrorEmail(t('Veuillez renseigner un email valide.'))
			return
		}

		const results = getSimulationResults({
			engine,
		})

		try {
			await fetchAddUserToGroup({
				group,
				name: prenom,
				email,
				userId: userId ?? '',
				simulation: currentSimulation ?? undefined,
				results,
			})

			// Vérifier si l'utilisateur n'est pas déjà dans le groupe
			dispatch(addGroupToUser(group))

			// Si l'utilisateur a déjà une simulation de complétée, on le redirige vers le dashboard
			if (currentSimulation) {
				trackEvent(getMatomoEventJoinedGroupe(group._id))
				navigate(groupURL)
			} else {
				// sinon on le redirige vers le simulateur
				dispatch(setGroupToRedirectTo(group))
				navigate('/simulateur/bilan')
			}
		} catch (error) {
			captureException(error)
		}
	}

	// Show nothing if group is not fetched yet
	if (!group) {
		return null
	}

	// If user is already in the group, redirect to group page
	if (group?.members?.find((member) => member.userId === userId)) {
		redirect(groupURL)
	}

	return (
		<div className="p-4 md:p-8">
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
			<PrenomInput
				prenom={prenom}
				setPrenom={setPrenom}
				errorPrenom={errorPrenom}
				setErrorPrenom={setErrorPrenom}
			/>
			<EmailInput
				email={email}
				setEmail={setEmail}
				errorEmail={errorEmail}
				setErrorEmail={setErrorEmail}
			/>
			{!currentSimulation && (
				<p className="text-xs mb-2">
					Vous devrez compléter votre test après avoir rejoint le groupe.
				</p>
			)}
			<Button onClick={handleSubmit} aria-disabled={!prenom}>
				<Trans>Rejoindre</Trans>
			</Button>
		</div>
	)
}
