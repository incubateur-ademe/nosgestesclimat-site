import animate from '@/components/ui/animate'
import { answeredQuestionsSelector } from '@/selectors/simulationSelectors'
import { useEffect, useState } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default () => {
	const answers = useSelector(answeredQuestionsSelector),
		show = answers.length > 0 // we don't want to bother the user on the first question of the experience, he has the app to discover
	// there is a small risk that the user could not answer the first question before seing this banner...
	// but the page is also accessible from the home
	// and let's not bother everyone for < 1% of our users (facts from the stats of help messages before this commit)

	const [visible, setVisible] = useState(false)

	useEffect(() => {
		show && setTimeout(() => setVisible(true), 8000)
	}, [show])

	if (!show || !visible) {
		return null
	}

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
				<Link to={'/questions-frequentes?fromLocation=' + window.location}>
					<Trans>Découvrez la FAQ !</Trans>
				</Link>
			</div>
		</animate.appear>
	)
}
