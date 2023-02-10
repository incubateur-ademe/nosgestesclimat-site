import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useBranchData from '../useBranchData'

export default () => {
	const dispatch = useDispatch()
	const branchData = useBranchData()

	const supportedRegions = useSelector((state) => state.supportedRegions)

	useEffect(() => {
		if (branchData.loaded && !Object.entries(supportedRegions).length) {
			console.log(`fetching: ${branchData.deployURL}/supportedCountries.json`)
			fetch(branchData.deployURL + '/supportedCountries.json', {
				mode: 'cors',
			})
				.then((response) =>
					response.ok
						? response.json()
						: {
								FR: {
									nom: 'France métropolitaine',
									gentilé: 'française',
									code: 'FR',
								},
						  }
				)
				.then((json) => {
					dispatch({
						type: 'SET_SUPPORTED_REGIONS',
						supportedRegions: json,
					})
				})
		}
	}, [supportedRegions, branchData.deployURL, branchData.loaded])

	return supportedRegions
}
