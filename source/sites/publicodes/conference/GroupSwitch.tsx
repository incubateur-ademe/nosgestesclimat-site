import { useState } from 'react'
import { useParams } from 'react-router'
import Beta from './Beta'
import Instructions from './Instructions'
import {
	extremeThreshold,
	filterExtremes,
	generateRoomName,
	getExtremes,
	getRandomInt,
	stringToColour,
} from './utils'

export default () => {
	const [newRoom, setNewRoom] = useState(generateRoomName())
	const { room } = useParams()
	return (
		<div>
			<h1>
				Mode groupe <Beta />
			</h1>

			<Instructions {...{ room, newRoom, setNewRoom }} />
		</div>
	)
}
