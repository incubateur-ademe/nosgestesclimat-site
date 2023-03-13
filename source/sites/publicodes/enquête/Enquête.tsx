import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

export default () => {
	const dispatch = useDispatch()
	const enquête = useSelector((state) => state.enquête)
	const userID = useParams().userID

	useEffect(() => {
		if (!enquête)
			dispatch({ type: 'SET_ENQUÊTE', userID, date: new Date().toString() })
	}, [])
	return <div>Salut</div>
}
