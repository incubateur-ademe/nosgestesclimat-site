import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
import { usePersistingState } from '../../../components/utils/persistState'
import { generateFruitName, stringToColour } from './utils'

localStorage.log = 'y-webrtc'

export default (room, connectionType: 'p2p' | 'database') => {
	const conference = useSelector((state) => state.conference)

	const dispatch = useDispatch()
	const [rawElements, setElements] = useState([])
	const [users, setUsers] = useState([])

	const [username, setUsername] = usePersistingState('conferenceId', null)

	useEffect(() => {
		if (!username) setUsername(generateFruitName())
		return
	}, [username])

	useEffect(() => {
		if (!username || (!room && !conference)) return
		if (!conference) {
			const ydoc = new Y.Doc()
			const provider =
				connectionType === 'p2p'
					? new WebrtcProvider(room, ydoc, {})
					: new WebsocketProvider(
							'wss://nosgestesclimat-serveur.osc-fr1.scalingo.io', // Not used, was a test, replace by Survey.tsx mode
							room,
							ydoc
					  )

			provider.on('status', (event) => {
				console.log('YJS log status', event.status) // logs "connected" or "disconnected"
			})

			dispatch({ type: 'SET_CONFERENCE', room, ydoc, provider })
		} else {
			const { room } = conference

			const ydoc = conference.ydoc,
				provider = conference.provider

			const awareness = provider.awareness

			setUsers(Array.from(awareness.getStates().values()))

			// You can observe when a any user updated their awareness information
			awareness.on('change', (changes) => {
				// Whenever somebody updates their awareness information,
				// we log all awareness information from all users.
				setUsers(Array.from(awareness.getStates().values()))
			})

			awareness.setLocalState({
				// Define a print name that should be displayed
				name: username,
				// Define a color that should be associated to the user:
				color: stringToColour(username), // should be a hex color
			})
			const simulations = conference.ydoc.get('simulations', Y.Map)
			setElements(simulations.toJSON())
			simulations.observe((event) => {
				console.log('did observe from Conf', event)
				setElements(simulations.toJSON())
			})
		}
		return
	}, [room, conference])
	if (!room && !conference) return {}

	return { users, elements: rawElements, username, conference }
}
