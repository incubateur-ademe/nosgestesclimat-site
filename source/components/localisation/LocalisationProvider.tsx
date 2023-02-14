import { useEffect } from 'react'

import useBranchData from 'Components/useBranchData'
import { useDispatch } from 'react-redux'

export default function LocalisationProvider({ children }) {
	const dispatch = useDispatch()
	const branchData = useBranchData()

	useEffect(() => {
		if (branchData.loaded) {
			const supportedRegionsURL =
				branchData.deployURL + '/supportedRegions.json'
			console.log('fetching:', supportedRegionsURL)
			fetch(supportedRegionsURL, {
				mode: 'cors',
			})
				.then((response) => response.json())
				.then((json) => {
					dispatch({
						type: 'SET_SUPPORTED_REGIONS',
						supportedRegions: json,
					})
				})
				.catch((err) => {
					console.log('url:', supportedRegionsURL)
					console.log('err:', err)
				})
		}
	}, [branchData.deployURL, branchData.loaded])

	return <>{children}</>
}
