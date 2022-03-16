import { useEffect } from 'react'

export default () => {
	useEffect(() => {
		return async () => {
			const req = await fetch(`https://ip-api.com/json`),
				data = await req.json()
			console.log(data)
		}
	}, [])
}
