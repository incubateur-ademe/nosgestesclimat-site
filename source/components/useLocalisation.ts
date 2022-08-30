import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLocalisation } from '../actions/actions'

export const supportedCountries = [
	{ PR: '1339', name: 'Guadeloupe', code: 'GP' },
	{ PR: null, name: 'France', code: 'FR' },
	{ name: 'Polynésie française', PR: '1339', code: 'PF' },
]

const API = '/geolocation'

// Other alternatives :
// https://positionstack.com/product
// https://www.abstractapi.com/ip-geolocation-api?fpr=geekflare#pricing

export default () => {
	const dispatch = useDispatch()

	const localisation = useSelector((state) => state.localisation)
	console.log(localisation)

	useEffect(() => {
		if (localisation != null) return undefined

		const asyncFecthAPI = async () => {
			await fetch(API)
				.catch((e) => {
					console.log('erreur', e)
				})
				.then((res) => res && res.json())
				.then(
					({
						geo: {
							country: { code, name },
						},
					}) => {
						dispatch(
							setLocalisation({
								country: {
									code,
									name,
								},
							})
						)
					}
				)
		}

		asyncFecthAPI()
		return undefined
	}, [])

	return localisation
}

export const getFlagImgSrc = (code) =>
	`https://flagcdn.com/96x72/${code.toLowerCase()}.png`
