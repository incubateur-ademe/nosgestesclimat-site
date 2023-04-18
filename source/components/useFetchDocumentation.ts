import { useEffect, useState } from 'react'
import useBranchData from './useBranchData'

export default () => {
	const [data, setData] = useState()
	const branchData = useBranchData()

	useEffect(() => {
		if (!branchData.loaded) return
		if (process.env.NODE_ENV === 'development') {
			setData(require('../../nosgestesclimat/public/contenu-ecrit.json'))
		} else {
			fetch(branchData.deployURL + '/contenu-ecrit.json', {
				mode: 'cors',
			})
				.then((response) => response.json())
				.then((json) => {
					setData(json)
				})
		}
	}, [branchData.deployURL, branchData.loaded])

	return data
}
