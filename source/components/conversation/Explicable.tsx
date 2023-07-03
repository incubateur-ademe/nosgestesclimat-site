import { explainVariable } from '@/actions/actions'
import { getMatomoEventClickHelp } from '@/analytics/matomo-events'
import '@/components/conversation/Explicable.css'
import { DottedName } from '@/components/publicodesUtils'
import { MatomoContext } from '@/contexts/MatomoContext'
import { AppState } from '@/reducers/rootReducer'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export function ExplicableRule({ dottedName }: { dottedName: DottedName }) {
	const { trackEvent } = useContext(MatomoContext)
	const explained = useSelector((state: AppState) => state.explainedVariable)
	const dispatch = useDispatch()

	// Rien à expliquer ici, ce n'est pas une règle
	if (dottedName == null) {
		return null
	}

	return (
		<button
			type="button"
			onClick={(e) => {
				trackEvent(getMatomoEventClickHelp(dottedName))
				if (explained === dottedName) {
					return dispatch(explainVariable(null))
				}
				dispatch(explainVariable(dottedName))
				e.preventDefault()
				e.stopPropagation()
			}}
			css={`
				margin-left: 0.3rem !important;
				font-size: 110% !important;
				padding-left: 0.6rem;
				padding: 0;
			`}
		>
			<img
				src="/images/info.svg"
				width="10"
				height="10"
				css={`
					width: 2rem;
					height: auto;
					vertical-align: middle;
					margin-bottom: 0.2rem;
				`}
				alt="Obtenir de l'aide pour cette saisie"
			/>
		</button>
	)
}
