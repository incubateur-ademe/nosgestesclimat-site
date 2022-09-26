import { updateSituation } from 'Actions/actions'
import React from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import { useEngine } from '../../utils/EngineContext'
import { Mosaic } from './UI'
import MosaicInputSuggestions from '../MosaicInputSuggestions'
import NumberFormat from 'react-number-format'

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
	const dispatch = useDispatch()
	const situation = useSelector(situationSelector)
	const engine = useEngine()

	const chipsCount = selectedRules.reduce((memo, [_, { dottedName }]) => {
		const evaluated = engine.evaluate(dottedName)
		return memo + evaluated.nodeValue
	}, 0)

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
									: question.rawNode['par défaut'],
							missing = !!evaluation.missingVariables[question.dottedName]

						return (
							<li
								className="ui__ card interactive"
								key={question.dottedName}
								id={`card - ${question.dottedName}`}
							>
								<MosaicLabel htmlFor={question.dottedName}>{title}</MosaicLabel>

								<div
									css={`
										${!description ? 'font-size: 200%' : ''}
									`}
								>
									{icônes && emoji(icônes)}
								</div>
								<p id={'description ' + title}>
									{description && description.split('\n')[0]}
								</p>
								<div css={' span {margin: .8rem; font-size: 120%}'}>
									<button
										className={`ui__ button small plain ${
											!value ? 'disabled' : ''
										}`}
										onClick={() =>
											value > 0 &&
											dispatch(updateSituation(question.dottedName, value - 1))
										}
										title={`Enlever ${title.toLowerCase()}`}
									>
										-
									</button>
									<NumberFormat
										inputMode="decimal"
										allowNegative={false}
										decimalScale={0}
										aria-describedby={'description ' + title}
										id={question.dottedName}
										css={`
											width: 1.5rem;
											padding: 0; /* Necessary for iPhone Safari 7-12 at least */
											height: 1.5rem;
											font-size: 100%;
											color: var(--darkColor);
											margin: 0 0.6rem;
											text-align: center;
											border: none;
											border-bottom: 2px dotted var(--color);
										`}
										{...(missing
											? {
													placeholder: value != null ? value : '',
											  }
											: { value: value ?? '' })}
										onChange={(e) =>
											dispatch(
												updateSituation(
													question.dottedName,
													e.target.value || undefined
												)
											)
										}
									/>
									<button
										className="ui__ button small plain"
										onClick={() =>
											dispatch(updateSituation(question.dottedName, value + 1))
										}
										title={`Ajouter ${title.toLowerCase()}`}
									>
										+
									</button>
								</div>
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
							Vous avez fait {chipsCount - chipsTotal} choix en trop !
						</p>
					) : chipsCount === chipsTotal ? (
						<p role="alert">{emoji('😋👍')}</p>
					) : (
						<p
							role="alert"
							css="text-decoration: underline; text-decoration-color: yellow; text-decoration-thickness: 0.2rem;"
						>
							Il vous reste {chipsTotal - chipsCount} choix à faire.
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
					dottedName={dottedName}
					relatedRuleNames={relatedRuleNames}
					suggestions={suggestions}
				/>
			)}
			{choiceElements}
		</div>
	)
}

export const mosaicLabelStyle = `
	text-align: center;
	line-height: 1.2rem;
	margin-top: 0.6rem;
	margin-bottom: 0.4rem;
	font-weight: bold;
`
const MosaicLabel = styled.label`
	${mosaicLabelStyle}
`
