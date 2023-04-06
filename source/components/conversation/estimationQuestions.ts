import { DottedName } from 'Rules'
import EstimationAvion from './amortissement-avion/KmEstimation'
import KmEstimation from './estimate/KmEstimation'

const estimationQuestions: Array<{
	isApplicable: Function
	component: React.FunctionComponent
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
		component: EstimationAvion,
	},
	{
		dottedName: 'transport . avion . moyen courrier . heures de vol',
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('transport . avion . moyen courrier . heures de vol'),
		component: EstimationAvion,
	},
	{
		dottedName: 'transport . avion . long courrier . heures de vol',
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('transport . avion . long courrier . heures de vol'),
		component: EstimationAvion,
	},
]

export default estimationQuestions
