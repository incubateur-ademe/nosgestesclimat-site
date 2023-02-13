import { useEffect } from 'react'

import useBranchData from 'Components/useBranchData'
import { useDispatch } from 'react-redux'

export default function LocalisationProvider({ children }) {
	const dispatch = useDispatch()
	const branchData = useBranchData()

	useEffect(() => {
		if (branchData.loaded) {
			console.log('fetching:', branchData.deployURL + '/supportedRegions.json')
			fetch(branchData.deployURL + '/supportedRegions.json', {
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
					console.log('url:', branchData.deployURL + '/supportedRegions.json')
					console.log('err:', err)
				})
		}
	}, [branchData.deployURL, branchData.loaded])

	return <>{children}</>
}
