import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { groupTooSmallCategories } from './chartUtils'
import SubCategoryBar from './SubCategoryBar'

const shadowStyle =
	'box-shadow: 0px 2px 4px -1px var(--lighterColor), 0px 4px 5px 0px var(--lighterColor), 0px 1px 10px 0px var(--lighterColor)'

export default ({
	color: uniqueColor,
	categories,
	delay,
	indicator,
	questionCategory,
	filterSimulationOnClick,
	onRestClick,
}) => {
	const [clicked, setClick] = useState(false),
		click = (dottedName) => (clicked ? setClick(null) : setClick(dottedName))

	const { rest, restWidth, bigEnough, total } =
		groupTooSmallCategories(categories)

	const { t } = useTranslation()

	return (
		<InlineBarChart clicked={clicked}>
			<AnimatePresence>
				{bigEnough.map(({ nodeValue, title, icons, color, dottedName }) => (
					<SubCategoryBar
						{...{
							key: dottedName,
							nodeValue,
							dottedName,
							title,
							icons,
							total,
							color: uniqueColor || color,
							delay,
							click,
							clicked,
							filterSimulationOnClick,
							indicator:
								indicator &&
								questionCategory &&
								questionCategory.dottedName === dottedName,
						}}
					/>
				))}
				<motion.li
					initial={{ width: 0, opacity: 0 }}
					animate={{ opacity: 1, width: `${restWidth}%` }}
					exit={{ width: 0, opacity: 0 }}
					transition={{ duration: 0.5, delay }}
					title={
						(onRestClick ? t('Voir le reste : ') : t('Le reste : ')) +
						rest.labels.join(', ')
					}
					key="rest"
					onClick={onRestClick}
					css={`
						${onRestClick &&
						`
						cursor: pointer;`}
						${uniqueColor
							? `background: ${uniqueColor}; color: white`
							: `background:white; color: #666`};
						font-size: 200%;
						div {
							height: 100%;
							line-height: 0.2rem;
						}
					`}
				>
					{restWidth > 5 && <div>...</div>}
				</motion.li>
			</AnimatePresence>
		</InlineBarChart>
	)
}

export const InlineBarChart = styled.ul`
	width: 100%;
	border-radius: 0.4rem;
	padding-left: 0;
	margin: 0;
	display: flex;
	${shadowStyle};
	li {
		display: inline-block;
		text-align: center;
		list-style-type: none;
		height: ${(props) => (props.clicked ? `5rem` : `1.9rem`)};
		line-height: 1.4rem;
	}

	li:last-child {
		border-right: none;
	}
`
