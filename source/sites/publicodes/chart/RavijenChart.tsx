import { extractCategories } from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router'
import {
	objectifsSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'
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
	const categories = extractCategories(rules, engine, details).map(
		(category) => ({
			...category,
			abbreviation: rules[category.dottedName].abbréviation,
		})
	)
	const { pathname } = useLocation(),
		history = useHistory()

	if (!categories) return null

	const empreinteMaximum = categories.reduce(
		(memo, next) => (memo.nodeValue > next.nodeValue ? memo : next),
		-1
	).nodeValue

	return (
		<section
			css={`
				h2 {
					margin: 0.6rem 0 0.1rem;
					font-size: 140%;
				}
				padding: 0;
				margin: 1rem 0;
			`}
		>
			<div
				css={`
					margin-top: 1rem;
					position: relative;
				`}
			>
				<ul
					css={`
						margin-left: 2rem;

						@media (min-width: 800px) {
							max-width: 35rem;
						}
					`}
				>
					{categories.map((category) => {
						return (
							<CategoryVisualisation questionCategory={category} hideMeta />
						)
					})}
				</ul>
			</div>
		</section>
	)
}
