import { useEffect } from 'react'

import useBranchData from 'Components/useBranchData'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { setLocalisation } from '../../actions/actions'
import { getCurrentLangAbrv } from '../../locales/translation'
import useLocalisation from './useLocalisation'
import { getCurrentRegionCode, SupportedRegions } from './utils'

export default function LocalisationProvider({ children }) {
	const dispatch = useDispatch()
	const branchData = useBranchData()

	const urlParams = new URLSearchParams(window.location.search)
	const { i18n } = useTranslation()
	const currLangAbrv = getCurrentLangAbrv(i18n)
	const localisation = useLocalisation()
	const currentRegionCode = getCurrentRegionCode(localisation)
	const localisationCodeParam = urlParams.get('loc')

	const updateLocalisation = (supportedRegions: SupportedRegions) => {
		if (localisationCodeParam && currentRegionCode !== localisationCodeParam) {
			const regionParams = supportedRegions[localisationCodeParam]
			if (regionParams) {
				dispatch(
					setLocalisation({
						country: {
							code: localisationCodeParam,
							name: regionParams[currLangAbrv].name,
						},
						userChosen: true,
					})
				)
				dispatch({ type: 'SET_LOCALISATION_BANNERS_READ', regions: [] })
			}
		}
	}

	useEffect(() => {
		if (branchData.loaded) {
			if (process.env.NODE_ENV === 'development') {
				try {
					const supportedRegions = require('../../../nosgestesclimat/public/supportedRegions.json')
					dispatch({
						type: 'SET_SUPPORTED_REGIONS',
						supportedRegions,
					})
					updateLocalisation(supportedRegions)
				} catch (e) {
					console.log('err:', e)
				}
			} else {
				const supportedRegionsURL =
					branchData.deployURL + '/supportedRegions.json'
				console.log('fetching:', supportedRegionsURL)
				fetch(supportedRegionsURL, {
					mode: 'cors',
				})
					.then((response) => response.json())
					.then((json) => {
						dispatch({
							type: 'SET_SUPPORTED_REGIONS',
							supportedRegions: json,
						})
						updateLocalisation(json)
					})
					.catch((err) => {
						console.log('url:', supportedRegionsURL)
						console.log('err:', err)
					})
			}
		}
	}, [branchData.deployURL, branchData.loaded, currentRegionCode, dispatch])

	return <>{children}</>
}
