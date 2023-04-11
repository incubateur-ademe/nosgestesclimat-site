import animate from 'Components/ui/animate'
import { useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { updateSituation } from '../../../actions/actions'
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
	const { t } = useTranslation()

	const tracker = useContext(TrackerContext)

	const dispatch = useDispatch()

	const storedAmortissementAvion = useSelector(
		(state) => state.storedAmortissementAvion
	)

	const [amortissementAvion, setAmortissementAvion] = useState(
		storedAmortissementAvion || {}
	)

	const firstRender = useRef(true)

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false
			return
		}

		// Set default value
		// dispatch(setAmortissementAvion(storedAmortissementAvion))

		dispatch(updateSituation('transport . avion . aide km', 'oui'))
	}, [])

	const formRef = useRef()

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
							amortissementAvion={amortissementAvion}
							setAmortissementAvion={(amortissementObject) => {
								setAmortissementAvion(amortissementObject)
								setFinalValue(
									String(
										Object.entries(amortissementAvion).reduce(
											(sum, [key, value]) =>
												sum + (parseInt(value || '0', 10) || 0),
											0
										) / 3
									)
								)
							}}
						/>
					</div>
				</animate.fromTop>
			)}
		</div>
	)
}
