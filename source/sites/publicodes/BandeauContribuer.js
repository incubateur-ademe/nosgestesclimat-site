import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import animate from 'Components/ui/animate'

export default () => {
	const [visible, setVisible] = useState(false)
	useEffect(() => {
		setTimeout(() => setVisible(true), 5000)
	}, [])
	if (!visible) return null
	return (
		<animate.appear>
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
		</animate.appear>
	)
}
