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
import Parse from 'parse'

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
			{survey && (
				<button
					className="ui__ link-button"
					onClick={() => {
						history.push('/')

						dispatch({ type: 'UNSET_SURVEY' })
					}}
				>
					{emoji('🚪')} Quitter le sondage
				</button>
			)}
			<Instructions {...{ room }} />
		</div>
	)
}

const Supa = ({ room }) => {
	const survey = useSelector((state) => state.survey)
	const elements = survey.answers
	if (!elements || !Object.values(elements)) return null

	return <Stats elements={elements} />
}
