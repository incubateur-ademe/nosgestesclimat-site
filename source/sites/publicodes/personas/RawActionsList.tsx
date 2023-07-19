import {
	Category,
	DottedName,
	extractCategoriesNamespaces,
	NGCRules,
	splitName,
} from '@/components/publicodesUtils'
import { useEngine } from '@/components/utils/EngineContext'
import { Trans, useTranslation } from 'react-i18next'
import { getFormattedActionValue, supersededAction } from '../ActionVignette'
import { humanWeight } from '../HumanWeight'
import useActions from '../useActions'

export default ({ rules }: { rules: NGCRules }) => {
	const { t, i18n } = useTranslation()
	const engine = useEngine()
	const { interestingActions: actionResultsRaw } = useActions({
		focusedAction: null,
		rules,
		radical: true,
		engine,
		metric: null,
	})

	type CustomAction = {
		correctedValue: number
		dottedName: DottedName
		sign: string
		stringValue: string
		title: string
		unit: string
		isSurpassed: boolean
	}

	type ActionsList = Array<CustomAction>

	type ActionsListByCategory = Array<
		Category & {
			actions?: ActionsList
		}
	>

	const actionsList: ActionsList = actionResultsRaw.map((actionRule) => {
		const { dottedName, title }: { dottedName: DottedName; title: string } =
			actionRule
		const { correctedValue, stringValue, unit, sign } = getFormattedActionValue(
			{ t, i18n },
			dottedName,
			engine
		)
		const isSurpassed = supersededAction(dottedName, rules, null)

		return {
			dottedName,
			title,
			correctedValue,
			stringValue,
			unit,
			sign,
			isSurpassed,
		}
	})

	const categories = extractCategoriesNamespaces(rules, engine).reduce(
		(obj, category) => {
			obj[category.dottedName] = category
			return obj
		},
		{} as Array<Category>
	)

	const actionsListByCategory: ActionsListByCategory = actionsList.reduce(
		(obj, action) => {
			const category = splitName(action.dottedName)[0]
			obj[category].actions = {
				...obj[category].actions,
				[action.dottedName]: action,
			}
			return obj
		},
		categories
	)

	const numberOfActions = actionsList.length

	const numberOfActionsWithImpact = actionsList.reduce(
		(obj, { correctedValue, sign }) => {
			if (correctedValue > 1000 && sign === '-') {
				obj['> 1 tonne'] += 1
				return obj
			} else if (correctedValue > 100 && sign === '-') {
				obj['> 100 kgCO2e'] += 1
				return obj
			} else {
				return obj
			}
		},
		{ '> 100 kgCO2e': 0, '> 1 tonne': 0 }
	)

	const rawTotalReduction = actionsList.reduce(
		(acc, { correctedValue, sign, isSurpassed }) => {
			if (correctedValue && !isSurpassed) {
				return sign === '+' ? acc - correctedValue : acc + correctedValue
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
				<Trans>proposées au total pour un potentiel de réduction de </Trans>
				<strong>
					{totalReduction} {unit}
				</strong>
				. {numberOfActionsWithImpact['> 1 tonne']}
				<Trans> présentent un impact de plus de 1 tonne de CO2e,</Trans>{' '}
				{numberOfActionsWithImpact['> 100 kgCO2e']}{' '}
				<Trans>plus de 100 kgCO2e</Trans>.
			</p>
			{Object.values(actionsListByCategory).map(
				(category) =>
					category?.actions && (
						<details key={category.dottedName}>
							<summary>
								{category.title} ({Object.values(category.actions).length})
							</summary>
							<ul>
								{Object.values(category.actions).map(
									({ dottedName, title, stringValue, unit, sign }) => (
										<li key={dottedName}>
											{title} :{' '}
											{stringValue
												? `${sign} ${stringValue} ${unit}`
												: 'Non quantifiée'}
										</li>
									)
								)}
							</ul>
						</details>
					)
			)}
		</div>
	)
}
