import { useEffect } from 'react'
import { usePersistingState } from './utils/persistState'

export default () => {
	const urlParams = new URLSearchParams(window.location.search)
	/* This enables loading the rules of a branch,
	 * to showcase the app as it would be once this branch of -data  has been merged*/
	const branch = urlParams.get('branch')

	const [pullRequestNumber, setPullRequestNumber] = usePersistingState(
		'PR',
		null
	)

	const searchPR = urlParams.get('PR')

	useEffect(() => setPullRequestNumber(searchPR), [searchPR])

	const deployURL = `https://${
		branch
			? `${branch}--`
			: pullRequestNumber
			? `deploy-preview-${pullRequestNumber}--`
			: ''
	}ecolab-data.netlify.app`

	const shouldUseLocalFiles =
		NODE_ENV === 'development' && !(branch || pullRequestNumber)

	console.log('PR', pullRequestNumber, deployURL)

	return { deployURL, branch, pullRequestNumber, shouldUseLocalFiles }
}
