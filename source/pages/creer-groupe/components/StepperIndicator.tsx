import { Trans } from 'react-i18next'

type Props = {
	currentStep: string | number
	numberSteps: string | number
}

export default function StepperIndicator({ currentStep, numberSteps }: Props) {
	return (
		<p className="text-pink-700 mb-2 font-bold">
			<Trans>
				Étape {String(currentStep)} sur {String(numberSteps)}
			</Trans>
		</p>
	)
}
