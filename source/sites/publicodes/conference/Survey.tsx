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
import { createClient } from '@supabase/supabase-js'
import IllustratedMessage from '../../../components/ui/IllustratedMessage'

console.log(SUPABASE_URL, SUPABASE_ANON_KEY)

const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const useDatabase = ({}) => {
	return { elements: [{}], username: 'bob' }
}

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
	return <Supa />
}

const Supa = ({}) => {
	const [data, setData] = useState([])
	useEffect(async () => {
		let { data: sondages, error } = await client.from('sondages').select('name')

		if (!error) setData(sondages)
	}, [])

	return data.length && JSON.stringify(data)
}
