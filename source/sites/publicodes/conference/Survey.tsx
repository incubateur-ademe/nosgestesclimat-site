import { usePersistingState } from 'Components/utils/persistState'
import QRCode from 'qrcode.react'
import { useContext, useEffect, useRef, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
import { conferenceImg } from '../../../components/SessionBar'
import ShareButton from '../../../components/ShareButton'
import { ThemeColorsContext } from '../../../components/utils/colors'
import { ScrollToTop } from '../../../components/utils/Scroll'
import Stats from './Stats'
import UserList from './UserList'
import useYjs from './useYjs'
import {
	extremeThreshold,
	filterExtremes,
	generateRoomName,
	getExtremes,
	getRandomInt,
	stringToColour,
} from './utils'
import IllustratedMessage from '../../../components/ui/IllustratedMessage'
import useDatabase from './useDatabase'

export default () => {
	const survey = useSelector((state) => state.survey)
	const history = useHistory()
	const dispatch = useDispatch()
	const { room } = useParams()
	if (!survey)
		return (
			<IllustratedMessage
				emoji="🕵️📊"
				message={
					<div>
						<p>
							Vous avez été invités à un sondage Nos Gestes Climat.
							Acceptez-vous que vos données de simulation soit collectées
							anonymement pour les besoins de ce sondage <em>{room}</em>?
							<p>
								EXPLIQUER SIMPLEMENT QUELLES DONNEES ET UN LIEN VERS LA PAGE QUI
								EXPLIQUE TOUT
							</p>
						</p>{' '}
						<button
							className="ui__ button simple"
							onClick={() => {
								dispatch({ type: 'SET_SURVEY', room })
							}}
						>
							Lancer le sondage
						</button>
						<button
							className="ui__ button simple"
							onClick={() => history.push('/')}
						>
							Non
						</button>
					</div>
				}
			/>
		)
	return <Supa room={survey.room} />
}

const Supa = ({ room }) => {
	const database = useDatabase()
	const [data, setData] = useState([])
	console.log('DATA', data)
	useEffect(async () => {
		let { data: requestData, error } = await database
			.from('réponses')
			.select('data,id')

		if (!error) setData(requestData)

		database
			.from('réponses:sondage=eq.' + room)
			.on('UPDATE', (payload) => {
				if (payload.new) {
					setData((data) =>
						data.map((el) => (el.id === payload.new.id ? payload.new : el))
					)
				}
			})
			.on('INSERT', (payload) => {
				if (payload.new) {
					setData((data) => [...data, payload.new])
				}
			})
			.subscribe()
	}, [])

	return (
		data.length != null && (
			<Stats
				{...{
					elements: data.reduce(
						(memo, next) => ({ ...memo, [next.id]: next.data }),
						{}
					),
				}}
			/>
		)
	)
}
