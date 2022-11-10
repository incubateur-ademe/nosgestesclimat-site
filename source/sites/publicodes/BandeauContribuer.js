import animate from 'Components/ui/animate'
import { useEffect, useState } from 'react'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

export default () => {
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		setTimeout(() => setVisible(true), 4000)
	}, [])

	return (
		visible && (
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
	)
}
