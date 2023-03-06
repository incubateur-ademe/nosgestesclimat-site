import { useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import emoji from '../../../components/emoji'
import { generateRoomName } from './utils'

export default ({ newRoom, setNewRoom }) => {
	const inputRef = useRef(null)
	const [showInvalidMessage, setShowInvalidMessage] = useState(true)
	const specialCharaters = /[\s!@#$%&*()+\=\[\]{};':"\\|,.<>\/?]+/
	const { t } = useTranslation()

	return (
		<>
			<form>
				<label title={t('Nom de la salle')}>
					<input
						value={newRoom}
						className="ui__"
						// With the next function, we make sure there is no special characters in the room name to avoid problems with getParams() function.
						onChange={(e) => {
							if (specialCharaters.test(e.target.value)) {
								setShowInvalidMessage(true)
								e.target.value.replace(specialCharaters, '')
							} else {
								setShowInvalidMessage(false)
								setNewRoom(e.target.value)
							}
						}}
						css="width: 80% !important"
						ref={inputRef}
					/>
				</label>
				<button
					onClick={(e) => {
						setNewRoom('')
						inputRef.current.focus()
						e.preventDefault()
					}}
					title={t('Effacer le nom actuel')}
				>
					{emoji('❌')}
				</button>
			</form>

			<button
				css="margin-bottom:.4rem !important"
				onClick={() => setNewRoom(generateRoomName())}
				className="ui__ dashed-button"
			>
				{t('🔃 Générer un autre nom')}
			</button>
			{newRoom && newRoom.length < 12 && (
				<p>
					<Trans i18nKey={`publicodes.conference.NamingBlock.nomSalleCourt`}>
						⚠️ Votre nom de salle est court, il y a un petit risque que des
						inconnus puissent le deviner
					</Trans>
				</p>
			)}
			{newRoom && showInvalidMessage && (
				<p>
					<Trans
						i18nKey={`publicodes.conference.NamingBlock.nomSalleDoitContenirDesLettres`}
					>
						💡 Votre nom de salle ne peut que contenir des lettres, des chiffres
						et des tirets
					</Trans>
				</p>
			)}
		</>
	)
}
