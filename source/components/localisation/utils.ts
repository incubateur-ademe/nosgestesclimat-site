/*
	This module contains all types and functions related to the localisation of the model.

	Important: the localisation is not the same as the translation!
	The localisation is about which model to use (i.e. how to compute the quantity of CO2),
	whereas the translation is about the text displayed to the user.
*/

import { useMemo } from 'react'
import frenchCountryPrepositions from './frenchCountryPrepositions.yaml'
import supportedCountriesYAML from './supportedCountries.yaml'

export type Region = {
	PR: string
	nom: string
	code: string
	gentilé: string
	drapeau: string
}

// Object.hasOwn(obj, idx)

export const supportedRegions: Region[] = supportedCountriesYAML
// Other alternatives :
// https://positionstack.com/product
// https://www.abstractapi.com/ip-geolocation-api?fpr=geekflare#pricing

export const useFlag = (localisation) => {
	const flag = useMemo(() => {
		if (localisation?.country?.code != null) {
			if (isSupportedRegion(localisation?.country?.code)) {
				return getSupportedFlag(localisation?.country.code)
			} else {
				return getFlagImgSrc('FR')
			}
		}
	}, [localisation])

	return flag
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

export const getSupportedFlag = (inputCode) => {
	if (!inputCode) return

	const supported = supportedRegions.find((c) => c.code === inputCode)

	const code = supported?.drapeau || inputCode

	return getFlagImgSrc(code)
}

export const isSupportedRegion = (inputCode) => {
	if (!inputCode) {
		return undefined
	}

	const supported = supportedRegions.find((c) => c.code === inputCode)
	if (supported?.inactif === 'oui') {
		return false
	}
	return supported
}
