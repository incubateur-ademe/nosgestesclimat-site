const script =
	document.getElementById('ecolab-climat') ||
	document.getElementById('nosgestesclimat')

const integratorUrl = encodeURIComponent(window.location.href.toString())

const srcURL = new URL(script.src)
const hostname = srcURL.origin || 'https://nosgestesclimat.fr'

const possibleOptions = [
	{ key: 'shareData', legacy: 'partagedatafinsimulation' },
	{ key: 'lang' },
]

const optionFragments = possibleOptions.map(({ key, legacy }) => {
	const value = script.dataset[key] || script.dataset[legacy]

	return value != null ? `&${key}=${value}` : ''
})

const src = `${hostname}/simulateur/bilan/?iframe&integratorUrl=${integratorUrl}${optionFragments.join(
	''
)}`

const iframe = document.createElement('iframe')

const iframeAttributes = {
	src,
	allowfullscreen: true,
	webkitallowfullscreen: true,
	mozallowfullscreen: true,
	allow: 'fullscreen',
	id: 'iframeNGC',
	style: 'border: none; width: 100%; display: block; height: 800px',
}

for (var key in iframeAttributes) {
	iframe.setAttribute(key, iframeAttributes[key])
}

script.parentNode.insertBefore(iframe, script)

window.addEventListener('message', function (evt) {
	console.log(evt)
	if (evt.data.kind === 'resize-height') {
		iframe.style.height = `${evt.data.value}px`
	}
})
