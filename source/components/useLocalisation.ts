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
	'polynésie française': '1339',
}

const API =
	'https://api.ipgeolocation.io/ipgeo?apiKey=a012a48f6d0244ed967df27ce20415ab'

// Other alternatives :
// https://positionstack.com/product
// https://www.abstractapi.com/ip-geolocation-api?fpr=geekflare#pricing

export default (ip) => {
	const localisation = useSelector((state) => state.localisation),
		dispatch = useDispatch()

	useEffect(() => {
		return async () => {
			console.log('in ue', ip, localisation?.ip)
			if (localisation && localisation.ip == ip) return null

			const req = await fetch(API + (ip == null ? '' : `&ip=${ip}`)),
				data = await req.json()

			console.log(data.ip, data.country_name)

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
		}
	}, [ip])
	return localisation
}
