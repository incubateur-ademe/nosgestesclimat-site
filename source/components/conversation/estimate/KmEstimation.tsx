import React from 'react'
import Input from '../Input'
import KmHelp from './KmHelp'
import { useState } from 'react'
import AnimatedTargetValue from '../../ui/AnimatedTargetValue'

export default function KmEstimation({
	commonProps,
	evaluation,
	onSubmit,
	setFinalValue,
	value,
}) {
	return (
		<div>
			<Input
				{...commonProps}
				onSubmit={onSubmit}
				unit={evaluation.unit}
				value={value}
				showAnimation
			/>
			<div>
				<KmHelp
					setFinalValue={setFinalValue}
					dottedName={commonProps.dottedName}
				/>
			</div>
		</div>
	)
}
