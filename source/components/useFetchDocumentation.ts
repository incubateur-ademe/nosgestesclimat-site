import { useEffect, useState } from 'react'
import useBranchData from './useBranchData'

export default () => {
	const [data, setData] = useState()
	const branchData = useBranchData()

	useEffect(() => {
		if (!branchData.loaded) return
		fetch(branchData.deployURL + '/contenu-ecrit.json', {
			mode: 'cors',
		})
			.then((response) => response.json())
			.then((json) => {
				setData(json)
			})
	}, [branchData.deployURL, branchData.loaded])

	return data
}
