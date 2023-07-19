import FieldTravelDuration from '@/components/conversation/amortissement-avion/FieldTravelDuration'
import KmEstimation from '@/components/conversation/estimate/KmEstimation'
import { DottedName } from '@/components/publicodesUtils'
import { Evaluation } from 'publicodes'
import { InputHTMLAttributes } from 'react'

const estimationQuestions: Array<{
	isApplicable: (dottedName: DottedName) => boolean
	component: ({
		dottedName,
		commonProps,
		evaluation,
		onSubmit,
		setFinalValue,
	}: {
		dottedName: DottedName
		commonProps: InputHTMLAttributes<HTMLInputElement> & {
			dottedName: DottedName
		}
		evaluation: Evaluation
		onSubmit: () => void
		setFinalValue: () => void
	}) => JSX.Element
	dottedName: DottedName
}> = [
	{
		dottedName: 'transport . voiture . km',
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('transport . voiture . km'),
		component: KmEstimation,
	},
	{
		dottedName: 'transport . avion . court courrier . heures de vol',
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('transport . avion . court courrier . heures de vol'),
		component: (props) => (
			<FieldTravelDuration
				{...props}
				key="transport . avion . court courrier . heures de vol"
			/>
		),
	},
	{
		dottedName: 'transport . avion . moyen courrier . heures de vol',
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('transport . avion . moyen courrier . heures de vol'),
		component: (props) => (
			<FieldTravelDuration
				{...props}
				key="transport . avion . moyen courrier . heures de vol"
			/>
		),
	},
	{
		dottedName: 'transport . avion . long courrier . heures de vol',
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('transport . avion . long courrier . heures de vol'),
		component: (props) => (
			<FieldTravelDuration
				{...props}
				key="transport . avion . long courrier . heures de vol"
			/>
		),
	},
]

export default estimationQuestions
