import { explainVariable } from 'Actions/actions'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DottedName } from 'Rules'
import { TrackerContext } from '../../contexts/TrackerContext'
import './Explicable.css'

export function ExplicableRule({ dottedName }: { dottedName: DottedName }) {
	const { trackEvent } = useContext(TrackerContext)
	const explained = useSelector((state: RootState) => state.explainedVariable)
	const dispatch = useDispatch()

	// Rien à expliquer ici, ce n'est pas une règle
	if (dottedName == null) return null

	return (
		<button
			type="button"
			onClick={(e) => {
				trackEvent(['trackEvent', 'help', dottedName])
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
