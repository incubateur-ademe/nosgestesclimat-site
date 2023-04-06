import { useState } from 'react'
import KmHelp from './KmHelp'
import KmInput from './KmHelp/KmInput'

export default function KmEstimation({
	commonProps,
	evaluation,
	onSubmit,
	setFinalValue,
	value,
}) {
	const [isFormOpen, setIsFormOpen] = useState(false)
	return (
		<div>
			<KmInput
				{...commonProps}
				onSubmit={onSubmit}
				unit={evaluation.unit}
				value={value}
				isFormOpen={isFormOpen}
			/>
			<div>
				<KmHelp
					setFinalValue={setFinalValue}
					dottedName={commonProps.dottedName}
					isFormOpen={isFormOpen}
					setIsFormOpen={setIsFormOpen}
				/>
			</div>
		</div>
	)
}
