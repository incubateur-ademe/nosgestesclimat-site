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
	const rule = engine.getRule(category),
		formula = ruleFormula(rule)

	if (!formula) return null

	const sumToDisplay =
		formula.nodeKind === 'somme'
			? category
			: formula.operationKind === '/'
			? formula.explanation[0].dottedName
			: null

	if (!sumToDisplay) return null

	const subCategories = extractCategories(
		rules,
		engine,
		null,
		sumToDisplay,
		false
	)
	const categoryValue = Math.round(engine.evaluate(rule.dottedName).nodeValue)

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
					<Inhabitants {...{ formula, engine }} />
				</div>
			)}
			{sumToDisplay && (
				<div
					css={`
						width: 75%;
						@media (max-width: 800px) {
							width: 100%;
						}
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

const Inhabitants = ({ formula, engine }) => {
	const denominator = formula.operationKind === '/' && formula.explanation[1],
		// This is custom code for the "logement" sub-category that divides a sum by the number of inhabitants of the home
		inhabitants =
			denominator.name === 'habitants' &&
			engine.evaluate(denominator.dottedName).nodeValue
	if (!denominator) return null
	return (
		<span
			title={inhabitants <= 1 ? 'habitant' : 'habitants'}
			css="margin: 0 .4rem"
		>
			{emoji(inhabitants > 1 ? '👥' : '👤')}x{inhabitants}
		</span>
	)
}
