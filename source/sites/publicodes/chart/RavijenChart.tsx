import { extractCategories } from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import { range } from 'ramda'
import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router'
import {
	objectifsSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'
import CircledEmojis from '../../../components/CircledEmojis'
import { getSubcategories } from '../../../components/publicodesUtils'
import CategoryVisualisation from '../CategoryVisualisation'
import SubCategoriesChart from './SubCategoriesChart'

export default ({
	details,
	noText,
	noCompletion,
	valueColor,
	linkTo,
	demoMode,
	noAnimation,
}) => {
	// needed for this component to refresh on situation change :
	const situation = useSelector(situationSelector)
	const objectifs = useSelector(objectifsSelector)
	const rules = useSelector((state) => state.rules)
	const engine = useEngine(objectifs)

	const total = engine.evaluate('bilan').nodeValue,
		width = 10,
		height = 10,
		pixelRemSize = 3,
		gridLength = width * height,
		pixel = total / gridLength
	const categories = extractCategories(rules, engine, details).map(
		(category) => ({
			...category,
			abbreviation: rules[category.dottedName].abbréviation,
		})
	)

	if (!categories) return null

	const allSubCategories = categories
		.map((category) =>
			getSubcategories(rules, category, engine).map((el) => ({
				...el,
				topCategoryColor: category.color,
				topCategoryTitle: category.title,
			}))
		)
		.flat()

	return (
		<section css={``}>
			<ul
				css={`
					display: flex;
					justify-content: start;
					flex-wrap: wrap;
					width: ${width * pixelRemSize}rem;
					margin: 0 auto;
					li {
						list-style-type: none;
						width: ${pixelRemSize}rem;
						height: ${pixelRemSize}rem;
						box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 8px 0px;
						display: flex;
						justify-content: center;
						align-items: center;
						line-height: 1.4rem;
						font-size: 90%;
					}
				`}
			>
				{allSubCategories.map((element) => {
					const length = Math.round(element.nodeValue / pixel)
					return range(1, length).map((i) => (
						<li
							title={`${element.title} (${element.topCategoryTitle})`}
							css={`
								background: ${element.topCategoryColor};
							`}
						>
							{true && (
								<CircledEmojis
									emojis={element.icons}
									emojiBackground={'transparent'}
								/>
							)}
						</li>
					))
				})}
			</ul>
		</section>
	)
}
