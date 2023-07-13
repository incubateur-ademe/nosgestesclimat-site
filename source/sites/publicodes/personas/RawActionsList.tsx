import { useEngine } from '@/components/utils/EngineContext'
import { AppState } from '@/reducers/rootReducer'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { getFormattedActionValue } from '../ActionVignette'
import { humanWeight } from '../HumanWeight'
import useActions from '../useActions'

export default () => {
	const { t, i18n } = useTranslation()
	const engine = useEngine()
	const rules = useSelector((state: AppState) => state.rules)
	const { interestingActions: actionResultsRaw } = useActions({
		focusedAction: null,
		rules,
		radical: true,
		engine,
		metric: null,
	})

	const actionsList = actionResultsRaw.map((action) => {
		const { dottedName, title } = action
		const { correctedValue, stringValue, unit, sign } = getFormattedActionValue(
			{ t, i18n },
			dottedName,
			engine
		)
		return { dottedName, title, correctedValue, stringValue, unit, sign }
	})

	const numberOfActions = actionsList.length
	const rawTotalReduction = actionsList.reduce(
		(acc, { correctedValue, sign }) => {
			if (correctedValue) {
				return sign === '+' ? acc + correctedValue : acc - correctedValue
			} else return acc
		},
		0
	)
	const [totalReduction, unit] = humanWeight(
		{ t, i18n },
		rawTotalReduction,
		false,
		true
	)

	return (
		<div>
			<h2>
				<Trans>Les actions associées:</Trans>
			</h2>
			<p>
				<strong>
					{numberOfActions} <Trans>actions</Trans>
				</strong>{' '}
				<Trans>
					proposées au total pour un empreinte de réduction cumulée de{' '}
				</Trans>
				<strong>
					{totalReduction} {unit}
				</strong>
				.
			</p>
			<ul>
				{actionsList.map(({ dottedName, title, stringValue, unit, sign }) => (
					<li key={dottedName}>
						{dottedName} | {title} |{' '}
						{stringValue ? `${sign} ${stringValue} ${unit}` : 'Non quantifiée'}
					</li>
				))}
			</ul>
		</div>
	)
}
