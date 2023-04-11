import animate from 'Components/ui/animate'
import { useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { setStoredTrajets, updateSituation } from '../../../actions/actions'
import {
	getLangFromAbreviation,
	getLangInfos,
} from '../../../locales/translation'
import emoji from '../../emoji'
import { TrackerContext } from '../../utils/withTracker'
import KmHelpButton from '../estimate/KmHelp/KmHelpButton'
import KmForm from './KmForm'

interface Props {
	setFinalValue: (value: string) => void
	dottedName: string
	isFormOpen: boolean
	setIsFormOpen: (value: boolean) => void
}

const openmojis = {
	calendrier: '1F4C5',
	silhouette: '1F465',
	pointer: '1F447',
	modifier: '270F',
	supprimer: 'E262',
	aide: '2699',
	sauvegarder: '1F4BE',
}
const openmojiURL = (name) => `/images/${openmojis[name]}.svg`

export default function KmHelp({
	setFinalValue,
	dottedName,
	isFormOpen,
	setIsFormOpen,
}: Props) {
	const { t, i18n } = useTranslation()

	const tracker = useContext(TrackerContext)

	const dispatch = useDispatch()
	const storedTrajets = useSelector((state) => state.storedTrajets)

	const [isOpen, setIsOpen] = useState(false)

	const [trajets, setTrajets] = useState(storedTrajets[dottedName] || [])

	const [editFormData, setEditFormData] = useState({
		motif: '',
		label: '',
		distance: 0,
		xfois: '',
		periode: '',
		personnes: 0,
	})

	const [editTrajetId, setEditTrajetId] = useState(null)

	const firstRender = useRef(true)

	useEffect(
		() => {
			if (firstRender.current) {
				firstRender.current = false
				return
			}
			// setFinalValue(Math.round(+sum))
			dispatch(setStoredTrajets(dottedName, trajets))

			dispatch(updateSituation('transport . voiture . aide km', 'oui'))
		},
		[
			/*sum*/
		]
	)

	const formRef = useRef()

	const handleEditFormSubmit = (event) => {
		event.preventDefault()

		const formToCheck = formRef.current
		/*const isValidForm = formToCheck.checkValidity()
		if (!isValidForm) {
			// formToCheck.reportValidity()
		} else {
			const editedTrajet = { ...editFormData, id: editTrajetId }

			const newTrajets = [...trajets]

			const index = trajets.findIndex((trajet) => trajet.id === editTrajetId)

			newTrajets[index] = editedTrajet

			setTrajets(newTrajets)
			setEditTrajetId(null)
		}*/
	}

	const currentLangInfos = getLangInfos(getLangFromAbreviation(i18n.language))

	return (
		<div
			css={`
				text-align: right;
			`}
		>
			<KmHelpButton
				text={
					isFormOpen ? (
						<>{t('Fermer')}</>
					) : (
						<>
							{' '}
							<span
								css={`
									margin-right: 0.25rem;
								`}
							>
								{emoji('📅', 'Calendar')}
							</span>
							{t('Je souhaite répondre sur les 3 dernières années')}
						</>
					)
				}
				onHandleClick={
					isFormOpen
						? () => {
								setIsFormOpen(false)
								tracker.push([
									'trackEvent',
									'Aide saisie km',
									'Ferme aide à la saisie km voiture',
								])
						  }
						: () => {
								setIsFormOpen(true)
								setFinalValue('toto')
								tracker.push([
									'trackEvent',
									'Aide saisie km',
									'Ouvre aide à la saisie km voiture',
								])
						  }
				}
			/>
			{isFormOpen && (
				<animate.fromTop>
					<div
						className="ui__ card content"
						css={`
							margin-bottom: 1rem;
						`}
					>
						<KmForm
							trajets={trajets}
							setTrajets={setTrajets}
							openmojiURL={openmojiURL}
							tracker={tracker}
						/>
					</div>
				</animate.fromTop>
			)}
		</div>
	)
}
