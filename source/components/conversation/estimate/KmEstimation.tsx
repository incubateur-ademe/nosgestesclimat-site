import { FormOpenStateProvider } from '../../../contexts/FormOpenStateContext'
import KmHelp from './KmHelp'
import KmInput from './KmHelp/KmInput'

export default function KmEstimation({
	commonProps,
	evaluation,
	onSubmit,
	setFinalValue,
	value,
}) {
	return (
		<div>
			<FormOpenStateProvider>
				<KmInput
					{...commonProps}
					onSubmit={onSubmit}
					unit={evaluation.unit}
					value={value}
				/>
				<div>
					<KmHelp
						setFinalValue={setFinalValue}
						dottedName={commonProps.dottedName}
					/>
				</div>
			</FormOpenStateProvider>
		</div>
	)
}
