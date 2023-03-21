import { useSelector } from 'react-redux'
import { correctValue } from '../../components/publicodesUtils'
import { sortBy } from '../../utils'
import { disabledAction, supersededAction } from './ActionVignette'

export default ({ focusedAction, rules, radical, engine, metric }) => {
	const flatActions = metric ? rules[`actions ${metric}`] : rules['actions']
	const objectifs = ['bilan', ...flatActions.formule.somme]
	const actionChoices = useSelector((state) => state.actionChoices)
	const targets = objectifs.map((o) => engine.evaluate(o))
	const actions = targets.filter((t) => t.dottedName !== 'bilan')
	const sortedActionsByImpact = sortBy(
			(a) => (radical ? 1 : -1) * correctValue(a)
		)(actions),
		interestingActions = sortedActionsByImpact.filter((action) => {
			const flatRule = rules[action.dottedName]
			const superseded = supersededAction(
				action.dottedName,
				rules,
				actionChoices
			)
			const disabled = disabledAction(flatRule, action.nodeValue)
			return !superseded && (action.dottedName === focusedAction || !disabled)
		})
	return { interestingActions, targets }
}
