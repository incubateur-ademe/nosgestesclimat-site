import React, { createContext } from 'react'

export const IframeOptionsContext = createContext({})

const nullDecode = (string) =>
	string == null ? string : decodeURIComponent(string)

export default function IframeOptionsProvider({ children, tracker }) {
	const urlParams = new URLSearchParams(window.location.search)
	const isIframe = urlParams.get('iframe') != null,
		integratorUrl = isIframe && urlParams.get('integratorUrl')

	tracker &&
		tracker.push([
			'setCustomVariable',
			'1',
			'visite depuis iframe ?',
			!isIframe ? 'non' : integratorUrl,
			'visit',
		])

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
	console.log(finalValue)
	return (
		<IframeOptionsContext.Provider value={finalValue}>
			{children}
		</IframeOptionsContext.Provider>
	)
}
