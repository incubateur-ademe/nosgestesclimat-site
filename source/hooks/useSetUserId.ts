import { setUserId } from '@/actions/actions'
import { AppState } from '@/reducers/rootReducer'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuid } from 'uuid'

export const useSetUserId = () => {
	const dispatch = useDispatch()

	const userId = useSelector((state: AppState) => state.userId)

	useEffect(() => {
		if (!userId) {
			dispatch(setUserId(uuid()))
		}
	}, [userId, dispatch])
}
