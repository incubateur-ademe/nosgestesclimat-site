import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { usePersistingState } from './utils/persistState'
import useLocalisation, {
	correspondancePullRequests,
} from 'Components/useLocalisation'

export default () => {
	const urlParams = new URLSearchParams(window.location.search)
	/* This enables loading the rules of a branch,
	 * to showcase the app as it would be once this branch of -data  has been merged*/
	const branch = urlParams.get('branch')
	const localisation = useSelector((state) => state.localisation)

	const [pullRequestNumber, setPullRequestNumber] = usePersistingState(
		'PR',
		undefined
	)

	const searchPR = urlParams.get('PR')

	const localisationPR =
		correspondancePullRequests[localisation?.country_name.toLowerCase()]

	useEffect(() => {
		// if pullRequestNumber is undefined, then this hook hasn't been triggered yet
		if (localisationPR != null) {
			setPullRequestNumber(localisationPR)
		} else if (searchPR != null) {
			// setting should be triggered by an explicit ?PR=, not the absence of it when navigating
			setPullRequestNumber(searchPR)
		} else {
			if (!pullRequestNumber || !localisationPR)
				// No PR should be loaded, we know that now
				setPullRequestNumber(null)
		}
	}, [searchPR, localisationPR, pullRequestNumber])

	const deployURL = `https://${
		branch
			? `${branch}--`
			: pullRequestNumber
			? `deploy-preview-${pullRequestNumber}--`
			: ''
	}ecolab-data.netlify.app`

	const shouldUseLocalFiles = !(branch || pullRequestNumber)

	return {
		deployURL,
		pullRequestNumber,
		shouldUseLocalFiles,
		loaded: pullRequestNumber !== undefined,
	}
}
