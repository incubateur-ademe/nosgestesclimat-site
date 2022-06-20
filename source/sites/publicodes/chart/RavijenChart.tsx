import { extractCategories } from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import React from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import {
	objectifsSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import { getSubcategories } from '../../../components/publicodesUtils'
import { sustainableLifeGoal } from '../fin/ClimateTargetChart'
import SquaresGrid from './SquaresGrid'

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
	 *  In any case, there should be 10 * 10 * pixel, pixel being fixed visual width
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
		.sort((a, b) => (a.dottedName === 'services publics' ? 1 : -1))
		.map((category) =>
			getSubcategories(rules, category, engine).map((el) => ({
				...el,
				topCategoryColor: category.color,
				topCategoryTitle: category.title,
			}))
		)
		.flat()

	const { lower, higher } = allSubCategories
		.slice()
		.reverse()
		.reduce(
			(memo, next) => {
				const count = memo.count + next.nodeValue,
					lower =
						count > sustainableLifeGoal ? memo.lower : [...memo.lower, next],
					higher =
						count <= sustainableLifeGoal ? memo.higher : [...memo.higher, next]
				return { lower, higher, count }
			},
			{ lower: [], higher: [], count: 0 }
		)

	return (
		<section
			css={`
				padding: 0;
			`}
		>
			<SquaresGrid
				pixelRemSize={pixelRemSize}
				elements={higher.slice().reverse()}
				pixel={pixel}
			/>
			<p
				css={`
					display: flex;
					align-items: center;
					justify-content: center;

					margin: 0.6rem 0;
				`}
			>
				<DashedHalfLine />
				<span css="width: 12rem; text-align: center">2 tonnes</span>
				<DashedHalfLine />
			</p>
			<SquaresGrid
				pixelRemSize={pixelRemSize}
				elements={lower.slice().reverse()}
				pixel={pixel}
			/>
			<p
				css={`
					margin-top: 2rem;
					text-align: center;
				`}
			>
				Une case {emoji('🔲')} = {Math.round(pixel)} kg de CO₂e.
			</p>
		</section>
	)
}
const DashedHalfLine = styled.span`
	border-bottom: 6px dashed black;
	width: calc(40% - 12rem / 2);
`
