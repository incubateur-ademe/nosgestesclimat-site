import React from 'react'
import Input from '../Input'
import KmHelp from '../KmHelp'
import { useState } from 'react'

export default function KmEstimation({
	commonProps,
	evaluation,
	onSubmit,
	value,
}) {
	const [sum, updateSum] = useState(0)
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
				<div> Le résultat du calul : {sum} </div>
				<KmHelp sum={sum} updateSum={updateSum} />
			</div>
		</div>
	)
}
