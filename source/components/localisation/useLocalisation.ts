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

	useEffect(() => {
		if (localisation != null) return undefined

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
	}, [])

	return localisation
}

export const getFlagImgSrc = (code) =>
	code && `https://flagcdn.com/96x72/${code.toLowerCase()}.png`

export const getCountryNameInFrench = (code) => {
	// For now, website is only available in French, this function enables to adapt message for French Language according to the country detected.
	// Including French prepositions subtelties.
	if (!code) return
	const regionNamesInFrench = new Intl.DisplayNames(['fr'], { type: 'region' }),
		countryName = regionNamesInFrench.of(code),
		preposition = (countryName && frenchCountryPrepositions[countryName]) || ''
	return `${preposition} ${countryName}`
}

export const getSupportedFlag = (localisation) => {
	console.log(localisation)
	if (!localisation) return

	const supported = supportedCountries.find(
		(c) => c.code === localisation.country.code
	)
	if (supported.PR === undefined) return
	const code = supported.drapeau || supported.code
	return getFlagImgSrc(code)
}
