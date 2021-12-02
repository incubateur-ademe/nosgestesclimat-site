import React from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'

export default () => {
	return (
		<div css=" display: flex; flex-wrap: wrap; justify-content: center;text-align: center; color: black; margin: 2rem 0">
			<span>Une question, un problème ? {emoji('📮')} </span>
			<Link to={'/contribuer?fromLocation=' + window.location}>
				Faites-nous un retour !
			</Link>
		</div>
	)
}
