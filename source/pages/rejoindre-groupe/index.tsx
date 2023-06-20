import { addGroupToUser } from '@/actions/actions'
import Button from '@/components/groupe/Button'
import TextInputGroup from '@/components/groupe/TextInputGroup'
import Title from '@/components/groupe/Title'
import { GROUP_URL } from '@/constants/urls'
import { Group } from '@/types/groups'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

export default function RejoindreGroupe() {
	const [group, setGroup] = useState<Group | null>(null)

	const [prenomLocalState, setPrenomLocalState] = useState('')
	const [errorPrenom, setErrorPrenom] = useState('')
	const [emailLocalState, setEmailLocalState] = useState('')

	const { groupId } = useParams()

	const { t } = useTranslation()

	const navigate = useNavigate()

	const dispatch = useDispatch()

	useEffect(() => {
		const handleFetchGroup = async () => {
			try {
				const response = await fetch(`${GROUP_URL}/${groupId}`)

				if (!response.ok) {
					throw new Error('Error while fetching group')
				}

				const group: Group = await response.json()

				setGroup(group)
			} catch (error) {
				console.error(error)
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

		if (!prenomLocalState) {
			setErrorPrenom(t('Ce champ est obligatoire'))
			return
		}

		try {
			const response = await fetch(`${GROUP_URL}/update`, {
				method: 'POST',
				body: JSON.stringify({
					_id: group._id,
					member: {
						name: prenomLocalState,
						email: emailLocalState,
					},
				}),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error('Error while updating group')
			}

			dispatch(addGroupToUser(group))

			navigate('../informations-de-groupe')
		} catch (error) {
			console.error(error)
		}
	}

	if (!group) {
		return <div>Loading...</div>
	}

	return (
		<div>
			<Title
				title={
					<Trans>
						{group?.owner?.name} vous a invité à rejoindre le groupe{' '}
						<span className="text-violet-800">{group?.name}</span>
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
				<Trans>Continuer</Trans> →
			</Button>
		</div>
	)
}
