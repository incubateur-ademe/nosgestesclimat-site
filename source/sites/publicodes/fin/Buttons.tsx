import { TrackerContext } from 'Components/utils/withTracker'
import { motion } from 'framer-motion'
import { default as React, useContext } from 'react'
import { Link } from 'react-router-dom'
import { actionImg } from 'Components/SessionBar'
import { IframeOptionsContext } from 'Components/utils/IframeOptionsProvider'

export const ActionButton = ({
	text,
	score,
	imgSrc = actionImg,
	invertImage = true,
	url = '/actions',
	large,
}) => {
	const tracker = useContext(TrackerContext)

	return (
		<Link
			to={url}
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
				${large && 'width: 90%;'}
				img {
					height: ${large ? '2.6rem' : '1.6rem'};
					filter: ${invertImage ? 'invert(100%)' : 'none'};
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
					<img src={imgSrc} />
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
