import CircledEmojis from 'Components/CircledEmojis'
import { findContrastedTextColor } from 'Components/utils/colors'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router'
import { useNavigate } from 'react-router-dom'
import TriangleShape from './TriangleShape'

export default ({
	nodeValue,
	total,
	icons,
	color,
	title,
	delay = 0,
	indicator,
	filterSimulationOnClick,
	dottedName,
	click,
	clicked,
}) => {
	const { pathname } = useLocation(),
		navigate = useNavigate()
	const percent = (nodeValue / total) * 100

	return (
		<motion.li
			initial={{ opacity: 0, width: 0 }}
			animate={{ opacity: 1, width: `calc(${percent}% - 0px)` }}
			exit={{ width: 0, opacity: 0 }}
			transition={{ duration: 0.5, delay }}
			css={`
				border-right: 2px solid var(--lighterColor);
				background: ${color};
				cursor: pointer;
				position: relative;
			`}
			title={title}
			onClick={() =>
				filterSimulationOnClick
					? navigate(`${pathname}?catégorie=${dottedName}`)
					: click(dottedName)
			}
		>
			{indicator && (
				<div
					css={`
						svg {
							width: 1rem;
							height: 1rem;
						}
						position: absolute;
						left: 50%;
						transform: translateX(-50%);
						top: -1.2rem;
					`}
				>
					<TriangleShape color={color} />
				</div>
			)}
			{clicked ? (
				<span
					key={title}
					css={`
						color: ${findContrastedTextColor(color, true)};
						display: flex;
						flex-direction: column;
						align-items: center;
					`}
				>
					<CircledEmojis emojis={icons} />
					<div>{title}</div>
					<div>{Math.round((nodeValue / total) * 100)}&nbsp;%</div>
				</span>
			) : (
				<CircledEmojis emojis={icons} emojiTitle={title} />
			)}
		</motion.li>
	)
}
