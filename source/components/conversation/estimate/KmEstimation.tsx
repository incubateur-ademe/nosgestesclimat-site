import React from 'react'
import Input from '../Input'
import KmHelp from './KmHelp'
import { useState } from 'react'

export default function KmEstimation({
	commonProps,
	evaluation,
	onSubmit,
	setFinalValue,
	value,
}) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div>
			<Input
				{...commonProps}
				onSubmit={onSubmit}
				unit={evaluation.unit}
				value={value}
				suggestions={null}
			/>
			<div
				css={`
					display: block;
				`}
			>
				<KmHelp setFinalValue={setFinalValue} />
			</div>
		</div>
	)
}
