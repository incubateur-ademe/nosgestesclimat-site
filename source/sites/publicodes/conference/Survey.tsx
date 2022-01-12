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
import { ConferenceTitle } from './Conference'
import DataWarning from './DataWarning'
import Instructions from './Instructions'

export default () => {
	const survey = useSelector((state) => state.survey)
	const history = useHistory()
	const dispatch = useDispatch()
	const { room } = useParams()

	return (
		<div>
			<h1>Sondage</h1>
			<ConferenceTitle>
				<img src={conferenceImg} />
				<span css="text-transform: uppercase">«&nbsp;{room}&nbsp;»</span>
			</ConferenceTitle>

			{!survey ? <DataWarning room={room} /> : <Supa room={survey.room} />}
			<Instructions {...{ room }} />
		</div>
	)
}

const Supa = ({ room }) => {
	const database = useDatabase()
	const [data, setData] = useState([])
	console.log('DATA', data)
	useEffect(async () => {
		let { data: requestData, error } = await database
			.from('réponses')
			.select('data,id')
			.eq('sondage', room)

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
