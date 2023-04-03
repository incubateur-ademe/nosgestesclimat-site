import { useDispatch, useSelector } from 'react-redux'

export default () => {
	const dispatch = useDispatch()
	const enquête = useSelector((state) => state.enquête)
	if (!enquête) return null
	const id = enquête.userID
	const url = `https://ow3.cawi.fr/xcawi2-testlienext/${id}`
	return (
		<a href={url} target="_blank">
			<button
				className="ui__ button "
				onClick={() => dispatch({ type: 'QUIT_ENQUÊTE' })}
			>
				✅ Revenir à l'enquête
			</button>
		</a>
	)
}
