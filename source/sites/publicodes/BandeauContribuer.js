import React from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'

export default () => {
	return (
		<div css=" text-align: center; color: black; margin: 2rem 0">
			Une question, un problème ? {emoji('📮')}{' '}
			<Link to={'/contribuer?fromLocation=' + window.location}>
				Faites-nous un retour !
			</Link>
		</div>
	)
}
