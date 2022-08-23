import { useEffect, useState } from 'react'
import useBranchData from './useBranchData'

export default () => {
	const [data, setData] = useState()
	const branchData = useBranchData()

	useEffect(() => {
		if (!branchData.loaded) return
		if (NODE_ENV === 'development' && branchData.shouldUseLocalFiles) {
			const req = require.context(
				'raw-loader!../../../nosgestesclimat/documentation/',
				true,
				/\.(md)$/
			)

			const fileData = Object.fromEntries(
				req
					.keys()
					.map((path) => [path.replace(/(\.\/|\.md)/g, ''), req(path).default])
			)

			setData(fileData)
		} else {
			fetch(branchData.deployURL + '/documentation.json', {
				mode: 'cors',
			})
				.then((response) => response.json())
				.then((json) => {
					setData(json)
				})
		}
	}, [branchData.deployURL, branchData.loaded, branchData.shouldUseLocalFiles])

	return data
}
