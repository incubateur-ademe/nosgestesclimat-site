import content from 'raw-loader!./texte.md'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Markdown } from '../../../components/utils/markdown'

export default () => {
	const dispatch = useDispatch()
	const enquête = useSelector((state) => state.enquête)
	const userID = useParams().userID

	useEffect(() => {
		if (!enquête)
			dispatch({ type: 'SET_ENQUÊTE', userID, date: new Date().toString() })
	}, [])
	return (
		<div css="max-width: 750px">
			<Markdown>{content}</Markdown>
			<Link to="/simulateur/bilan">
				<button className="ui__ button cta">Commencer le parcours</button>
			</Link>
		</div>
	)
}
