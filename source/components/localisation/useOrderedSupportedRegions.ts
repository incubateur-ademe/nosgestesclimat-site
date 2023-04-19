import { useSelector } from 'react-redux'

export default () => {
	const currentLang = useSelector((state) => state.currentLang).toLowerCase()

	const supportedRegions = useSelector((state) => state.supportedRegions)
	// Regions displayed sorted alphabetically
	const orderedSupportedRegions = Object.fromEntries(
		Object.entries(supportedRegions)
			// sort function from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
			.sort((a, b) => {
				const nameA = a[1][currentLang]?.nom.toUpperCase() // ignore upper and lowercase
				const nameB = b[1][currentLang]?.nom.toUpperCase() // ignore upper and lowercase
				if (nameA < nameB) {
					return -1
				}
				if (nameA > nameB) {
					return 1
				}
				// names must be equal
				return 0
			})
	)
	return orderedSupportedRegions
}
