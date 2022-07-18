import { useState } from 'react'
import { useParams } from 'react-router'
import Beta from './Beta'
import Instructions from './Instructions'
import { generateRoomName } from './utils'
import Meta from '../../../components/utils/Meta'

export default () => {
	const [newRoom, setNewRoom] = useState(generateRoomName())
	return (
		<div>
			<Meta
				title="Mode groupe"
				description="Faites le test à plusieurs via le mode conférence ou sondage"
			/>
			<h1>
				Mode groupe <Beta />
			</h1>

			<Instructions {...{ newRoom, setNewRoom }} />
		</div>
	)
}
