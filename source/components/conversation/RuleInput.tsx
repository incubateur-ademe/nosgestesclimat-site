import Input from 'Components/conversation/Input'
import Question, { Choice } from 'Components/conversation/Question'
import CurrencyInput from 'Components/CurrencyInput/CurrencyInput'
import PercentageField from 'Components/PercentageField'
import { parentName, splitName } from 'Components/publicodesUtils'
import ToggleSwitch from 'Components/ui/ToggleSwitch'
import { EngineContext } from 'Components/utils/EngineContext'
import { DottedName } from 'modele-social'
import {
	ASTNode,
	EvaluatedRule,
	formatValue,
	reduceAST,
	serializeUnit,
	utils,
} from 'publicodes'
import { Evaluation } from 'publicodes/dist/types/AST/types'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import DateInput from './DateInput'
import estimationQuestions from './estimationQuestions'
import ParagrapheInput from './ParagrapheInput'
import NumberedMosaic from './select/NumberedMosaic'
import SelectDevices from './select/SelectDevices'
import TextInput from './TextInput'

type Value = any
export type RuleInputProps<Name extends string = DottedName> = {
	dottedName: Name
	onChange: (value: Value | null) => void
	useSwitch?: boolean
	isTarget?: boolean
	autoFocus?: boolean
	id?: string
	className?: string
	onSubmit?: (source: string) => void
}

export type InputCommonProps<Name extends string = string> = Pick<
	RuleInputProps<Name>,
	'dottedName' | 'onChange' | 'autoFocus' | 'className'
> &
	Pick<EvaluatedRule<Name>, 'title' | 'question' | 'suggestions'> & {
		key: string
		id: string
		value: any //TODO EvaluatedRule['nodeValue']
		missing: boolean
		required: boolean
	}

export type BinaryQuestionType = [
	{ value: string; label: string },
	{ value: string; label: string }
]

/* function to detect if the question evaluated should be displayed as a child of a mosaic
We only test parent of degree 2 and not all the parents of each rules : this requires to be careful on model side.
If parent of degree 2 doesn't contain mosaic, return empty array
If parent of degree 2 contains mosaic but rule is a child not included in the mosaic, return empty array
We take into account if the evaluated rule is already a mosaic
*/
export const getRelatedMosaicInfosIfExists = (engine, rules, dottedName) => {
	if (!dottedName) return
	const potentialMosaicDottedName = engine.getRule(dottedName).rawNode[
		'mosaique'
	]
		? dottedName
		: parentName(dottedName, ' . ', 0, 2)
	if (!potentialMosaicDottedName) return
	const potentialMosaicRule = engine.getRule(potentialMosaicDottedName)
	const mosaicParams = potentialMosaicRule.rawNode['mosaique']
	if (!mosaicParams) return
	if (
		dottedName !== potentialMosaicDottedName &&
		!dottedName.includes(` . ${mosaicParams['clé']}`)
	)
		return
	const mosaicDottedNames = Object.entries(rules).filter(([rule]) => {
		return (
			rule.includes(potentialMosaicDottedName) &&
			rule.includes(` . ${mosaicParams['clé']}`)
		)
	})
	return [potentialMosaicRule, mosaicParams, mosaicDottedNames]
}

export const isTransportEstimation = (dottedName) =>
	estimationQuestions.find(({ isApplicable }) => isApplicable(dottedName))

// This function takes the unknown rule and finds which React component should
// be displayed to get a user input through successive if statements
// That's not great, but we won't invest more time until we have more diverse
// input components and a better type system.
export default function RuleInput<Name extends string = DottedName>({
	dottedName,
	onChange,
	useSwitch = false,
	id,
	isTarget = false,
	autoFocus = false,
	className,
	onSubmit = () => null,
	engine: givenEngine,
	noSuggestions = false,
}: RuleInputProps<Name>) {
	const { t } = useTranslation()
	const engine = givenEngine || useContext(EngineContext) //related to Survey Context : we enable the engine to be different according to the simulation rules we are working with.
	const rule = engine.getRule(dottedName)
	const evaluation = engine.evaluate(dottedName)
	const rules = engine.getParsedRules()

	const language = useTranslation().i18n.language
	const value = evaluation.nodeValue

	const commonProps: InputCommonProps<Name> = {
		key: dottedName,
		dottedName,
		value,
		missing: !!evaluation.missingVariables[dottedName],
		onChange,
		autoFocus,
		className,
		title: rule.title,
		id: id ?? dottedName,
		question: rule.rawNode.question,
		suggestions: rule.suggestions,
		required: true,
	}

	const ruleMosaicInfos = getRelatedMosaicInfosIfExists(
		engine,
		rules,
		rule.dottedName
	)

	if (ruleMosaicInfos) {
		const [question, mosaicParams, mosaicDottedNames] = ruleMosaicInfos
		const orderedSumFromSourceRule = question?.rawNode?.formule?.somme
		const selectedRules = mosaicDottedNames
			.map(([dottedName, questionRule]) => {
				const parentRule = parentName(dottedName)
				return [rules[parentRule], questionRule]
			})
			// we want to sort the cards so that the inactive ones are at the end and the active ones are ordered as the `somme` defined as model side.
			.sort((a, b) => {
				if ('inactif' in a[0].rawNode) return 1
				if (orderedSumFromSourceRule) {
					const indexA = orderedSumFromSourceRule.indexOf(
						splitName(a[0].dottedName)[splitName(a[0].dottedName).length - 1]
					)
					const indexB = orderedSumFromSourceRule.indexOf(
						splitName(b[0].dottedName)[splitName(b[0].dottedName).length - 1]
					)
					return indexA - indexB
				}
			})
		if (mosaicParams['type'] === 'selection')
			return (
				<SelectDevices
					{...{
						...commonProps,
						dottedName: question.dottedName,
						selectedRules,
						options: question.options || {},
						suggestions: mosaicParams['suggestions'] || {},
					}}
				/>
			)
		if (mosaicParams['type'] === 'nombre')
			return (
				<NumberedMosaic
					{...{
						...commonProps,
						dottedName: question.dottedName,
						selectedRules,
						options: { chipsTotal: mosaicParams['total'] } || {},
						suggestions: mosaicParams['suggestions'] || {},
					}}
				/>
			)
		return
	}

	if (isTransportEstimation(rule.dottedName)) {
		const question = isTransportEstimation(rule.dottedName)
		const unité = serializeUnit(evaluation.unit)
		return (
			<question.component
				commonProps={commonProps}
				evaluation={evaluation}
				onSubmit={onSubmit}
				setFinalValue={(value) => onChange({ valeur: value, unité })}
				value={value as Evaluation<string>}
			/>
		)
	}

	if (getVariant(engine.getRule(dottedName))) {
		return (
			<Question
				{...commonProps}
				onSubmit={onSubmit}
				choices={buildVariantTree(engine, dottedName)}
			/>
		)
	}

	if (rule.rawNode.type === 'date') {
		return (
			<DateInput
				{...commonProps}
				value={commonProps.value}
				onChange={commonProps.onChange}
				onSubmit={onSubmit}
				suggestions={commonProps.suggestions}
			/>
		)
	}

	if (
		evaluation.unit == null &&
		(rule.rawNode.type === 'booléen' || rule.rawNode.type == undefined) &&
		typeof evaluation.nodeValue !== 'number'
	) {
		return useSwitch ? (
			<ToggleSwitch
				defaultChecked={value === true}
				onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
					onChange(evt.target.checked ? 'oui' : 'non')
				}
			/>
		) : (
			<Question
				{...commonProps}
				choices={[
					{ value: 'oui', label: t('Oui') },
					{ value: 'non', label: t('Non') },
				]}
				onSubmit={onSubmit}
			/>
		)
	}

	if (evaluation.unit?.numerators.includes('€') && isTarget) {
		const unité = formatValue(
			{ nodeValue: value ?? 0, unit: evaluation.unit },
			{ language }
		)
			.replace(/[\d,.]/g, '')
			.trim()
		return (
			<>
				<CurrencyInput
					{...commonProps}
					language={language}
					debounce={750}
					value={value as string}
					name={dottedName}
					className="targetInput"
					onChange={(evt) => onChange({ valeur: evt.target.value, unité })}
				/>
			</>
		)
	}
	if (evaluation.unit?.numerators.includes('%') && isTarget) {
		return <PercentageField {...commonProps} debounce={600} />
	}
	if (rule.rawNode.type === 'texte') {
		return <TextInput {...commonProps} value={value as Evaluation<string>} />
	}
	if (rule.rawNode.type === 'paragraphe') {
		return (
			<ParagrapheInput {...commonProps} value={value as Evaluation<string>} />
		)
	}

	return (
		<Input
			{...commonProps}
			onSubmit={onSubmit}
			unit={evaluation.unit}
			value={value as Evaluation<number>}
			noSuggestions={noSuggestions}
			inputEstimation={
				rule.rawNode.aide &&
				rules[
					utils.disambiguateReference(rules, rule.dottedName, rule.rawNode.aide)
				]
			}
		/>
	)
}

const getVariant = (node: RuleNode) =>
	reduceAST<false | (ASTNode & { nodeKind: 'une possibilité' })>(
		(_, node) => {
			if (node.nodeKind === 'une possibilité') {
				return node
			}
		},
		false,
		node
	)

export const buildVariantTree = <Name extends string>(
	engine: Engine<Name>,
	path: Name
): Choice => {
	const node = engine.getRule(path)
	if (!node) throw new Error(`La règle ${path} est introuvable`)
	const variant = getVariant(node)
	const canGiveUp =
		variant &&
		(!variant['choix obligatoire'] || variant['choix obligatoire'] === 'non')
	return Object.assign(
		node,
		variant
			? {
					canGiveUp,
					children: (
						variant.explanation as (ASTNode & {
							nodeKind: 'reference'
						})[]
					).map(({ dottedName }) =>
						buildVariantTree(engine, dottedName as Name)
					),
			  }
			: null
	) as Choice
}
