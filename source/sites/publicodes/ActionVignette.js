import { motion } from 'framer-motion'
import { utils } from 'publicodes'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { setActionChoice } from '../../actions/actions'
import { correctValue } from '../../components/publicodesUtils'
import Stamp from '../../components/Stamp'
import { useEngine } from '../../components/utils/EngineContext'
import { getNextQuestions } from '../../components/utils/useNextQuestion'
import {
	answeredQuestionsSelector,
	situationSelector,
} from '../../selectors/simulationSelectors'
import { humanWeight } from './HumanWeight'
const { encodeRuleName, decodeRuleName } = utils

export const disabledAction = (flatRule, nodeValue) =>
	flatRule.formule == null ? false : nodeValue === 0 || nodeValue === false

export const supersededAction = (dottedName, rules, actionChoices) => {
	return (
		Object.entries(rules).find(([key, r]) => {
			const supersedes = r?.action?.dépasse
			return supersedes && supersedes.includes(dottedName) && actionChoices[key]
		}) != null
	)
}
const disabledStyle = `
img {
filter: grayscale(1);
}
color: var(--grayColor);
h2 {
color: var(--grayColor);
}
opacity: 0.8;
`
export const ActionListCard = ({
	evaluation,
	total,
	rule,
	focusAction,
	focused,
}) => {
	const dispatch = useDispatch()
	const rules = useSelector((state) => state.rules),
		{ nodeValue, dottedName, title, unit } = evaluation,
		{ icônes: icons } = rule
	const actionChoices = useSelector((state) => state.actionChoices),
		situation = useSelector(situationSelector),
		answeredQuestions = useSelector(answeredQuestionsSelector)

	const engine = useEngine()

	const flatRule = rules[dottedName],
		noFormula = flatRule.formule == null,
		disabled = disabledAction(flatRule, nodeValue)

	const remainingQuestions = getNextQuestions(
			[evaluation.missingVariables],
			{},
			answeredQuestions,
			situation,
			engine
		),
		hasRemainingQuestions = remainingQuestions.length > 0

	return (
		<div
			className={`ui__ interactive card light-border ${
				actionChoices[evaluation.dottedName] ? 'selected' : ''
			}`}
			css={`
				${disabled ? disabledStyle : ''}
				${focused && `border: 4px solid var(--color) !important;`}
		
				width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				height: 100%;
				${hasRemainingQuestions && `background: #eee !important; `}
			`}
		>
			{icons && (
				<div
					css={`
						margin: 0.4rem 0;
						font-size: 200%;
					`}
				>
					{emoji(icons)}
				</div>
			)}
			<Link
				css={`
					h2 {
						margin-top: 0.6rem;
						text-align: center;
						display: inline;
						font-size: 110%;
						font-weight: 500;
						line-height: 1.3rem;
						display: inline-block;
					}
					text-decoration: none;
				`}
				to={'/actions/' + encodeRuleName(dottedName)}
			>
				<h2>{title}</h2>
			</Link>

			<div css="					margin-top: auto;">
				<div
					css={`
						position: relative;
						margin-bottom: 1.4rem;
					`}
				>
					<div
						css={hasRemainingQuestions ? `filter: blur(1px) grayscale(1)` : ''}
					>
						<ActionValue
							{...{ dottedName, total, disabled, noFormula, engine }}
						/>
					</div>
					{hasRemainingQuestions && (
						<Stamp onClick={() => focusAction(dottedName)} clickable>
							{remainingQuestions.length} {emoji('💬')}
						</Stamp>
					)}
				</div>
				<div
					css={`
						display: flex;
						justify-content: space-evenly;
						button img {
							font-size: 200%;
						}
						margin-bottom: 1rem;
					`}
				>
					<button
						css={`
							${hasRemainingQuestions && 'filter: grayscale(1)'}
						`}
						onClick={(e) => {
							if (hasRemainingQuestions) {
								focusAction(dottedName)
								return null
							}

							dispatch(
								setActionChoice(
									dottedName,
									actionChoices[dottedName] === true ? null : true
								)
							)
							e.stopPropagation()
							e.preventDefault()
						}}
					>
						{emoji('✅')}
					</button>
					<button
						onClick={(e) => {
							dispatch(
								setActionChoice(
									dottedName,

									actionChoices[dottedName] === false ? null : false
								)
							)
							e.stopPropagation()
							e.preventDefault()
						}}
					>
						{emoji('❌')}
					</button>
				</div>
			</div>
		</div>
	)
}

export const ActionGameCard = ({ evaluation, total, rule, effort }) => {
	const rules = useSelector((state) => state.rules),
		{ nodeValue, dottedName, title, unit } = evaluation,
		{ icônes: icons } = rule

	const flatRule = rules[dottedName],
		noFormula = flatRule.formule == null,
		disabled = disabledAction(flatRule, nodeValue)

	return (
		<Link
			css={`
				${disabled ? disabledStyle : ''}
				text-decoration: none;
				width: 100%;
			`}
			to={'/actions/' + encodeRuleName(dottedName)}
		>
			<div css={``}>
				<h2>{title}</h2>
				<div css={``}>
					{icons && (
						<div
							css={`
								font-size: 250%;
							`}
						>
							{emoji(icons)}
						</div>
					)}
					<ActionValue {...{ dottedName, total, disabled, noFormula }} />
				</div>
			</div>
		</Link>
	)
}
const ActionValue = ({ total, disabled, noFormula, dottedName, engine }) => {
	const situation = useSelector(situationSelector),
		evaluation = engine.evaluate(dottedName),
		rawValue = evaluation.nodeValue
	const correctedValue = correctValue({
		nodeValue: rawValue,
		unit: evaluation.unit,
	})
	const [stringValue, unit] = humanWeight(correctedValue, false, true),
		relativeValue = Math.round(100 * (correctedValue / total))

	const sign = correctedValue > 0 ? '-' : '+'

	return (
		<div
			css={`
				font-size: 100%;
				text-align: center;
			`}
		>
			{noFormula ? (
				<small>Non chiffré</small>
			) : disabled ? (
				'Non applicable'
			) : (
				<div>
					{sign}&nbsp;
					<span
						css={`
							background: var(--lightColor);
							border-radius: 0.3rem;
							color: var(--textColor);
							padding: 0rem 0.4rem;
							padding-right: 0;
							border: 1px solid var(--lightColor);
							border-radius: 0.3rem;
							${correctedValue < 0 && `background: #e33e3e`};
						`}
					>
						<strong>{stringValue}</strong>&nbsp;
						<span>{unit}</span>
						{total && (
							<span
								css={`
									margin-left: 0.4rem;
									padding: 0 0.2rem;
									background: var(--lighterColor);
									color: var(--color);
									border-top-right-radius: 0.3rem;
									border-bottom-right-radius: 0.3rem;
								`}
							>
								{Math.abs(relativeValue)}%
							</span>
						)}
					</span>
				</div>
			)}
		</div>
	)
}
