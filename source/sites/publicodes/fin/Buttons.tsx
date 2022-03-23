import { TrackerContext } from 'Components/utils/withTracker'
import { motion } from 'framer-motion'
import { default as React, useContext } from 'react'
import { Link } from 'react-router-dom'
import { actionImg } from 'Components/SessionBar'
import { IframeOptionsContext } from 'Components/utils/IframeOptionsProvider'

export const ActionButton = ({ text, score }) => {
	const tracker = useContext(TrackerContext)

	return (
		<Link
			to="/actions"
			className="ui__ button plain"
			onClick={() =>
				tracker.push([
					'trackEvent',
					'NGC',
					'Clic bouton action page /fin',
					null,
					score,
				])
			}
			css={`
				margin: 0.6rem auto;
				width: 90%;

				img {
					height: 2.6rem;
					filter: invert(100%);
					margin: 0 0.6rem;
					display: inline-block;
				}
				a {
					color: var(--textColor);
					text-decoration: none;
				}
			`}
		>
			<div
				css={`
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100%;
				`}
			>
				<motion.div
					aria-hidden="true"
					animate={{
						rotate: [0, 15, -15, 0],
						y: [0, 0, 0, -3, 8, 3],
					}}
					transition={{ duration: 2, delay: 4 }}
				>
					<img src={actionImg} />
				</motion.div>
				{text}
			</div>
		</Link>
	)
}

export const IntegratorActionButton = () => {
	const { integratorLogo, integratorActionUrl, integratorActionText } =
		useContext(IframeOptionsContext)

	return (
		<a
			href={integratorActionUrl}
			className="ui__ button plain"
			target="_blank"
			css={`
				margin: 0.6rem auto 1rem;
				width: 90%;
				img {
					transform: scaleX(-1);
					height: 2rem;
					margin: 0 0.6rem;
					display: inline-block;
				}
				a {
					color: var(--textColor);
					text-decoration: none;
				}
			`}
		>
			<div
				css={`
					display: flex;
					justify-content: center;
					align-items: center;
					@media (max-width: 800px) {
						flex-direction: column-reverse;
						img {
							display: none;
						}
					}
				`}
			>
				{integratorActionText}
				<img src={integratorLogo} />
			</div>
		</a>
	)
}
