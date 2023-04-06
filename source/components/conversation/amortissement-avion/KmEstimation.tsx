import { Evaluation } from 'publicodes'
import { InputHTMLAttributes } from 'react'
import { DottedName } from 'Rules'
import Input from '../Input'
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
	return (
		<div>
			<Input
				{...commonProps}
				onSubmit={onSubmit}
				unit={evaluation.unit}
				value={value}
				showAnimation
				idDescription={'explicationResultatAideKm'}
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
