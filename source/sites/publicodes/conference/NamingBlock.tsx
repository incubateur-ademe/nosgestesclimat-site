import { useRef } from 'react'
import emoji from '../../../components/emoji'
import { generateRoomName } from './utils'

export default ({ newRoom, setNewRoom }) => {
	const inputRef = useRef(null)
	return (
		<>
			<label>
				<form>
					<input
						value={newRoom}
						className="ui__"
						onChange={(e) => setNewRoom(e.target.value)}
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
		</>
	)
}
