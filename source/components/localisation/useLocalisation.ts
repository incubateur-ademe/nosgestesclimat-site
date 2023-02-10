import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLocalisation } from '../../actions/actions'

const API = '/geolocation'

// Other alternatives :
// https://positionstack.com/product
// https://www.abstractapi.com/ip-geolocation-api?fpr=geekflare#pricing

export default () => {
	const dispatch = useDispatch()

	const localisation = useSelector((state) => state.localisation)

	useEffect(() => {
		if (localisation?.country != null) return

		const asyncFecthAPI = async () => {
			await fetch(API)
				.then((res) => {
					const json = res.json()
					return json
				})
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
				.catch((e) => {
					console.log(
						'erreur dans la récupération des infos de localisation\n\n',
						'La fonction Edge de localisation ne semble pas activée. Vous êtes en développement ? Essayez `netlify dev` plutôt que `yarn start`',
						e
					)
				})
		}

		asyncFecthAPI()
		return undefined
	}, [localisation])

	return localisation
}
