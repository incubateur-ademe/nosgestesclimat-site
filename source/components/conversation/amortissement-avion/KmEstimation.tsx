import { Evaluation } from 'publicodes'
import { InputHTMLAttributes, useState } from 'react'
import { DottedName } from 'Rules'
import KmInput from '../estimate/KmHelp/KmInput'
import KmHelp from './KmHelp'

interface Props {
	commonProps: InputHTMLAttributes<HTMLInputElement> & {
		dottedName: DottedName
	}
	evaluation: Evaluation<DottedName>
	onSubmit: (value: string) => void
	setFinalValue: (value: string) => void
	value: string
}

export default function KmEstimation({
	commonProps,
	evaluation,
	onSubmit,
	setFinalValue,
	value,
}: Props) {
	const [isFormOpen, setIsFormOpen] = useState(false)
	return (
		<div>
			<KmInput
				{...commonProps}
				onSubmit={onSubmit}
				unit={evaluation.unit}
				value={value}
				isFormOpen={isFormOpen}
				isDisabled={isFormOpen}
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
