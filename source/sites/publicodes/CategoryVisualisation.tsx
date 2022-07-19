import emoji from 'react-easy-emoji'
import SubCategoriesChart from './chart/SubCategoriesChart'
import { CategoryLabel } from 'Components/conversation/UI'
import {
	extractCategories,
	ruleFormula,
} from '../../components/publicodesUtils'
import { useEngine } from '../../components/utils/EngineContext'
import { useSelector } from 'react-redux'
import AnimatedTargetValue from '../../components/ui/AnimatedTargetValue'

export default ({ questionCategory, hideMeta = false }) => {
	const rules = useSelector((state) => state.rules)
	const engine = useEngine()

	const category = questionCategory.name

	// The aim of this component is to visualize sums. Sometimes, relevant sums are hidden behind a division
	// it should be visualized elsewhere
	const sumToDisplay =
		category === 'services publics'
			? null
			: 'logement'
			? 'logement . impact'
			: category

	if (!sumToDisplay) return null

	const subCategories = extractCategories(
		rules,
		engine,
		null,
		sumToDisplay,
		false
	)
	const categoryValue = Math.round(engine.evaluate(category).nodeValue)

	return (
		<div
			css={`
				display: flex;
				align-items: center;
				justify-content: flex-start;
				flex-wrap: wrap;
			`}
		>
			{!hideMeta && (
				<div
					css={`
						display: flex;
						align-items: center;
					`}
				>
					<CategoryLabel>
						{emoji(questionCategory.icons || '🌍')}
						{questionCategory.title}
					</CategoryLabel>
					<AnimatedTargetValue value={categoryValue} unit="kg" leftToRight />
				</div>
			)}
			{sumToDisplay && (
				<div
					css={`
						width: 100%;
					`}
				>
					<SubCategoriesChart
						{...{
							key: 'subCategoriesChart',
							color: questionCategory.color,
							rules,
							engine,
							sumToDisplay,
							categories: subCategories,
						}}
					/>
				</div>
			)}
		</div>
	)
}
