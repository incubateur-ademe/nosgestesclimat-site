import { updateSituation } from 'Actions/actions'
import Checkbox from 'Components/ui/Checkbox'
import React from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import { Mosaic } from './UI'
import Stamp from '../../Stamp'
import { mosaicLabelStyle } from './NumberedMosaic'
import styled from 'styled-components'
import MosaicInputSuggestions from '../MosaicInputSuggestions'

const MosaicLabelDiv = styled.div`
	${mosaicLabelStyle}
`

export default function SelectDevices({
	name,
	setFormValue,
	dottedName,
	selectedRules,
	value: currentValue,
	question,
	options: { defaultsToFalse },
	suggestions,
}) {
	const dispatch = useDispatch()
	const situation = useSelector(situationSelector)

	const relatedRuleNames = selectedRules.reduce(
		(memo, arr) => [...memo, arr[1].dottedName],
		[]
	)

	// for now, if nothing is checked, after having check something, 'suivant' button will have same effect as 'je ne sais pas'
	// we can imagine a useeffect that set to 0 situation of dottedname every time all card are unchecked (after user checked something at least once)

	return (
		<div>
			{Object.keys(suggestions).length > 0 && (
				<MosaicInputSuggestions
					dottedName={dottedName}
					relatedRuleNames={relatedRuleNames}
					suggestions={suggestions}
				/>
			)}
			<Mosaic>
				{selectedRules.map(
					([
						{
							dottedName: name,
							title,
							rawNode: { description, icônes },
						},
						question,
					]) => {
						const situationValue = situation[question.dottedName],
							value =
								situationValue != null
									? situationValue
									: // unlike the NumberedMosaic, we don't preselect cards choices here
									  // user tests showed us it is now well received
									  'non',
							isNotActive = question.rawNode['inactif']
						return (
							<li
								css={`
									padding: 2rem;
									position: relative;
									pointer-events: none;
								`}
								className={
									isNotActive
										? `ui__ card light-border inactive`
										: `ui__ card interactive light-border ${
												value === 'oui' ? `selected` : ''
										  }`
								}
								key={name}
							>
								{icônes && <div css="font-size: 150%">{emoji(icônes)}</div>}
								<MosaicLabelDiv>{title}</MosaicLabelDiv>
								{false && description && <p>{description.split('\n')[0]}</p>}
								{!isNotActive && (
									<div
										css={`
											font-size: 1.8rem;
											pointer-events: auto;
										`}
									>
										<Checkbox
											name={name}
											id={name}
											label={title}
											checked={value === 'oui'}
											onChange={() =>
												dispatch(
													updateSituation(
														question.dottedName,
														value == 'oui' ? 'non' : 'oui'
													)
												)
											}
										/>
									</div>
								)}
								{isNotActive && (
									<Stamp
										css={`
											z-index: 1;
											max-width: 8rem;
											text-align: center;
											border: 2px solid var(--darkColor);
											color: var(--darkColor);
											font-size: 90%;
											@media (min-width: 800px) {
												left: 3rem;
												top: 4rem;
											}
										`}
									>
										Bientôt disponible !
									</Stamp>
								)}
							</li>
						)
					}
				)}
			</Mosaic>
		</div>
	)
}
