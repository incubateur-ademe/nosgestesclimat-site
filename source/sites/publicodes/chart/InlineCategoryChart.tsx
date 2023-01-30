import { extractCategories } from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import React, { Suspense, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { objectifsSelector } from 'Selectors/simulationSelectors'
import { WithEngine } from '../../../RulesProvider'
import { currentQuestionSelector } from '../../../selectors/simulationSelectors'
import { useQuery } from '../../../utils'
import { Loading } from '../App'
import CategoryVisualisation from '../CategoryVisualisation'
import Chart from './index.js'
import { activatedSpecializedVisualisations } from './SpecializedVisualisation'
import SubCategoriesChart from './SubCategoriesChart'
import useContinuousCategory from './useContinuousCategory'

const SpecializedVisualisation = React.lazy(
	() => import('./SpecializedVisualisation')
)

export default ({ givenEngine }) => {
	// needed for this component to refresh on situation change :
	const objectifs = useSelector(objectifsSelector)
	const rules = useSelector((state) => state.rules)
	const engine = givenEngine || useEngine(objectifs)
	const [categories, setCategories] = useState(
		extractCategories(rules, engine).map((category) => ({
			...category,
			abbreviation: rules[category.dottedName].abréviation,
		}))
	)
	const tutorials = useSelector((state) => state.tutorials)

	useEffect(() => {
		setCategories(
			extractCategories(rules, engine).map((category) => ({
				...category,
				abbreviation: rules[category.dottedName].abréviation,
			}))
		)
	}, [rules])

	const displayedCategory = useContinuousCategory(categories)

	const currentQuestion = useSelector(currentQuestionSelector)
	const focusedCategory = useQuery().get('catégorie')

	if (!categories) return null

	const inRespiration =
		displayedCategory &&
		!tutorials['testCategory-' + displayedCategory.dottedName]

	const categoryColor = displayedCategory && displayedCategory.color

	const value = currentQuestion && engine.evaluate(currentQuestion).nodeValue
	const [traditionalChartShown, showTraditionalChart] = useState(false)

	const showSecondLevelChart =
		!inRespiration &&
		displayedCategory &&
		(!focusedCategory || focusedCategory === displayedCategory.dottedName)

	const specializedVisualisationShown =
		activatedSpecializedVisualisations.includes(currentQuestion)

	if (!inRespiration && specializedVisualisationShown)
		return (
			<div
				css={`
					padding: 1rem 0.2rem;
					height: 50rem;
					overflow: scroll;
					margin: 0 auto;
				`}
			>
				<Suspense fallback={<Loading />}>
					<WithEngine options={{ optimized: false, parsed: true }}>
						<SpecializedVisualisation
							{...{ currentQuestion, categoryColor, value }}
						/>
					</WithEngine>
				</Suspense>
			</div>
		)

	return (
		<div
			css={`
				margin: 1rem 0;
			`}
		>
			<div
				css={`
					margin-bottom: 1rem;
				`}
			>
				{showSecondLevelChart && (
					<CategoryVisualisation questionCategory={displayedCategory} />
				)}
			</div>
			<SubCategoriesChart
				{...{
					key: 'categoriesChart',
					categories: categories,
					delay: 0,
					indicator: showSecondLevelChart,
					questionCategory: displayedCategory,
					filterSimulationOnClick: true,
					onRestClick: () => showTraditionalChart(!traditionalChartShown),
				}}
			/>
			{traditionalChartShown && <Chart />}
		</div>
	)
}
