import { loadResources } from 'i18next'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLocalisation } from '../../actions/actions'
import frenchCountryPrepositions from './frenchCountryPrepositions.yaml'
import supportedCountries from './supportedCountries.yaml'

const API = '/geolocation'

// Other alternatives :
// https://positionstack.com/product
// https://www.abstractapi.com/ip-geolocation-api?fpr=geekflare#pricing

export default () => {
	const dispatch = useDispatch()

	const localisation = useSelector((state) => state.localisation)
	const pullRequestNumber = useSelector((state) => state.pullRequestNumber)
	const setPullRequestNumber = (number) =>
		dispatch({ type: 'SET_PULL_REQUEST_NUMBER', number })

	useEffect(() => {
		if (localisation != null) {
			if (!pullRequestNumber) {
				const localisationPR = getLocalisationPullRequest(localisation)
				setPullRequestNumber(localisationPR)
			}
			return
		}

		const asyncFecthAPI = async () => {
			await fetch(API)
				.then((res) => {
					const json = res.json()
					return json
				})
				.then(
					({
						geo: {
							country: { code, name },
						},
					}) => {
						dispatch(
							setLocalisation({
								country: {
									code,
									name,
								},
							})
						)
					}
				)
				.catch((e) => {
					console.log(
						'erreur dans la récupération des infos de localisation\n\n',
						'La fonction Edge de localisation ne semble pas activée. Vous êtes en développement ? Essayez `netlify dev` plutôt que `yarn start`',
						e
					)
				})
		}

		asyncFecthAPI()
		return undefined
	}, [localisation, pullRequestNumber])

	return localisation
}

export const getFlagImgSrc = (code) =>
	//	code && `https://flagcdn.com/96x72/${code.toLowerCase()}.png`
	//	was down 27/09
	code &&
	`https://cdn.jsdelivr.net/npm/svg-country-flags@1.2.10/svg/${code.toLowerCase()}.svg`

export const getCountryNameInFrench = (code) => {
	// For now, website is only available in French, this function enables to adapt message for French Language according to the country detected.
	// Including French prepositions subtelties.
	if (!code) return
	const regionNamesInFrench = new Intl.DisplayNames(['fr'], { type: 'region' }),
		countryNameAuto = regionNamesInFrench.of(code),
		countryName =
			countryNameAuto === 'France' ? 'France métropolitaine' : countryNameAuto,
		preposition = (countryName && frenchCountryPrepositions[countryName]) || ''
	return `${preposition} ${countryName}`
}

export const getSupportedFlag = (localisation) => {
	if (!localisation) return

	const supported = supportedCountries.find(
		(c) => c.code === localisation.country.code
	)

	const code = supported?.drapeau || localisation?.country.code

	return getFlagImgSrc(code)
}

export const getLocalisationPullRequest = (localisation) => {
	const supported = supportedCountry(localisation)
	if (!supported) return null
	return supported.PR
}

export const supportedCountry = (localisation) => {
	if (!localisation) return
	const supported = supportedCountries.find(
		(c) => c.code === localisation.country.code
	)
	if (supported?.inactif === 'oui') return null
	return supported
}
