import { updateSituation } from 'Actions/actions'
import Checkbox from 'Components/ui/Checkbox'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import Stamp from '../../Stamp'
import MosaicInputSuggestions from '../MosaicInputSuggestions'
import { mosaicLabelStyle } from './NumberedMosaic'
import { Mosaic, MosaicItemLabel } from './UI'

const MosaicLabelDiv = styled.div`
	${mosaicLabelStyle}
`

export default function SelectDevices({
	dottedName,
	selectedRules,
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
			<MosaicInputSuggestions
				mosaicType="selection"
				dottedName={dottedName}
				relatedRuleNames={relatedRuleNames}
				suggestions={suggestions}
			/>
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
								className={
									isNotActive
										? `ui__ card interactive inactive`
										: `ui__ card interactive ${
												value === 'oui' ? `selected` : ''
										  }`
								}
								key={name}
							>
								<MosaicItemLabel
									question={question}
									title={title}
									icônes={icônes}
									description={false}
									isNotActive={isNotActive}
								/>
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
											z-index: 0;
											max-width: 8rem;
											text-align: center;
											border: 3px solid var(--darkColor);
											color: var(--darkColor);
											font-size: 10%;
										`}
									>
										<Trans>Bientôt disponible !</Trans>
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
