import { splitName } from 'Components/publicodesUtils'
import { EngineContext } from 'Components/utils/EngineContext'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { extractCategoriesNamespaces } from '../../components/publicodesUtils'
import { answeredQuestionsSelector } from '../../selectors/simulationSelectors'
import { useQuery } from '../../utils'
import ActionsOptionsBar from './ActionsOptionsBar'
import ActionTutorial from './ActionTutorial'
import AllActions from './AllActions'
import CategoryFilters from './CategoryFilters'
import { humanWeight } from './HumanWeight'
import MetricFilters from './MetricFilters'
import SimulationMissing from './SimulationMissing'
import useActions from './useActions'

export default ({ display }) => {
	const engine = useContext(EngineContext)

	const { t, i18n } = useTranslation()

	const metric = useQuery().get('métrique')
	const category = useQuery().get('catégorie')

	const rules = useSelector((state) => state.rules)
	const answeredQuestions = useSelector(answeredQuestionsSelector)

	const [radical, setRadical] = useState(true)

	const tutorials = useSelector((state) => state.tutorials)

	const [focusedAction, focusAction] = useState(null)

	const { targets, interestingActions } = useActions({
		metric,
		engine,
		focusedAction,
		rules,
		radical,
	})

	const bilan = targets.find((t) => t.dottedName === 'bilan')

	const filterByCategory = (actions) =>
		actions.filter((action) =>
			category ? splitName(action.dottedName)[0] === category : true
		)

	const finalActions = filterByCategory(interestingActions)

	const categories = extractCategoriesNamespaces(rules, engine)

	const countByCategory = finalActions.reduce((memo, next) => {
		const category = splitName(next.dottedName)[0]

		return { ...memo, [category]: (memo[category] || 0) + 1 }
	}, {})

	//TODO this is quite a bad design
	// we'd better check if the test is finished
	// but is it too restrictive ?
	const simulationWellStarted = answeredQuestions.length > 50

	const [value, unit] = humanWeight({ t, i18n }, bilan.nodeValue)

	return (
		<div
			css={`
				padding: 0 0 1rem;
				${display !== 'list' && 'max-width: 600px;'}
				margin: 1rem auto;
			`}
		>
			{!simulationWellStarted && <SimulationMissing />}
			{simulationWellStarted && tutorials.actions !== 'skip' && (
				<ActionTutorial {...{ value, unit }} />
			)}
			<MetricFilters selected={metric} />
			<CategoryFilters
				categories={categories}
				metric={metric}
				selected={category}
				countByCategory={countByCategory}
			/>

			<ActionsOptionsBar {...{ setRadical, radical, finalActions }} />
			<AllActions
				{...{
					actions: finalActions.reverse(),
					bilan,
					rules,
					focusedAction,
					focusAction,
					radical,
				}}
			/>
			{/* Désactivation de cette fonctionnalité pas terminée
			 finalActions.length ? (
				<ActionStack
					key={category}
					actions={finalActions}
					onVote={(item, vote) => console.log(item.props, vote)}
					total={bilans.length ? bilans[0].nodeValue : null} ></ActionStack>
			) : (
				<p>{emoji('🤷')} Plus d'actions dans cette catégorie</p>
			)}
				<Link
					to={display === 'list' ? '/actions' : '/actions/liste'}
					css=" text-align: center; display: block; margin: 1rem"
				>
					<button className="ui__ button">
						{display === 'list' ? 'Vue jeu de cartes (en dev)' : 'Vue liste'}
					</button>
				</Link>

			*/}
		</div>
	)
}
