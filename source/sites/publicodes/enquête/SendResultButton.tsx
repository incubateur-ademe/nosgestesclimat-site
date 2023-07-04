import { buildEndURL } from '@/components/SessionBar'
import { useEngine } from '@/components/utils/EngineContext'
import { AppState } from '@/reducers/rootReducer'
import { situationSelector } from '@/selectors/simulationSelectors'
import { enquêteSelector } from '@/sites/publicodes/enquête/enquêteSelector'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'

export default ({}) => {
	const { userID } = useSelector(enquêteSelector)
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
	const engine = useEngine()
	const rules = useSelector((state: AppState) => state.rules)
	const endURL = buildEndURL(rules, engine)
	const endQueryString = endURL?.replace('/fin?', '&')

	return (
		<a
			href={`/enquête/${userID}${situationQueryString}${endQueryString}&login=${userID}`}
			className="ui__ button cta"
		>
			<Trans>Envoyer mes résultats</Trans>
		</a>
	)
}
