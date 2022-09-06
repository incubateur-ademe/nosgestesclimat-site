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
import { getSubcategories, relegate } from '../../../components/publicodesUtils'
import useMediaQuery from '../../../components/utils/useMediaQuery'
import { ObjectiveExplanation } from '../fin/ClimateTargetChart'
import SquaresGrid from './SquaresGrid'

// This component is named in the honor of http://ravijen.fr/?p=440
// But it's complicated to display this chart on mobile phones. Also its visual complexity is more adapted to engineers.

// This is a relative grid : the kgCO2e value of each square will vary in order to fill the whole screen
export default ({ details }) => {
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
	 * */

	const categories = extractCategories(rules, engine, details).map(
		(category) => ({
			...category,
			abbreviation: rules[category.dottedName].abbréviation,
		})
	)

	if (!categories) return null

	const allSubCategories = relegate('services publics', categories)
		.map((category) =>
			getSubcategories(rules, category, engine).map((el) => ({
				...el,
				topCategoryColor: category.color,
				topCategoryTitle: category.title,
			}))
		)
		.flat()

	const constraintsRef = useRef(null)
	const [hiddenTarget, hideTarget]: [boolean | undefined, any] =
		useState(undefined)

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
				gridLength={gridLength}
			/>
			{!hiddenTarget && (
				<motion.div
					drag="y"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{
						ease: 'easeIn',
						duration: undefined === hiddenTarget ? 1.6 : 0,
						delay: undefined === hiddenTarget ? 1.5 : 0,
					}}
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
					<HideTargetButton onClick={() => hideTarget(true)} />
					<p css="font-size: 180%; a img {margin-left: -0.4rem; width: 1.3rem; vertical-align: super}">
						{emoji('🎯')} 2 tonnes <ObjectiveExplanation />
					</p>
					<p>
						Une case {emoji('🔲')} = {Math.round(pixel)} kg de CO₂e.
					</p>
				</motion.div>
			)}
			{hiddenTarget && (
				<button
					css={`
						background: #78e08f;
						padding: 0.2rem 0.6rem;
						width: 12rem;

						margin-top: 0.6rem;
						margin: 0 auto;
					`}
					onClick={() => hideTarget(false)}
				>
					{emoji('🎯')} Montrer l'objectif
				</button>
			)}
		</motion.section>
	)
}
const HideTargetButton = ({ onClick }) => {
	const matches = useMediaQuery('(min-width: 800px)')
	return (
		<button
			css={`
				top: 0.6rem;
				right: 0rem;
				position: absolute;
				img {
					width: 1.3rem;
				}
			`}
			onClick={onClick}
		>
			{matches ? (
				'Cacher'
			) : (
				<img title="Cacher l'objectif" src="/images/close-plain.svg" />
			)}
		</button>
	)
}
