import { motion } from 'framer-motion'

export default function ({ backgroundColor, activeColor, value }) {
	return (
		<svg
			width="210mm"
			height="200mm"
			viewBox="0 0 210 297"
			xmlns="http://www.w3.org/2000/svg"
		>
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
				transition={{ ease: 'easeOut', duration: 2 }}
				width={140.293}
				height={101.689}
				x={35.692}
				y={85}
				ry={0.005}
				fill={activeColor}
				fillRule="evenodd"
				clip-path="url(#maison)"
			/>
			<text
				x={110}
				y={70 + 140 * value}
				dominant-baseline="middle"
				text-anchor="middle"
				fill="white"
			>
				{Math.round(value * 100)} %
			</text>
		</svg>
	)
}
