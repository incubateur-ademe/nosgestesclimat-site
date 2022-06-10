import { motion } from 'framer-motion'
import { utils } from 'publicodes'
import emoji from 'react-easy-emoji'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { setActionChoice } from '../../actions/actions'
import { correctValue } from '../../components/publicodesUtils'
import Stamp from '../../components/Stamp'
import { useEngine } from '../../components/utils/EngineContext'
import {
	getNextQuestions,
	useNextQuestions,
} from '../../components/utils/useNextQuestion'
import {
	answeredQuestionsSelector,
	situationSelector,
} from '../../selectors/simulationSelectors'
import { humanWeight } from './HumanWeight'
import { TrackerContext } from '../../components/utils/withTracker'
import { questionConfig } from './questionConfig'

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
	const tracker = useContext(TrackerContext)

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
			questionConfig,
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
				justify-content: start;
				height: 100%;
				${hasRemainingQuestions && `background: #eee !important; `}
			`}
		>
			<Link
				css={`
					display: block;
					margin-top: 0.6rem;
					h2 {
						margin-left: 0.6rem;
						display: inline;
						font-size: 110%;
						font-weight: 500;
					}
					text-decoration: none;
					height: 5.5rem;
				`}
				to={'/actions/' + encodeRuleName(dottedName)}
			>
				{icons && (
					<span
						css={`
							font-size: 150%;
						`}
					>
						{emoji(icons)}
					</span>
				)}
				<h2>{title}</h2>
			</Link>

			<div
				css={`
					position: relative;
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
						{remainingQuestions.length} question
						{remainingQuestions.length > 1 && 's'}
					</Stamp>
				)}
			</div>
			<div
				css={`
					display: flex;
					justify-content: space-evenly;
					align-items: center;
					button img {
						font-size: 200%;
					}
					margin-bottom: 1rem;
					margin-top: auto;
				`}
			>
				<button
					title="Choisir l'action"
					aria-pressed={actionChoices[dottedName]}
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
						tracker.push([
							'trackEvent',
							'/actions',
							'Vote carte action',
							'oui',
							1,
						])
						e.stopPropagation()
						e.preventDefault()
					}}
				>
					<img src="/images/2714.svg" css="width: 3rem" />
				</button>
				<button
					title="Rejeter l'action"
					onClick={(e) => {
						dispatch(
							setActionChoice(
								dottedName,

								actionChoices[dottedName] === false ? null : false
							)
						)
						tracker.push([
							'trackEvent',
							'/actions',
							'Vote carte action',
							'non',
							-1,
						])
						e.stopPropagation()
						e.preventDefault()
					}}
				>
					<img src="/images/274C.svg" css="width: 1.8rem" />
				</button>
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
				margin-top: 1.6rem;
				font-size: 100%;
				strong {
					background: var(--color);
					border-radius: 0.3rem;
					color: var(--textColor);
					padding: 0.1rem 0.4rem;
					font-weight: bold;
					${correctedValue < 0 && `background: #e33e3e`}
				}
			`}
		>
			{noFormula ? (
				'Non chiffré'
			) : disabled ? (
				'Non applicable'
			) : (
				<div>
					<strong>
						{sign} {stringValue} {unit}
					</strong>{' '}
					{total && (
						<span css="margin-left: .4rem">
							{sign}&nbsp;{Math.abs(relativeValue)}%
						</span>
					)}
				</div>
			)}
		</div>
	)
}
