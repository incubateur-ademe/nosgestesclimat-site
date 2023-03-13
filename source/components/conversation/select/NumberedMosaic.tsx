import { updateSituation } from 'Actions/actions'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import { useEngine } from '../../utils/EngineContext'
import MosaicInputSuggestions from '../MosaicInputSuggestions'
import { Mosaic, MosaicItemLabel } from './UI'

export default function NumberedMosaic({
	name,
	setFormValue,
	dottedName,
	selectedRules,
	value: currentValue,
	question,
	options: { chipsTotal },
	suggestions,
}) {
	const situation = useSelector(situationSelector)
	const engine = useEngine()

	const chipsCount = selectedRules.reduce((memo, [_, { dottedName }]) => {
		const evaluated = engine.evaluate(dottedName)
		return memo + evaluated.nodeValue
	}, 0)

	const { t } = useTranslation()

	const choiceElements = (
		<div>
			<Mosaic>
				{selectedRules.map(
					([
						{
							name,
							title,
							rawNode: { description, icônes },
						},
						question,
					]) => {
						const situationValue = situation[question.dottedName],
							evaluation = engine.evaluate(question.dottedName),
							value =
								situationValue != null
									? situationValue
									: question.rawNode['par défaut']

						return (
							<li
								className="ui__ card interactive"
								key={question.dottedName}
								id={`card - ${question.dottedName}`}
							>
								<MosaicItemLabel
									question={question}
									title={title}
									icônes={icônes}
									description={description}
								/>
								<NumericInputWithButtons
									name={name}
									question={question}
									title={title}
									value={value}
									situationValue={situationValue}
								/>
							</li>
						)
					}
				)}
			</Mosaic>
			{/* If "chipsTotal" is specified, show to the user the exact number of
			choices that must be filled */}
			{chipsTotal && (
				<div css="p {text-align: center}">
					{chipsCount > chipsTotal ? (
						<p
							role="alert"
							css="text-decoration: underline; text-decoration-color: red;   text-decoration-thickness: 0.2rem;"
						>
							{t(`components.conversation.select.NumberedMosaic.choixEnTrop`, {
								nbChoix: chipsCount - chipsTotal,
							})}
						</p>
					) : chipsCount === chipsTotal ? (
						<p role="alert">😋👍</p>
					) : (
						<p
							role="alert"
							css="text-decoration: underline; text-decoration-color: yellow; text-decoration-thickness: 0.2rem;"
						>
							{t(`components.conversation.select.NumberedMosaic.choixAFaire`, {
								nbChoix: chipsTotal - chipsCount,
							})}
						</p>
					)}
				</div>
			)}
		</div>
	)

	const relatedRuleNames = selectedRules.reduce(
		(memo, arr) => [...memo, arr[1].dottedName],
		[]
	)

	return (
		<div>
			{Object.keys(suggestions).length > 0 && (
				<MosaicInputSuggestions
					mosaicType="nombre"
					dottedName={dottedName}
					relatedRuleNames={relatedRuleNames}
					suggestions={suggestions}
				/>
			)}
			{choiceElements}
		</div>
	)
}

const NumericButton = styled.button`
	font-size: 100%;
	font-weight: bold;
	border: solid 1px var(--color);
	border-radius: 0.2rem;
	background-color: var(--color);
	color: white;
	padding: 0;
	width: 2.3rem;
	height: 1.6rem;

	&:not(:disabled):hover {
		transform: scale(1.1, 1.1);
	}

	&:disabled {
		color: gray;
		background-color: transparent;
	}
`

function NumericInputWithButtons({
	name,
	question,
	title,
	value,
	situationValue,
}) {
	const dispatch = useDispatch()
	const { t } = useTranslation()

	return (
		<div
			css={`
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin: 0;
			`}
		>
			<NumericButton
				onClick={() =>
					dispatch(updateSituation(question.dottedName, value + 1))
				}
				title={t(`Ajouter `) + title.toLowerCase()}
			>
				+
			</NumericButton>
			<NumberFormat
				inputMode="decimal"
				allowNegative={false}
				decimalScale={0}
				aria-describedby={'description ' + title}
				id={question.dottedName}
				css={`
					width: 1.3rem;
					padding: 0; /* Necessary for iPhone Safari 7-12 at least */
					height: 1rem;
					font-size: 100%;
					color: var(--darkColor);
					margin: 0.3rem 0.1rem;
					text-align: center;
					border: none;
					color: var(--darkColor);
				`}
				value={
					situationValue == null
						? undefined
						: situationValue === 0 // if situation value is 0 (2 options : input is filled in with a 0 or input is empty), value become an empty string and placeholder (0) is visible..
						? ''
						: value
				}
				placeholder={value}
				onChange={(e) =>
					dispatch(updateSituation(question.dottedName, +e.target.value))
				}
			/>
			<NumericButton
				className={!value ? 'disabled' : ''}
				disabled={!value}
				onClick={() =>
					value > 0 && dispatch(updateSituation(question.dottedName, value - 1))
				}
				title={t(`Enlever `) + title.toLowerCase()}
			>
				-
			</NumericButton>
		</div>
	)
}
