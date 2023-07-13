import {
	addGroupToUser,
	setGroupToRedirectTo,
	setUserNameAndEmail,
} from '@/actions/actions'
import { matomoEventCreationGroupe } from '@/analytics/matomo-events'
import Button from '@/components/groupe/Button'
import EmailInput from '@/components/groupe/EmailInput'
import GoBackLink from '@/components/groupe/GoBackLink'
import PrenomInput from '@/components/groupe/PrenomInput'
import Title from '@/components/groupe/Title'
import { useEngine } from '@/components/utils/EngineContext'
import Meta from '@/components/utils/Meta'
import { GROUP_NAMES } from '@/constants/groupNames'
import { GROUP_URL, NETLIFY_FUNCTIONS_URL } from '@/constants/urls'
import { useMatomo } from '@/contexts/MatomoContext'
import { useGetCurrentSimulation } from '@/hooks/useGetCurrentSimulation'
import { AppState } from '@/reducers/rootReducer'
import { Group } from '@/types/groups'
import { getSimulationResults } from '@/utils/getSimulationResults'
import { captureException } from '@sentry/react'
import { FormEventHandler, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function CreerGroupe() {
	const userId = useSelector((state: AppState) => state.user.userId)
	const usernameFromState = useSelector((state: AppState) => state.user.name)
	const emailFromState = useSelector((state: AppState) => state.user.email)

	const [prenom, setPrenom] = useState(usernameFromState || '')
	const [errorPrenom, setErrorPrenom] = useState('')
	const [email, setEmail] = useState(emailFromState || '')
	const [errorEmail, setErrorEmail] = useState('')

	const { trackEvent } = useMatomo()

	const { t } = useTranslation()

	const navigate = useNavigate()

	const dispatch = useDispatch()

	const engine = useEngine()

	const currentSimulation = useGetCurrentSimulation()

	const groups = useSelector((state: AppState) => state.groups) || []

	const groupBaseURL = `${window.location.origin}/groupes`

	const handleSubmit = async (event) => {
		// Avoid reloading page
		if (event) {
			event.preventDefault()
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

		try {
			const results = getSimulationResults({
				engine,
			})

			const groupNameObject = GROUP_NAMES[groups.length % GROUP_NAMES.length]

			const response = await fetch(GROUP_URL + '/create', {
				method: 'POST',
				body: JSON.stringify({
					name: groupNameObject.name,
					emoji: groupNameObject.emoji,
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
			dispatch(setUserNameAndEmail(prenom, email))

			// The user will be redirected to the test in order to take it
			if (!currentSimulation) {
				dispatch(setGroupToRedirectTo(group))
				navigate('/simulateur/bilan')
				return
			}

			trackEvent(matomoEventCreationGroupe)

			// Send email to owner
			if (email) {
				await fetch(`${NETLIFY_FUNCTIONS_URL}/group-email-service`, {
					method: 'POST',
					body: JSON.stringify({
						email,
						name: prenom,
						groupName: group.name,
						isCreation: true,
						groupURL: `${groupBaseURL}/resultats?groupId=${group?._id}&mtm_campaign=voir-mon-groupe-email`,
						shareURL: `${groupBaseURL}/invitation?groupId=${group?._id}&mtm_campaign=invitation-groupe-email`,
						deleteURL: `${groupBaseURL}/supprimer?groupId=${group?._id}&userId=${userId}&mtm_campaign=invitation-groupe-email`,
					}),
				})
			}

			navigate(`/groupes/resultats?groupId=${group._id}`)
		} catch (e) {
			captureException(e)
		}
	}
	return (
		<main className="p-4 md:p-8">
			<>
				<Meta
					title={t('Créer un groupe et calculer notre empreinte carbone')}
					description={t(
						"Calculez votre empreinte carbone en groupe et comparez la avec l'empreinte de vos proches grâce au simulateur de bilan carbone personnel Nos Gestes Climat."
					)}
				/>
				<GoBackLink className="mb-4 font-bold" />
				<Title
					title={t("Créer un groupe d'amis")}
					subtitle={t(
						'Comparez vos résultats avec votre famille ou un groupe d’amis'
					)}
				/>
				<form onSubmit={handleSubmit as FormEventHandler<HTMLFormElement>}>
					<PrenomInput
						prenom={prenom}
						setPrenom={setPrenom}
						errorPrenom={errorPrenom}
						setErrorPrenom={setErrorPrenom}
						data-cypress-id="group-input-owner-name"
					/>
					<EmailInput
						email={email}
						setEmail={setEmail}
						errorEmail={errorEmail}
						setErrorEmail={setErrorEmail}
					/>
					<Button
						type="submit"
						data-cypress-id="button-create-group"
						onClick={handleSubmit}
						aria-disabled={!prenom}
					>
						{currentSimulation ? (
							<Trans>Créer le groupe</Trans>
						) : (
							<Trans>Créer et passer mon test</Trans>
						)}
					</Button>
				</form>
			</>
		</main>
	)
}
