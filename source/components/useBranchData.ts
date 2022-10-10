import supportedCountries from 'Components/localisation/supportedCountries.yaml'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useLocalStorageState from 'use-local-storage-state'

export default () => {
	const dispatch = useDispatch()
	const urlParams = new URLSearchParams(window.location.search)

	const searchPR = urlParams.get('PR')

	const pullRequestNumber = useSelector((state) => state.pullRequestNumber)
	const setPullRequestNumber = (number) =>
		dispatch({ type: 'SET_PULL_REQUEST_NUMBER', number })

	console.log('pn', pullRequestNumber)

	useEffect(() => {
		if (pullRequestNumber) return
		if (searchPR) {
			setPullRequestNumber(searchPR)
			return
		}
	}, [searchPR, pullRequestNumber])

	const deployURL = `https://${
		pullRequestNumber ? `deploy-preview-${pullRequestNumber}--` : ''
	}ecolab-data.netlify.app`

	// this enables loading files from the side ../nosgestesclimat directory,
	// BUT with a priority if a PR is being tested locally
	// it lets us test and use this PR loading functionnality in local mode
	const shouldUseLocalFiles = NODE_ENV === 'development' && !pullRequestNumber

	const loaded = pullRequestNumber != undefined || shouldUseLocalFiles

	return {
		deployURL,
		pullRequestNumber,
		shouldUseLocalFiles,
		loaded,
	}
}
