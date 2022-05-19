import { extractCategories } from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import { range } from 'ramda'
import React from 'react'
import { useSelector } from 'react-redux'
import emoji from 'react-easy-emoji'
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

	/*  If total = 15 t, pixel = 150 kg
	 *  if total = 4 t, pixel = 40 kg
	 *  In any case, there is 10 * 10 * pixel, pixel being fixed visual width
	 *
	 * */

	console.log(total, pixel)

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
					padding: 0;
					display: flex;
					justify-content: start;
					flex-wrap: wrap;
					width: 100%;
					@media (min-width: 800px) {
						width: 95%;
					}
					margin: 0 auto;
					/* The grid will not be centered horizontally. This may be achieved via CSS grids, but it took me more than 15 minutes to not figure out how to do it 
					 * Another interesting layout would be a snake layout, but it's not simple either : 
					 * https://stackoverflow.com/questions/59481712/flexbox-reverse-direction-on-wrap-snake-wrap
					 * */

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
					/* This math.round creates the override of the grid by a few items,
					 * making it not 10x10 but e.g. 10x10 + 3 */
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
			<p
				css={`
					margin-top: 2rem;
				`}
			>
				Une case {emoji('🔲')} = {Math.round(pixel)} kg de CO₂e.
			</p>
		</section>
	)
}
