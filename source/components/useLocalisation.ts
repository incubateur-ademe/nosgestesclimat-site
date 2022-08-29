import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLocalisation } from '../actions/actions'

export const sampleIps = {
	guadeloupe: '104.250.27.0',
	france: '92.184.106.103',
	'polynésie française': '203.185.161.106',
}

export const correspondancePullRequests = {
	guadeloupe: '1339',
	'french polynesia': '1339',
}

const API =
	'https://api.ipgeolocation.io/ipgeo?apiKey=a6346b522995413a8f4578e025a3eae6'

// Other alternatives :
// https://positionstack.com/product
// https://www.abstractapi.com/ip-geolocation-api?fpr=geekflare#pricing

export default (ip) => {
	const dispatch = useDispatch()

	const localisation = useSelector((state) => state.localisation)

	useEffect(() => {
		if (localisation != null && localisation.ip == ip) return null

		const asyncFecthAPI = async (ip) => {
			await fetch(API + (ip == null ? '' : `&ip=${ip}`))
				.catch((e) => {
					console.log('erreur', e)
				})
				.then((res) => res && res.json())
				.then((data) => {
					dispatch(
						setLocalisation({
							...data,
							ip,
							country_flag:
								//https://fr.wikipedia.org/wiki/Drapeau_de_la_Guadeloupe
								data.country_name.toLowerCase() === 'guadeloupe'
									? 'https://openmoji.org/data/color/svg/1F1EC-1F1F5.svg'
									: data.country_flag,
						})
					)
				})
		}

		asyncFecthAPI(ip)
	}, [ip])

	return localisation
}
