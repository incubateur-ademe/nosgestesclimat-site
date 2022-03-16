import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLocalisation } from '../actions/actions'

const API =
	'https://api.ipgeolocation.io/ipgeo?apiKey=a012a48f6d0244ed967df27ce20415ab'

// Other alternatives :
// https://positionstack.com/product
// https://www.abstractapi.com/ip-geolocation-api?fpr=geekflare#pricing

export default () => {
	const localisation = useSelector((state) => state.localisation),
		dispatch = useDispatch()

	useEffect(() => {
		return async () => {
			if (localisation) return null

			const req = await fetch(API),
				data = await req.json()

			console.log(data)

			dispatch(setLocalisation(data))
		}
	}, [])
	return localisation
}
