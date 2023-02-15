import { goToQuestion } from 'Actions/actions'
import {
	extractCategoriesNamespaces,
	sortCategories,
} from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import { DottedName } from 'modele-social'
import { EvaluatedNode, formatValue } from 'publicodes'
import { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { situationSelector } from 'Selectors/simulationSelectors'
import { answeredQuestionsSelector } from '../../selectors/simulationSelectors'
import { safeGetRule, splitName } from '../publicodesUtils'
import SafeCategoryImage from '../SafeCategoryImage'
import Checkbox from '../ui/Checkbox'
import './AnswerList.css'
import AnswerTrajetsTable from './estimate/AnswerTrajetsTable'

export default function AnswerList() {
	const engine = useEngine()
	const situation = useSelector(situationSelector)
	const foldedQuestionNames = useSelector(answeredQuestionsSelector)
	const answeredQuestionNames = Object.keys(situation)
	const foldedQuestions = foldedQuestionNames
		.map((dottedName) => {
			const rule = safeGetRule(engine, dottedName)

			return rule && engine.evaluate(rule)
		})
		.filter(Boolean)
	const foldedStepsToDisplay = foldedQuestions.map((node) => ({
		...node,
		passedQuestion:
			answeredQuestionNames.find(
				(dottedName) => node.dottedName === dottedName
			) == null,
	}))

	const rules = useSelector((state) => state.rules)
	const categories = sortCategories(extractCategoriesNamespaces(rules, engine))

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!(e.ctrlKey && e.key === 'c')) return
			console.log('VOILA VOTRE SITUATION')
			console.log(
				JSON.stringify({
					data: { situation, foldedSteps: foldedQuestionNames },
				})
			)
			e.preventDefault()
			return false
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [situation])
	const [everythingUnfolded, unfoldEverything] = useState(false)

	return (
		<div className="answer-list">
			{!!foldedStepsToDisplay.length && (
				<div>
					<div
						css={`
							margin: 3rem 1rem 1rem 0;
							display: flex;
							align-items: center;
							h2 {
								margin: 0;
								margin-right: 3rem;
							}
						`}
					>
						<h2>
							<Trans>📋 Mes réponses</Trans>
						</h2>

						<div
							css={`
								display: flex;
								align-items: center;
							`}
						>
							<Checkbox
								name="unfoldAnswerList"
								id="unfoldAnswerList"
								label="Tout déplier"
								showLabel
								checked={everythingUnfolded}
								onChange={() => unfoldEverything(!everythingUnfolded)}
							/>
						</div>
					</div>
					<CategoryTable
						{...{
							steps: foldedStepsToDisplay,
							categories,
							engine,
							everythingUnfolded,
						}}
					/>
				</div>
			)}
		</div>
	)
}

const CategoryTable = ({ steps, categories, engine, everythingUnfolded }) =>
	categories.map((category) => {
		const categoryRules = steps.filter((question) =>
			question.dottedName.includes(category.dottedName)
		)

		if (!categoryRules.length) return null

		return (
			<SubCategory
				key={category.dottedName}
				{...{
					rules: categoryRules,
					rule: category,
					engine,
					level: 1,
					everythingUnfolded,
				}}
			/>
		)
	})

const RecursiveStepsTable = ({ rules, engine, level, everythingUnfolded }) => {
	const byParent = rules.reduce((memo, next) => {
		const split = splitName(next.dottedName),
			parent = split.slice(0, level + 1).join(' . ')

		const oldList = memo[parent] || []
		const list = oldList.find(
			({ dottedName }) => dottedName === next.dottedName
		)
			? oldList
			: [...oldList, next]
		return {
			...memo,
			[parent]: list,
		}
	}, {})
	const lonelyRules = Object.values(byParent)
		.map((els) => (els.length === 1 ? els : []))
		.flat()

	return (
		<div css="padding-left: 1rem; border-left: 1px dashed var(--lightColor)">
			{Object.entries(byParent).map(
				([key, values]) =>
					values.length > 1 && (
						<SubCategory
							{...{
								rules: values,
								rule: engine.getRule(key),
								engine,
								level: level + 1,
								everythingUnfolded,
							}}
						/>
					)
			)}
			<StepsTable
				{...{
					rules: lonelyRules,
					level,
					engine,
				}}
			/>
		</div>
	)
}

const SubCategory = ({ rule, rules, engine, level, everythingUnfolded }) => {
	const [localOpen, setOpen] = useState(false),
		open = everythingUnfolded || localOpen

	return (
		<div>
			<div
				onClick={() => setOpen(!open)}
				className="ui__ card"
				css={`
					cursor: pointer;
					display: inline-flex;
					justify-content: start;
					align-items: center;
					img {
						font-size: 150%;
					}
					margin: 0.6rem 0;
					padding: 0.4rem 0;
					h3 {
						margin: 0;
						font-weight: 300;
					}
					${level === 1 &&
					`background: ${rule.color} !important;

						img {
							font-size: 230%;
						}
						width: 30rem;
						max-width: 100%;
						margin: 1rem 0;
						h2 {
							color: white;
							margin: 1rem;
							font-weight: 300;
							text-transform: uppercase;
						}
						color: white;
						small{color: white}

						`}
				`}
			>
				<SafeCategoryImage element={rule} whiteBackground={level > 1} />
				{level === 1 ? <h2>{rule.title}</h2> : <h3>{rule.title}</h3>}
				<div css="margin-left: auto !important; > * {margin: 0 .4rem}; img {font-size: 100%}">
					<small>
						{rules.length} {level === 1 && emoji('💬')}
					</small>
					<span>{!open ? '▶' : '▼'}</span>
				</div>
			</div>
			{open && (
				<RecursiveStepsTable
					{...{
						rules,
						engine,
						level,
						everythingUnfolded,
					}}
				/>
			)}
		</div>
	)
}
function StepsTable({
	rules,
	level,
	engine,
}: {
	rules: Array<EvaluatedNode & { nodeKind: 'rule'; dottedName: DottedName }>
}) {
	const dispatch = useDispatch()

	return (
		<table>
			<tbody>
				{rules.map((rule) => (
					<Answer
						{...{
							level,
							rule,
							dispatch,
							engine,
						}}
					/>
				))}
			</tbody>
		</table>
	)
}

const Answer = ({ rule, dispatch, level, engine }) => {
	const { t } = useTranslation()
	const translateUnits = (units: array[string]) => {
		return units.map((unit: string) => t(unit, { ns: 'units' }))
	}
	const navigate = useNavigate()
	const storedTrajets = useSelector((state) => state.storedTrajets)
	const levelDottedName = rule.dottedName.split(' . ')
	const levelRule =
		levelDottedName.length > level + 1
			? engine.getRule(levelDottedName.slice(0, level + 1).join(' . '))
			: undefined

	if (rule.unit?.denominators) {
		rule.unit.denominators = translateUnits(rule.unit.denominators)
	}
	if (rule.unit?.numerators) {
		rule.unit.numerators = translateUnits(rule.unit.numerators)
	}

	const formattedValue =
		rule.type === 'string'
			? // Retrieve the translated title of the rule implicated to a suggestion
			  safeGetRule(engine, rule.dottedName + ' . ' + rule.nodeValue)?.title
			: t(formatValue(rule) as string, { ns: 'units' })

	return (
		<tr
			key={rule.dottedName}
			css={`
				background: var(--lightestColor);
			`}
		>
			<td>
				{levelRule && (
					<div>
						<small>{levelRule.title}</small>
					</div>
				)}
				<div css="font-size: 110%">{rule.title}</div>
			</td>
			<td>
				<button
					className="answer"
					css={`
						display: inline-block;
						padding: 0.6rem;
						color: inherit;
						font-size: inherit;
						width: 100%;
						text-align: end;
						font-weight: 500;
						> span {
							text-decoration: underline;
							text-decoration-style: dashed;
							text-underline-offset: 4px;
							padding: 0.05em 0em;
							display: inline-block;
						}
					`}
					onClick={() => {
						dispatch(goToQuestion(rule.dottedName))
						navigate('/simulateur/bilan')
					}}
				>
					<span
						className="answerContent"
						css={`
							${rule.passedQuestion ? 'opacity: .5' : ''}
						`}
					>
						{formattedValue}
						{rule.passedQuestion && emoji(' 🤷🏻')}
					</span>
				</button>
				{storedTrajets[rule.dottedName] &&
					storedTrajets[rule.dottedName].length > 0 && (
						<details
							className="ui__"
							css={`
								max-width: 20rem;
								margin-right: 0px;
								margin-left: auto;
							`}
						>
							<summary
								css={`
									text-align: end !important;
								`}
							>
								<Trans>Voir en détails</Trans>
							</summary>
							<AnswerTrajetsTable
								trajets={storedTrajets[rule.dottedName]}
							></AnswerTrajetsTable>
						</details>
					)}
			</td>
		</tr>
	)
}
