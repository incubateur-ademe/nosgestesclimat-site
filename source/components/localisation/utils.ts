/*
	This module contains all types and functions related to the localisation of the model.

	Important: the localisation is not the same as the translation!
	The localisation is about which model to use (i.e. how to compute the quantity of CO2),
	whereas the translation is about the text displayed to the user.
*/

import { useSelector } from 'react-redux'
import frenchCountryPrepositions from './frenchCountryPrepositions.yaml'
import useSupportedCountries from './useSupportedRegions'

export const supportedRegion = (inputCode) => {
	const supportedRegions =
		useSelector((state) => state.supportedRegions) ?? useSupportedCountries()
	if (!inputCode) {
		return undefined
	}
	return supportedRegions[inputCode]
}

export const getFlag = (inputCode) => {
	const regionParams = supportedRegion(inputCode)
	const code = regionParams?.drapeau || inputCode
	return getFlagImgSrc(code)
}

export const getModelFlag = (inputCode) => {
	const regionParams = supportedRegion(inputCode)
	const code = supportedRegion(inputCode)
		? regionParams?.drapeau || inputCode
		: 'FR'
	return getFlagImgSrc(code)
}

export const getFlagImgSrc = (inputCode) =>
	//	code && `https://flagcdn.com/96x72/${code.toLowerCase()}.png`
	//	was down 27/09
	inputCode &&
	`https://cdn.jsdelivr.net/npm/svg-country-flags@1.2.10/svg/${inputCode.toLowerCase()}.svg`

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
