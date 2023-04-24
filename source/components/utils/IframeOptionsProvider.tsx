import { createContext, useContext } from 'react'
import { TrackerContext } from '../../contexts/TrackerContext'

export const IframeOptionsContext = createContext({})

const nullDecode = (string) =>
	string == null ? string : decodeURIComponent(string)

export default function IframeOptionsProvider({ children }) {
	const urlParams = new URLSearchParams(window.location.search)
	const isIframeWithScript = urlParams.get('iframe') != null

	const tracker = useContext(TrackerContext)

	if (!isIframeWithScript && window.self !== window.top) {
		urlParams.set('iframe', '')
		urlParams.set('integratorUrl', document.referrer)
	}

	const isIframe = urlParams.get('iframe') != null

	const integratorUrl = isIframe && urlParams.get('integratorUrl')

	if (isIframe && tracker) {
		tracker.push(['trackEvent', 'iframe', 'visites via iframe', integratorUrl])
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
