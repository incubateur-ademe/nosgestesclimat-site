import Input from '@/components/conversation/Input'
import Question, { Choice } from '@/components/conversation/Question'
import CurrencyInput from '@/components/CurrencyInput/CurrencyInput'
import PercentageField from '@/components/PercentageField'
import {
	DottedName,
	getRelatedMosaicInfosIfExists,
	parentName,
	splitName,
	SuggestionsNode,
} from '@/components/publicodesUtils'
import ToggleSwitch from '@/components/ui/ToggleSwitch'
import { EngineContext } from '@/components/utils/EngineContext'
import Engine, {
	ASTNode,
	EvaluatedNode,
	formatValue,
	reduceAST,
	RuleNode,
	serializeUnit,
	utils,
} from 'publicodes'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import DateInput from './DateInput'
import estimationQuestions from './estimationQuestions'
import ParagrapheInput from './ParagrapheInput'
import NumberedMosaic from './select/NumberedMosaic'
import SelectDevices from './select/SelectDevices'
import TextInput from './TextInput'

type Value = any
export type RuleInputProps = {
	dottedName: DottedName
	onChange: (value: Value | null) => void
	useSwitch?: boolean
	isTarget?: boolean
	autoFocus?: boolean
	id?: string
	className?: string
	onSubmit?: (source: string) => void
	engine?: Engine
	noSuggestions: boolean
}

export type InputCommonProps = Pick<
	RuleInputProps,
	'dottedName' | 'onChange' | 'autoFocus' | 'className'
> &
	Pick<EvaluatedNode, 'nodeValue'> & {
		title: string
		question?: string
		suggestions: SuggestionsNode
		key: string
		id: string
		missing: boolean
		required: boolean
	}

export type BinaryQuestionType = [
	{ value: string; label: string },
	{ value: string; label: string }
]

export const isTransportEstimation = (dottedName) =>
	estimationQuestions.find(({ isApplicable }) => isApplicable(dottedName))

/**
 * This function takes the unknown rule and finds which React component should
 * be displayed to get a user input through successive if statements
 * That's not great, but we won't invest more time until we have more diverse
 * input components and a better type system.
 */
export default function RuleInput({
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
}: RuleInputProps) {
	const { t } = useTranslation()
	const engine = givenEngine || useContext(EngineContext) //related to Survey Context : we enable the engine to be different according to the simulation rules we are working with.
	const rule = engine.getRule(dottedName)
	const evaluation = engine.evaluate(dottedName)
	const rules = engine.getParsedRules()

	const language = useTranslation().i18n.language
	const value = evaluation.nodeValue

	const commonProps: InputCommonProps = {
		key: dottedName,
		dottedName,
		nodeValue: value,
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

	const ruleMosaicInfos = getRelatedMosaicInfosIfExists(rules, rule.dottedName)
	if (ruleMosaicInfos) {
		const {
			mosaicRule: question,
			mosaicParams,
			mosaicDottedNames,
		} = ruleMosaicInfos
		const selectedRules = mosaicDottedNames
			.map(([dottedName, questionRule]) => {
				const parentRule = parentName(dottedName)
				return [rules[parentRule], questionRule]
			})
			// we want to sort the cards so that the inactive ones are at the end.
			.sort(([{ _ }, q], [_b]) => ('inactif' in q.rawNode ? 1 : -1))
		// and the active ones are ordered as the `somme` defined as model side if the formula in the rule mosaic is a `somme`.
		const orderedSumFromSourceRule = question?.rawNode?.formule?.somme
		if (orderedSumFromSourceRule) {
			selectedRules.sort((a, b) => {
				const indexA = orderedSumFromSourceRule.indexOf(
					splitName(a[0].dottedName)[splitName(a[0].dottedName).length - 1]
				)
				const indexB = orderedSumFromSourceRule.indexOf(
					splitName(b[0].dottedName)[splitName(b[0].dottedName).length - 1]
				)
				return indexA - indexB
			})
		}
		if (mosaicParams['type'] === 'selection')
			return (
				<SelectDevices
					{...{
						...commonProps,
						dottedName: question.dottedName,
						selectedRules,
						options:
							// NOTE(@EmileRolley): where this options come from? And what is it?
							// @ts-ignore
							question.options ?? {},
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
				value={commonProps.nodeValue}
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
		return (
			<TextInput {...commonProps} nodeValue={value as Evaluation<string>} />
		)
	}
	if (rule.rawNode.type === 'paragraphe') {
		return (
			<ParagrapheInput
				{...commonProps}
				nodeValue={value as Evaluation<string>}
			/>
		)
	}

	return (
		<Input
			{...commonProps}
			onSubmit={onSubmit}
			unit={evaluation.unit}
			nodeValue={value as Evaluation<number>}
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
