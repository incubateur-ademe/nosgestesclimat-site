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

	const shouldUseLocalFiles = !pullRequestNumber

	return {
		deployURL,
		pullRequestNumber,
		shouldUseLocalFiles,
		loaded: pullRequestNumber !== undefined,
	}
}
