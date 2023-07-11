import MosaicInputSuggestions from '@/components/conversation/MosaicInputSuggestions'
import MosaicStamp from '@/components/conversation/select/MosaicStamp'
import { Mosaic, MosaicItemLabel } from '@/components/conversation/select/UI'
import Checkbox from '@/components/ui/Checkbox'
import { situationSelector } from '@/selectors/simulationSelectors'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { updateSituation } from '../../../actions/actions'

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

	// for now, if nothing is checked, after having check something,
	// 'suivant' button will have same effect as 'je ne sais pas'
	// we can imagine a useeffect that set to 0 situation
	// of dottedname every time all card are unchecked
	// (after user checked something at least once)

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
							rawNode: { icônes },
						},
						question,
					]) => {
						const situationValue = situation[question.dottedName]
						const value =
							situationValue != null
								? situationValue
								: // unlike the NumberedMosaic, we don't preselect cards choices here
								  // user tests showed us it is now well received
								  'non'
						const isNotActive = 'inactif' in question.rawNode

						return (
							<li
								className={
									isNotActive
										? 'ui__ card interactive inactive'
										: `ui__ card interactive transparent-border ${
												value === 'oui' ? 'selected' : ''
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
														value === 'oui' ? 'non' : 'oui'
													)
												)
											}
										/>
									</div>
								)}
								{isNotActive && (
									<MosaicStamp>
										<Trans>Bientôt disponible !</Trans>
									</MosaicStamp>
								)}
							</li>
						)
					}
				)}
			</Mosaic>
		</div>
	)
}
