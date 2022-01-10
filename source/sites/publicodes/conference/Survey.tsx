import { usePersistingState } from 'Components/utils/persistState'
import QRCode from 'qrcode.react'
import { useContext, useEffect, useRef, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router'
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

console.log(SUPABASE_URL, SUPABASE_ANON_KEY)

const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const useDatabase = ({}) => {
	return { elements: [{}], username: 'bob' }
}

export default () => {
	return (
		<Provider value={client}>
			<Supa />
		</Provider>
	)
}

const Supa = ({}) => {
	const [data, setData] = useState([])
	useEffect(async () => {
		let { data: sondages, error } = await client.from('sondages').select('name')

		if (!error) setData(sondages)
	}, [])

	return data.length && JSON.stringify(data)
}
