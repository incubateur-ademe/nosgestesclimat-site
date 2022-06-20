import { extractCategories } from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import { motion } from 'framer-motion'
import React, { useRef, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import {
	objectifsSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import { getSubcategories } from '../../../components/publicodesUtils'
import useMediaQuery from '../../../components/utils/useMediaQuery'
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
	const tall = useMediaQuery('(min-height: 900px)'),
		medium = useMediaQuery('(min-height: 700px)')

	const total = engine.evaluate('bilan').nodeValue,
		gridLength = tall ? 100 : medium ? 70 : 50,
		pixelRemSize = 3,
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

	const constraintsRef = useRef(null)

	return (
		<motion.section
			css={`
				padding: 0;
				position: relative;
			`}
			ref={constraintsRef}
		>
			<SquaresGrid
				pixelRemSize={pixelRemSize}
				elements={allSubCategories}
				pixel={pixel}
			/>
			<motion.div
				drag="y"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ ease: 'easeIn', duration: 1.6, delay: 3 }}
				dragConstraints={constraintsRef}
				whileDrag={{ scale: 1.05, opacity: 0.7 }} // does not work with the animation :/
				css={`
					cursor: grab;
					height: ${((2000 / pixel) * pixelRemSize) / 10 + 0.5}rem;
					min-height: 5.5rem; /*We focus on orders of magnitude, not perfect pixels*/
					width: 95%;
					border: 6px dashed black;
					background: linear-gradient(#78e08f 50%, #78e08fcf 100%);
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					margin: 0 auto;
					position: absolute;
					left: 2%;
					z-index: 100;
					color: black;
					bottom: 0;
				`}
			>
				<p css="font-size: 180%">{emoji('🎯')} 2 tonnes</p>
				<p>
					Une case {emoji('🔲')} = {Math.round(pixel)} kg de CO₂e.
				</p>
			</motion.div>
		</motion.section>
	)
}
const DashedHalfLine = styled.span`
	border-bottom: 6px dashed black;
	width: calc(40% - 12rem / 2);
`
