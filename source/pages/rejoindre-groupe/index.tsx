import { addGroupToUser, setGroupToRedirectTo } from '@/actions/actions'
import { getMatomoEventJoinedGroupe } from '@/analytics/matomo-events'
import Button from '@/components/groupe/Button'
import EmailInput from '@/components/groupe/EmailInput'
import PrenomInput from '@/components/groupe/PrenomInput'
import Title from '@/components/groupe/Title'
import { useEngine } from '@/components/utils/EngineContext'
import Meta from '@/components/utils/Meta'
import { NETLIFY_FUNCTIONS_URL } from '@/constants/urls'
import { useMatomo } from '@/contexts/MatomoContext'
import { useGetCurrentSimulation } from '@/hooks/useGetCurrentSimulation'
import { useSetUserId } from '@/hooks/useSetUserId'
import { AppState } from '@/reducers/rootReducer'
import { Group } from '@/types/groups'
import { fetchAddUserToGroup } from '@/utils/fetchAddUserToGroup'
import { fetchGroup } from '@/utils/fetchGroup'
import { getSimulationResults } from '@/utils/getSimulationResults'
import { captureException } from '@sentry/react'
import { FormEvent, useEffect, useState } from 'react'
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

	const groupURL = `/groupes/resultats?groupId=${group?._id}`

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

	const groupBaseURL = `${window.location.origin}/groupes`

	const handleSubmit = async (event: MouseEvent | FormEvent) => {
		// Avoid reloading page
		if (event) {
			event.preventDefault()
		}

		// Shouldn't happen but in any case, avoid group joining
		if (!group) {
			return
		}

		// Inputs validation
		if (!prenom) {
			setErrorPrenom(t('Veuillez renseigner un prénom ou un pseudonyme.'))
			return
		}
		if (
			email &&
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

			// Send email to owner
			if (email) {
				await fetch(`${NETLIFY_FUNCTIONS_URL}/group-email-service`, {
					method: 'POST',
					body: JSON.stringify({
						email,
						name: prenom,
						groupName: group.name,
						groupURL: `${groupBaseURL}/resultats?groupId=${group?._id}&mtm_campaign=voir-mon-groupe-email`,
						shareURL: `${groupBaseURL}/invitation?groupId=${group?._id}&mtm_campaign=invitation-groupe-email`,
						deleteURL: `${groupBaseURL}/supprimer?groupId=${group?._id}&userId=${userId}&mtm_campaign=invitation-groupe-email`,
					}),
				})
			}

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
		<main className="p-4 md:p-8">
			<Meta
				title={t('Rejoindre un groupe - Nos Gestes Climat')}
				description={t(
					"Rejoignez votre groupe pour calculez votre empreinte carbone et la comparer avec l'empreinte de vos proches grâce au simulateur de bilan carbone personnel Nos Gestes Climat."
				)}
			/>
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
			<form onSubmit={handleSubmit}>
				<PrenomInput
					prenom={prenom}
					setPrenom={setPrenom}
					errorPrenom={errorPrenom}
					setErrorPrenom={setErrorPrenom}
					data-cypress-id="member-name"
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
				<Button
					type="submit"
					onClick={handleSubmit}
					aria-disabled={!prenom}
					data-cypress-id="button-join-group"
				>
					{currentSimulation ? (
						<Trans>Rejoindre</Trans>
					) : (
						<Trans>Rejoindre et passer mon test</Trans>
					)}
				</Button>
			</form>
		</main>
	)
}
