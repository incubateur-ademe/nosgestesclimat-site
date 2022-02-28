import { usePersistingState } from 'Components/utils/persistState'
import QRCode from 'qrcode.react'
import { useContext, useEffect, useRef, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
import { conferenceImg } from '../../../components/SessionBar'
import ShareButton from '../../../components/ShareButton'
import { ThemeColorsContext } from '../../../components/utils/colors'
import { ScrollToTop } from '../../../components/utils/Scroll'
import Instructions from './Instructions'
import Stats from './Stats'
import { UserList, UserBlock } from './UserList'
import useYjs from './useYjs'
import {
	extremeThreshold,
	filterExtremes,
	generateRoomName,
	getExtremes,
	getRandomInt,
	stringToColour,
} from './utils'

export const ConferenceTitle = styled.h2`
	margin-top: 0.6rem;
	@media (min-width: 800px) {
		display: none;
	}
	> img {
		width: 4rem;
	}
	display: flex;
	align-items: center;
	font-size: 120%;
`

export default () => {
	const { room } = useParams()
	const { elements, extremes, users, username } = useYjs(room, 'p2p')
	const dispatch = useDispatch()
	const history = useHistory()

	return (
		<div>
			{room && <ScrollToTop />}
			<h1>Conférence</h1>
			<ConferenceTitle>
				<img src={conferenceImg} />
				<span css="text-transform: uppercase">«&nbsp;{room}&nbsp;»</span>
			</ConferenceTitle>
			<Stats
				{...{
					elements: Object.entries(elements).map(([username, data]) => ({
						...data,
						username,
					})),
					users,
					username,
				}}
			/>

			{room && (
				<div>
					<UserBlock {...{ users, extremes, username, room }} />
				</div>
			)}
			<button
				className="ui__ link-button"
				onClick={() => {
					history.push('/')

					dispatch({ type: 'UNSET_CONFERENCE' })
				}}
			>
				{emoji('🚪')} Quitter la conférence
			</button>
			<Instructions {...{ room, started: true }} />
			<h2>Et mes données ?</h2>
			<p>
				{emoji('🕵 ')}En participant, vous acceptez de partager vos résultats
				agrégés de simulation avec les autres participants de la conférence : le
				total et les catégories (transport, logement, etc.). En revanche, nos
				serveurs ne les stockent pas : cela fonctionne en P2P (pair à pair).
			</p>
			<p>
				Seul le nom de la salle de conférence sera indexé dans{' '}
				<a href="https://nosgestesclimat.fr/vie-privée">
					les statistiques d'utilisation
				</a>{' '}
				de Nos Gestes Climat.{' '}
			</p>
		</div>
	)
}
