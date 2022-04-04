import React from 'react'
import emoji from 'react-easy-emoji'
import { correctValue } from '../../components/publicodesUtils'
import { disabledAction, supersededAction } from './ActionVignette'

export const humanWeight = (possiblyNegativeValue, concise = false, noSign) => {
	const v = Math.abs(possiblyNegativeValue)
	const [raw, unit] =
		v === 0
			? [v, '']
			: v < 1
			? [v * 1000, 'g']
			: v < 1000
			? [v, 'kg']
			: [v / 1000, concise ? 't' : v > 2000 ? 'tonnes' : 'tonne']

	const signedValue = raw * (possiblyNegativeValue < 0 ? -1 : 1),
		resultValue = noSign ? raw : signedValue,
		value =
			raw < 10
				? resultValue.toLocaleString('fr-FR', { maximumSignificantDigits: 2 })
				: Math.round(resultValue).toLocaleString('fr-FR')

	return [value, unit]
}

const HumanWeight = ({ nodeValue, overrideValue }) => {
	const [value, unit] = humanWeight(nodeValue)
	return (
		<span
			css={`
				display: flex;
				flex-wrap: wrap;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			`}
		>
			<strong
				classname="humanvalue"
				css={`
					font-size: 160%;
					font-weight: 600;
				`}
			>
				<span>{value}</span>&nbsp;{unit}
			</strong>{' '}
			{
				// overrideValue && <OverrideBlock value={nodeValue - overrideValue} />}
			}
			<span css="margin: 0 .6rem">
				<UnitSuffix />
			</span>
		</span>
	)
}

const OverrideBlock = ({ value: rawValue }) => {
	const [value, unit] = humanWeight(rawValue)
	return (
		<span>
			<span css="font-size: 180%; margin: 0 1rem">{emoji('➡️ ')}</span>
			<strong
				classname="humanvalue"
				css={`
					font-size: 160%;
					font-weight: 600;
				`}
			>
				{value}&nbsp;{unit}
			</strong>
		</span>
	)
}

export const UnitSuffix = () => (
	<span className="unitSuffix">de CO₂-e / an</span>
)
export const DiffHumanWeight = ({
	nodeValue,
	engine,
	rules,
	actionChoices,
}) => {
	// Here we compute the sum of all the actions the user has chosen
	// we could also use publicode's 'actions' variable sum,
	// but each action would need to have a "chosen" question,
	// and disactivation rules

	const actions = rules['actions'].formule.somme.map((dottedName) =>
			engine.evaluate(dottedName)
		),
		actionTotal = actions.reduce((memo, action) => {
			const correctedValue = correctValue({
				nodeValue: action.nodeValue,
				unit: action.unit,
			})
			if (
				actionChoices[action.dottedName] &&
				!supersededAction(action.dottedName, rules, actionChoices) &&
				!disabledAction(rules[action.dottedName], action.nodeValue)
			) {
				return memo + correctedValue || 0
			} else return memo
		}, 0)

	return (
		<HumanWeight
			nodeValue={nodeValue}
			overrideValue={actionTotal !== 0 && actionTotal}
		/>
	)
}

export default HumanWeight
