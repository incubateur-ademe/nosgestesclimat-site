import { useDispatch, useSelector } from 'react-redux'
import { useTestCompleted } from '../../../selectors/simulationSelectors'
import { enquêteSelector } from './enquêteSelector'

export default ({ simple }) => {
	const dispatch = useDispatch()
	const enquête = useSelector(enquêteSelector)
	const testCompleted = useTestCompleted()
	if (!enquête) return null
	const id = enquête.userID
	const url = `https://nosgestesclimat.fr`
	return (
		<a
			href={url}
			target="_blank"
			css={!testCompleted ? 'pointer-events: none;' : ''}
			className={
				simple ? '' : 'ui__ button ' + (!testCompleted ? 'disabled' : '')
			}
			onClick={() => dispatch({ type: 'QUIT_ENQUÊTE' })}
		>
			✅ Continuer l'enquête
		</a>
	)
}
