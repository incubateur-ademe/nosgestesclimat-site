import { updateSituation } from 'Actions/actions'
import React from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import { useEngine } from '../../utils/EngineContext'
import { Mosaic } from './UI'
import Input from '../Input'
import { InputCommonProps } from './RuleInput'
export default function KmEstimation(
	{ ...commonProps }: InputCommonProps,
	{ dottedName }
) {
	const dispatch = useDispatch()
	const situation = useSelector(situationSelector)
	const engine = useEngine()
	console.log(dottedName)
	return (
		<div>
			<div>{dottedName}</div>
			<Input {...commonProps} />
		</div>
	)
}
