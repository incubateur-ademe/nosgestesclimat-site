import { Evaluation } from 'publicodes'
import { InputHTMLAttributes, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AnyAction } from 'redux'
import { DottedName } from 'Rules'
import KmInput from '../estimate/KmHelp/KmInput'
import Amortissement from './Amortissement'

interface Props {
	commonProps: InputHTMLAttributes<HTMLInputElement> & {
		dottedName: DottedName
	}
	evaluation: Evaluation<DottedName>
	onSubmit: (value: string) => void
	setFinalValue: (value: string) => AnyAction
	value: string
}

export type AmortissementObject = {
	[year: string]: string
}

export default function FieldTravelDuration({
	commonProps,
	evaluation,
	onSubmit,
	setFinalValue,
	value,
}: Props) {
	const [isFormOpen, setIsFormOpen] = useState(false)

	const storedAmortissementAvion =
		useSelector((state: any) => state.storedAmortissementAvion) || {}

	const amortissementCurrent: AmortissementObject =
		storedAmortissementAvion?.[commonProps.dottedName]

	useEffect(() => {
		if (amortissementCurrent) {
			setIsFormOpen(true)
		}
	}, [amortissementCurrent])

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
				<Amortissement
					amortissementAvion={amortissementCurrent}
					setFinalValue={setFinalValue}
					dottedName={commonProps.dottedName}
					isFormOpen={isFormOpen}
					setIsFormOpen={setIsFormOpen}
				/>
			</div>
		</div>
	)
}
