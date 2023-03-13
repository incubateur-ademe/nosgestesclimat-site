import { useSelector } from 'react-redux'
import { situationSelector } from '../../../selectors/simulationSelectors'

export default ({}) => {
	const { userID } = useSelector((state) => state.enquête)
	const situation = useSelector(situationSelector),
		situationQueryString = Object.entries(situation).reduce(
			(memo, [k, v]) =>
				memo +
				(!memo.length ? '?' : '&') +
				encodeURIComponent(k) +
				'=' +
				encodeURIComponent(typeof v === 'object' ? v.valeur : v),
			''
		)
	return (
		<a
			href={`/enquête/${userID}${situationQueryString}`}
			className="ui__ button cta"
		>
			Envoyer mes résultats
		</a>
	)
}
