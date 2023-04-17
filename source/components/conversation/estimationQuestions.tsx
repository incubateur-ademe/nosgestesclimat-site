import { Evaluation } from 'publicodes'
import { InputHTMLAttributes } from 'react'
import { DottedName } from 'Rules'
import FieldTravelDuration from './amortissement-avion/FieldTravelDuration'
import KmEstimation from './estimate/KmEstimation'

const estimationQuestions: Array<{
	isApplicable: Function
	component: ({
		dottedName,
		commonProps,
		evaluation,
		onSubmit,
		setFinalValue,
		value,
	}: {
		dottedName: DottedName
		commonProps: InputHTMLAttributes<HTMLInputElement> & {
			dottedName: DottedName
		}
		evaluation: Evaluation
		onSubmit: () => void
		setFinalValue: () => void
		value: string
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
