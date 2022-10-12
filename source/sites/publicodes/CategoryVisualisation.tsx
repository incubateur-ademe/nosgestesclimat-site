import { CategoryLabel } from 'Components/conversation/UI'
import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { getSubcategories } from '../../components/publicodesUtils'
import AnimatedTargetValue from '../../components/ui/AnimatedTargetValue'
import { useEngine } from '../../components/utils/EngineContext'
import SubCategoriesChart from './chart/SubCategoriesChart'

export default ({ questionCategory: category, hideMeta = false }) => {
	const { t } = useTranslation()
	const rules = useSelector((state) => state.rules)
	const engine = useEngine()

	// The aim of this component is to visualize sums. Sometimes, relevant sums are hidden behind a division
	// it should be visualized elsewhere
	const subCategories = getSubcategories(rules, category, engine)

	const categoryValue = Math.round(engine.evaluate(category.name).nodeValue)

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
						{emoji(category.icons || '🌍')}
						{t(category.title as string, { ns: 'categories' })}
					</CategoryLabel>
					<AnimatedTargetValue value={categoryValue} unit="kg" leftToRight />
				</div>
			)}
			<div
				css={`
					width: 100%;
				`}
			>
				<SubCategoriesChart
					{...{
						key: 'subCategoriesChart',
						color: category.color,
						rules,
						engine,
						categories: subCategories,
					}}
				/>
			</div>
		</div>
	)
}
