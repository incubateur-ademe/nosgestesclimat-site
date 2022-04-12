import React from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'

export default () => {
	return (
		<div
			css={`
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				text-align: center;
				color: black;
				margin: 2rem auto;
				max-width: 16rem;
				line-height: 1.3rem;
				background: var(--lightestColor);
				border-radius: 1rem;
				padding: 0.4rem;
			`}
		>
			<span>Une question, un problème ? </span>
			<Link to={'/contribuer?fromLocation=' + window.location}>
				Découvrez la FAQ !
			</Link>
		</div>
	)
}
