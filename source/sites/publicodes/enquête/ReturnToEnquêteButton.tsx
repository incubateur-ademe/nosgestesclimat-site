import { useDispatch, useSelector } from 'react-redux'
import { useTestCompleted } from '../../../selectors/simulationSelectors'

export default () => {
	const dispatch = useDispatch()
	const enquête = useSelector((state) => state.enquête)
	const testCompleted = useTestCompleted()
	if (!enquête) return null
	const id = enquête.userID
	const url = `https://ow3.cawi.fr/xcawi2-testlienext/${id}`
	return (
		<a
			href={url}
			target="_blank"
			css={!testCompleted ? 'pointer-events: none;' : ''}
		>
			<button
				className={'ui__ button ' + (!testCompleted ? 'disabled' : '')}
				onClick={() => dispatch({ type: 'QUIT_ENQUÊTE' })}
			>
				✅ Revenir à l'enquête
			</button>
		</a>
	)
}
