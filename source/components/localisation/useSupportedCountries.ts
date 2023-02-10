import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useBranchData from '../useBranchData'

export default () => {
	const dispatch = useDispatch()
	const branchData = useBranchData()

	const supportedRegions = useSelector((state) => state.supportedRegions)

	useEffect(() => {
		if (!branchData.loaded) return
		if (Object.entries(supportedRegions).length !== 0) return
		console.log('fetching: /supportedCountries.json')
		fetch(branchData.deployURL + '/supportedCountries.json', {
			mode: 'cors',
		})
			.then((response) => response.json())
			.then((json) => {
				dispatch({
					type: 'SET_SUPPORTED_REGIONS',
					supportedRegions: json,
				})
			})
		return undefined
	}, [supportedRegions, branchData.deployURL, branchData.loaded])

	return supportedRegions
}
