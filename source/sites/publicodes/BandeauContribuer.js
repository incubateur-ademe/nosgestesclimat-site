import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import animate from 'Components/ui/animate'
import { Trans } from 'react-i18next'

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
				<span>
					<Trans>Une question, un problème ?</Trans>
				</span>
				<Link to={'/contribuer?fromLocation=' + window.location}>
					<Trans>Découvrez la FAQ !</Trans>
				</Link>
			</div>
		</animate.appear>
	)
}
