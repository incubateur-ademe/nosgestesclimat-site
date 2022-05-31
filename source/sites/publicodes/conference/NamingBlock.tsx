import { useRef, useState } from 'react'
import emoji from '../../../components/emoji'
import { generateRoomName } from './utils'

export default ({ newRoom, setNewRoom }) => {
	const inputRef = useRef(null)
	const [showInvalidMessage, setShowInvalidMessage] = useState(true)
	const specialCharaters = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]+/
	return (
		<>
			<label>
				<form>
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
					<button
						onClick={(e) => {
							setNewRoom('')
							inputRef.current.focus()
							e.preventDefault()
						}}
						title="Effacer le nom actuel"
					>
						{emoji('❌')}
					</button>
				</form>
			</label>

			<button
				onClick={() => setNewRoom(generateRoomName())}
				className="ui__ dashed-button"
			>
				{emoji('🔃')} Générer un autre nom
			</button>
			{newRoom && newRoom.length < 12 && (
				<p>
					{emoji('⚠️')} Votre nom de salle est court, il y a un petit risque que
					des inconnus puissent le deviner
				</p>
			)}
			{newRoom && showInvalidMessage && (
				<p>
					{emoji('💡')} Votre nom de salle ne peut que contenir des lettres, des
					chifffres et des tirets
				</p>
			)}
		</>
	)
}
