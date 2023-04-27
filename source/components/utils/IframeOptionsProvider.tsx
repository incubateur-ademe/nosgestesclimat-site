import { createContext, useContext } from 'react'
import { getMatomoEventVisitViaIframe } from '../../analytics/matomo-events'
import { TrackingContext } from '../../contexts/MatomoContext'
import { getIsIframe } from '../../utils'

export const IframeOptionsContext = createContext<{ isIframe?: boolean }>({})

const nullDecode = (string) =>
	string == null ? string : decodeURIComponent(string)

export default function IframeOptionsProvider({ children }) {
	const urlParams = new URLSearchParams(window.location.search)
	const isIframe = getIsIframe()
	const isIframeParameterDefined = urlParams.get('iframe') !== null

	const { trackEvent } = useContext(TrackingContext)

	// Si l'on détecte que l'on est dans un iframe sans paramètre iframe défini
	// on essaie de récupérer l'URL du referrer
	if (isIframe && !isIframeParameterDefined) {
		urlParams.set('iframe', '')
		urlParams.set('integratorUrl', document.referrer)
	}

	if (isIframe && trackEvent) {
		trackEvent(
			getMatomoEventVisitViaIframe(
				urlParams.get('integratorUrl') || "Pas d'URL d'intégration"
			)
		)
	}

	const iframeIntegratorOptions = Object.fromEntries(
		[
			'integratorLogo',
			'integratorName',
			'integratorActionUrl',
			'integratorYoutubeVideo',
			'integratorActionText',
		].map((key) => [
			key,
			nullDecode(
				new URLSearchParams(document.location.search).get(key) ?? undefined
			),
		])
	)
	const finalValue = { ...iframeIntegratorOptions, isIframe }
	return (
		<IframeOptionsContext.Provider value={finalValue}>
			{children}
		</IframeOptionsContext.Provider>
	)
}
