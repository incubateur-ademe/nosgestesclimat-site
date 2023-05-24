import classnames from 'classnames'
import animate from 'Components/ui/animate'
import { Markdown } from 'Components/utils/markdown'
import { ASTNode } from 'publicodes'
import { Rule } from 'publicodes/dist/types/rule'
import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import AnimatedLoader from '../../AnimatedLoader'
import {
	BinaryQuestionType,
	InputCommonProps,
	RuleInputProps,
} from './RuleInput'
const ReferencesLazy = React.lazy(
	() =>
		import(
			/* webpackChunkName: 'DocumentationReferences' */ '../../sites/publicodes/DocumentationReferences'
		)
)

/* Ceci est une saisie de type "radio" : l'utilisateur choisit une réponse dans
	une liste, ou une liste de listes. Les données @choices sont un arbre de type:
	- nom: motif CDD # La racine, unique, qui formera la Question. Ses enfants
	  sont les choix possibles enfants:
	  - nom: motif classique enfants:
	    - nom: motif saisonnier
	    - nom: motif remplacement
	  - nom: motif contrat aidé
	  - nom: motif complément de formation

	A chaque nom est associé une propriété 'données' contenant l'entité complète
	(et donc le titre, le texte d'aide etc.) : ce n'est pas à ce composant (une
	vue) d'aller les chercher.

*/

export type Choice = ASTNode & { nodeKind: 'rule' } & {
	canGiveUp?: boolean
	children: Array<Choice>
}

type QuestionProps = InputCommonProps & {
	onSubmit: (source: string) => void
	choices: Choice | BinaryQuestionType
}

export default function Question({
	choices,
	onSubmit,
	dottedName: questionDottedName,
	missing,
	onChange,
	value: currentValue,
	title: ruleTitle,
}: QuestionProps) {
	const [currentSelection, setCurrentSelection] = useState(
		missing ? null : `'${currentValue}'`
	)
	const handleChange = useCallback(
		(value) => {
			setCurrentSelection(value)
		},
		[setCurrentSelection]
	)
	const handleSubmit = useCallback(
		(src, value) => {
			setCurrentSelection(value)
			onChange(value)
			onSubmit(src)
		},
		[onSubmit, onChange, setCurrentSelection]
	)
	useEffect(() => {
		if (currentSelection != null) {
			const timeoutId = setTimeout(() => onChange(currentSelection), 300)
			return () => clearTimeout(timeoutId)
		}
	}, [currentSelection])
	const renderBinaryQuestion = (choices: BinaryQuestionType) => {
		return (
			<div className="ui__ radio" aria-labelledby={'id-question-' + ruleTitle}>
				{choices.map(({ value, label }) => (
					<span
						key={value}
						css={`
							input {
								width: 0;
								opacity: 0;
								height: 0;
								position: absolute;
							}
						`}
					>
						<RadioLabel
							{...{
								value,
								label,
								currentSelection,
								onSubmit: handleSubmit,
								name: questionDottedName,
								onChange: handleChange,
							}}
						/>
					</span>
				))}
			</div>
		)
	}
	const renderChildren = (choices: Choice) => {
		const { t } = useTranslation()
		// seront stockées ainsi dans le state :
		// [parent object path]: dotted fieldName relative to parent
		const relativeDottedName = (radioDottedName: string) =>
			radioDottedName.split(questionDottedName + ' . ')[1]

		return (
			<ul
				css="width: 100%; padding: 0; margin:0"
				className="ui__ radio"
				aria-labelledby={'id-question-' + ruleTitle}
			>
				{choices.canGiveUp && (
					<li key="aucun" className="variantLeaf aucun">
						<RadioLabel
							{...{
								value: 'non',
								label: t('Aucun'),
								currentSelection,
								name: questionDottedName,
								onSubmit: handleSubmit,
								dottedName: null,
								onChange: handleChange,
							}}
						/>
					</li>
				)}
				{choices.children &&
					choices.children.length <= 5 &&
					choices.children.map(
						({
							title,
							dottedName,
							rawNode: { description, icônes, références },
							children,
						}) =>
							children ? (
								<li key={dottedName} className="variant">
									<div>{title}</div>
									{renderChildren({ children } as Choice)}
								</li>
							) : (
								<li key={dottedName} className="variantLeaf">
									<RadioLabel
										{...{
											value: `'${relativeDottedName(dottedName)}'`,
											label: title,
											dottedName,
											currentSelection,
											name: questionDottedName,
											icônes,
											onSubmit: handleSubmit,
											description,
											références,
											onChange: handleChange,
										}}
									/>
								</li>
							)
					)}
				{/* If there are more than 5 possibilities in a question with "Plusieurs possibilités" a Select is displayed*/}
				{choices.children && choices.children.length > 5 && (
					<div aria-labelledby={'id-question-' + ruleTitle}>
						<label title={choices.title}>
							<select
								name={choices.title}
								className="ui__"
								onChange={(e) => handleChange(e.target.value)}
								css={`
									font-size: 110% !important;
									padding: 0.6rem 1.2rem !important;
									width: 100% !important;
								`}
							>
								<option value="">Choisissez une option</option>
								{choices.children.map((node, index) => (
									<option
										key={node.dottedName + '-' + index}
										value={relativeDottedName(node.dottedName)}
									>
										{node.title}
									</option>
								))}
							</select>
						</label>
					</div>
				)}
			</ul>
		)
	}

	const choiceElements = Array.isArray(choices)
		? renderBinaryQuestion(choices)
		: renderChildren(choices)

	return (
		<div
			className="step question"
			css={`
				margin: 0.3rem 0;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
			`}
		>
			{choiceElements}
		</div>
	)
}

type RadioLabelProps = RadioLabelContentProps & {
	description?: string
	label?: string
	références?: Rule['références']
}

export const RadioLabel = (props: RadioLabelProps) => {
	const [isOpen, setIsOpen] = useState(false)
	return (
		<div>
			<RadioLabelContent {...props} />
			{props.description && (
				<>
					<button
						type="button"
						onClick={() => setIsOpen(!isOpen)}
						css={`
							vertical-align: middle;
							font-size: 110% !important;
							padding: 0;
							padding-left: 0.6rem;
						`}
					>
						ℹ️
					</button>
					{isOpen && (
						<animate.appear>
							<div
								className="ui__ card box"
								css={`
									text-align: left !important;
									> h2 {
										margin-top: 0.5rem;
									}
								`}
							>
								<h2>{props.label}</h2>
								<Markdown>{props.description}</Markdown>
								{props.références && (
									<>
										<h3>
											<Trans>En savoir plus</Trans>
										</h3>
										<Suspense fallback={<AnimatedLoader />}>
											<ReferencesLazy refs={props.références} />
										</Suspense>
									</>
								)}
							</div>
						</animate.appear>
					)}
				</>
			)}
		</div>
	)
}

type RadioLabelContentProps = {
	value: string
	label: string
	name: string
	currentSelection?: null | string
	icônes?: string
	onChange: RuleInputProps['onChange']
	onSubmit: (src: string, value: string) => void
}

function RadioLabelContent({
	value,
	label,
	name,
	currentSelection,
	icônes,
	onChange,
	onSubmit,
}: RadioLabelContentProps) {
	const labelStyle = value === '_' ? ({ fontWeight: 'bold' } as const) : {}
	const selected = value === currentSelection

	return (
		<label
			key={value}
			onDoubleClick={() => {
				onSubmit('dblClick', value)
			}}
			style={labelStyle}
			className={classnames('userAnswerButton ui__ button', {
				selected,
			})}
		>
			<input
				type="radio"
				name={name}
				value={value}
				onChange={(evt) => onChange(evt.target.value)}
				checked={selected}
			/>
			<span>
				<span className="radioText">{label}</span>
				{icônes && <span css="margin-left: .6rem">{icônes}</span>}
			</span>
		</label>
	)
}
