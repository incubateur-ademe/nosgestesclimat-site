/*
	This module contains all types and functions related to the localisation of the model.

	Important: the localisation is not the same as the translation!
	The localisation is about which model to use (i.e. how to compute the quantity of CO2),
	whereas the translation is about the text displayed to the user.
*/

import { useSelector } from 'react-redux'
import { AppState } from '../../reducers/rootReducer'
import frenchCountryPrepositions from './frenchCountryPrepositions.yaml'

export type RegionCode = string

export type RegionAuthor = {
	nom: string
	url?: string
}

export type RegionParams = {
	code: RegionCode
	nom: string
	gentilé: string
	authors?: RegionAuthor[]
	drapeau?: string
}

export type Region = {
	fr: RegionParams
	en: RegionParams
}

export type SupportedRegions = {
	[code: RegionCode]: Region
}

export type Localisation = {
	country: { code: RegionCode; name: string }
	userChosen: boolean
}

export const defaultModelRegionCode = 'FR'

/**
 * This function is not pure, it uses useSelector, dont't call it
 * conditionally !!
 */
export function getSupportedRegion(
	inputCode: RegionCode | undefined
): Region | undefined {
	const supportedRegions: SupportedRegions = useSelector(
		(state: AppState) => state.supportedRegions
	)

	// Check for undefined AFTER useSelector, because hooks can't be called conditionally
	if (inputCode === undefined) {
		return undefined
	}

	return supportedRegions[inputCode]
}

/**
 * This function is not pure, it uses useSelector, dont't call it
 * conditionally !!
 */
export function getFlag(inputCode: RegionCode | undefined): string | undefined {
	const regionParams = getSupportedRegion(inputCode)
	const code = regionParams?.fr.drapeau ?? inputCode
	return getFlagImgSrc(code)
}

export function getFlagImgSrc(
	inputCode: RegionCode | undefined
): string | undefined {
	//	code && `https://flagcdn.com/96x72/${code.toLowerCase()}.png`
	//	was down 27/09
	if (!inputCode) {
		return undefined
	}
	return `https://cdn.jsdelivr.net/npm/svg-country-flags@1.2.10/svg/${inputCode.toLowerCase()}.svg`
}

/**
 * This function is not pure, it uses useSelector, dont't call it
 * conditionally !!
 */
export function getCountryNameInCurrentLang(
	localisation: Localisation | undefined
): string | undefined {
	// this function enables to adapt messages written in French according to the country detected, including French prepositions subtelties.
	const currentLang = useSelector(
		(state: AppState) => state.currentLang
	).toLowerCase()

	const regionParams = getSupportedRegion(localisation?.country?.code)
	if (!localisation) {
		return undefined
	}
	if (currentLang == 'fr') {
		const countryName =
			regionParams && regionParams[currentLang]
				? regionParams[currentLang].nom
				: localisation?.country?.name
		const preposition =
			(countryName && frenchCountryPrepositions[countryName]) ?? ''
		return `${preposition} ${countryName}`
	}
	return regionParams
		? regionParams[currentLang]['nom']
		: localisation?.country?.name
}

/**
 * This function is not pure, it uses useSelector, dont't call it
 * conditionally !!
 */
export function getCurrentRegionCode(
	localisation: Localisation | undefined
): RegionCode {
	const code = localisation?.country?.code
	if (getSupportedRegion(code)) {
		return code ?? defaultModelRegionCode
	}
	return defaultModelRegionCode
}
