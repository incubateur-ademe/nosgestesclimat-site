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
					⚠️ Votre nom de salle est court, il y a un petit risque que des
					inconnus puissent le deviner
				</p>
			)}
			{newRoom && showInvalidMessage && (
				<p>
					⚠️ Votre nom de salle ne peut pas contenir les caractères suivants :{' '}
					{specialCharaters.toString()}
				</p>
			)}
		</>
	)
}
