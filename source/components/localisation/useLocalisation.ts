/*
	This module contains all types and functions related to the localisation of the model.

	Important: the localisation is not the same as the translation!
	The localisation is about which model to use (i.e. how to compute the quantity of CO2),
	whereas the translation is about the text displayed to the user.
*/

import { useDispatch, useSelector } from 'react-redux'
import { setLocalisation } from '../../actions/actions'
import frenchCountryPrepositions from './frenchCountryPrepositions.yaml'
import supportedCountriesYAML from './supportedCountries.yaml'

const API = '/geolocation'

export type Region = {
	PR: string
	nom: string
	code: string
	gentilé: string
	drapeau: string
}

export const supportedRegions: Region[] = supportedCountriesYAML

// Other alternatives :
// https://positionstack.com/product
// https://www.abstractapi.com/ip-geolocation-api?fpr=geekflare#pricing

export default () => {
	const dispatch = useDispatch()

	const localisation = useSelector((state) => state.localisation)

	useEffect(() => {
		if (localisation?.country != null) return

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
	}, [localisation])

	return localisation
}

export const getFlagImgSrc = (code) =>
	//	code && `https://flagcdn.com/96x72/${code.toLowerCase()}.png`
	//	was down 27/09
	code &&
	`https://cdn.jsdelivr.net/npm/svg-country-flags@1.2.10/svg/${code.toLowerCase()}.svg`

export const getCountryNameInFrench = (code) => {
	// For now, website is only available in French, this function enables to adapt message
	// for French Language according to the country detected.
	// Including French prepositions subtelties.
	if (!code) {
		return undefined
	}
	const regionNamesInFrench = new Intl.DisplayNames(['fr'], { type: 'region' }),
		countryNameAuto = regionNamesInFrench.of(code),
		countryName =
			countryNameAuto === 'France' ? 'France métropolitaine' : countryNameAuto,
		preposition = (countryName && frenchCountryPrepositions[countryName]) || ''

	return `${preposition} ${countryName}`
}

export const getSupportedFlag = (localisation) => {
	if (!localisation) return

	const supported = supportedRegions.find(
		(c) => c.code === localisation.country.code
	)

	const code = supported?.drapeau || localisation?.country.code

	return getFlagImgSrc(code)
}

export const isSupportedRegion = (inputCode) => {
	if (!inputCode) {
		return undefined
	}

	const supported = supportedRegions.find(
		(c) => c.code === localisation.country.code
	)
	if (supported?.inactif === 'oui') {
		return false
	}
	return supported
}
