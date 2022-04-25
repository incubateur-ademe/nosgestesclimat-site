import { motion } from 'framer-motion'
import { useState } from 'react'
import CircledEmojis from 'Components/CircledEmojis'
import { findContrastedTextColor } from 'Components/utils/colors'

export default ({
	nodeValue,
	total,
	icons,
	color,
	title,
	hideSmallerThanPercentage,
	key,
	delay = 0,
}) => {
	const [clicked, click] = useState(false)
	const percent = (nodeValue / total) * 100
	if (hideSmallerThanPercentage && percent < hideSmallerThanPercentage)
		return null // will be unreadable

	return (
		<motion.li
			initial={{ opacity: 0 }}
			animate={{ opacity: 1, width: `calc(${percent}% - 0px)` }}
			exit={{ width: 0, opacity: 0 }}
			transition={{ duration: 0.5, delay }}
			key={key}
			css={`
				border-right: 2px solid var(--lighterColor);
				background: ${color};
				cursor: pointer;
			`}
			title={title}
			onClick={() => click(!clicked)}
		>
			{clicked ? (
				<span
					key={title}
					css={`
						color: ${findContrastedTextColor(color, true)};
					`}
				>
					{title}
				</span>
			) : (
				<CircledEmojis emojis={icons} emojiTitle={title} />
			)}
		</motion.li>
	)
}
