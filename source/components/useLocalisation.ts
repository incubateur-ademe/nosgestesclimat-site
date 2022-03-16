import { useEffect } from 'react'

const API =
	'https://api.ipgeolocation.io/ipgeo?apiKey=a012a48f6d0244ed967df27ce20415ab'

// Other alternatives :
// https://positionstack.com/product
// https://www.abstractapi.com/ip-geolocation-api?fpr=geekflare#pricing

export default () => {
	useEffect(() => {
		return async () => {
			const req = await fetch(API),
				data = await req.json()
			console.log(data)
		}
	}, [])
}
