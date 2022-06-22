import { motion } from 'framer-motion'
import emoji from 'react-easy-emoji'

export default function ({ backgroundColor, activeColor, value }) {
	const inhabitants = Math.round(1 / value)
	return (
		<div
			css={`
				margin-top: 1rem;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				svg {
					margin-top: 1rem;
					width: 80%;
					max-width: 20rem;
					height: auto;
				}
				svg {
				}
				position: relative;
			`}
		>
			<div
				css={`
					position: absolute;
					right: 2rem;
					top: 0rem;
				`}
			>
				<p>Votre part du logement</p>
				<img
					src="/images/thin-arrow-left.svg"
					aria-hidden
					title="Comprendre l'objectif à atteindre"
					css={`
						height: 3rem;

						filter: invert(1);
						transform: rotate(-10deg);
						position: absolute;
						right: 1rem;
					`}
				/>
			</div>
			<svg viewBox="5 70 200 160" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<clipPath id="maison">
						<path
							d="M37.375 211.392v-74.128l69.359-49.815 67.581 50.007.126 73.785z"
							fill="teal"
						/>
					</clipPath>
				</defs>
				<path
					d="M37.375 211.392v-74.128l69.359-49.815 67.581 50.007.126 73.785z"
					fill={backgroundColor}
				/>
				<motion.rect
					initial={{ height: 140 }}
					animate={{ height: 140 * value }}
					transition={{ ease: 'easeOut', duration: 1 }}
					width={140.293}
					height={101.689}
					x={35.692}
					y={85}
					ry={0.005}
					fill={activeColor}
					fillRule="evenodd"
					clip-path="url(#maison)"
				/>
				<motion.text
					transition={{ ease: 'easeOut', duration: 1, delay: 0.25 }}
					initial={false}
					x="110"
					animate={{ y: 70 + 120 * value }}
					dominant-baseline="middle"
					text-anchor="middle"
					fill="white"
				>
					1 / {inhabitants}
				</motion.text>
			</svg>
			<span title={inhabitants <= 1 ? 'habitant' : 'habitants'}>
				{emoji(inhabitants > 1 ? '👥' : '👤')}x{inhabitants}
			</span>
		</div>
	)
}
