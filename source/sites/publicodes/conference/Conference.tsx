import { useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Navigate, useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { conferenceImg } from '../../../components/SessionBar'
import Meta from '../../../components/utils/Meta'
import { ScrollToTop } from '../../../components/utils/Scroll'
import Instructions from './Instructions'
import Stats from './Stats'
import { UserBlock } from './UserList'
import useYjs from './useYjs'
import { defaultThreshold, getExtremes } from './utils'

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
	const { elements, users, username } = useYjs(room, 'p2p')

	const [threshold, setThreshold] = useState(defaultThreshold)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	if (!room || room === '') {
		return <Navigate to="/groupe" replace />
	}
	const extremes = getExtremes(elements, threshold)

	const { t } = useTranslation()

	return (
		<div>
			<Meta
				title={t('Conférence') + ' ' + room}
				description={
					t('Participez à la conférence') +
					' ' +
					room +
					' ' +
					t('et visualisez les résultats du groupe')
				}
			/>
			{room && <ScrollToTop />}
			<h1>
				<Trans>Conférence</Trans>
			</h1>
			<ConferenceTitle>
				<img src={conferenceImg} alt="" />
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
					threshold,
					setThreshold,
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
					navigate('/')

					dispatch({ type: 'UNSET_CONFERENCE' })
				}}
			>
				{t('🚪 Quitter la conférence')}
			</button>
			<Instructions {...{ room, started: true }} />
			<h2>
				<Trans>Et mes données ?</Trans>
			</h2>{' '}
			{emoji('🕵 ')}
			<Trans i18nKey={'publicodes.conference.Conference.donnéesExplications'}>
				<p>
					En participant, vous acceptez de partager vos résultats agrégés de
					simulation avec les autres participants de la conférence : le total et
					les catégories (transport, logement, etc.). En revanche, nos serveurs
					ne les stockent pas : cela fonctionne en P2P (pair à pair).
				</p>
				<p>
					Seul le nom de la salle de conférence sera indexé dans{' '}
					<a href="https://nosgestesclimat.fr/vie-privée">
						les statistiques d'utilisation
					</a>{' '}
					de Nos Gestes Climat.{' '}
				</p>
			</Trans>
		</div>
	)
}
