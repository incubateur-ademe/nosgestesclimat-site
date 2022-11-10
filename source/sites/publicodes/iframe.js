import { iframeResize } from 'iframe-resizer'

const script =
		document.getElementById('ecolab-climat') ||
		document.getElementById('nosgestesclimat'),
	integratorUrl = encodeURIComponent(window.location.href.toString())

const srcURL = new URL(script.src)
const hostname = srcURL.hostname || 'nosgestesclimat.fr'

const possibleOptions = [
	{ key: 'shareData', legacy: 'partagedatafinsimulation' },
	{ key: 'lang' },
]

const optionFragments = possibleOptions.map(({ key, legacy }) => {
	const value = script.dataset[key] || script.dataset[legacy]

	return value != null ? `&${key}=${value}` : ''
})

const src = `https://${hostname}/?iframe&integratorUrl=${integratorUrl}${optionFragments.join(
	''
)}`

const iframe = document.createElement('iframe')

const iframeAttributes = {
	src,
	style:
		'border: none; width: 100%; display: block; margin: 10px auto; min-height: 700px',
	allowfullscreen: true,
	webkitallowfullscreen: true,
	mozallowfullscreen: true,
}
for (var key in iframeAttributes) {
	iframe.setAttribute(key, iframeAttributes[key])
}
iframeResize({}, iframe)

const link = document.createElement('div')
link.innerHTML = `
<a href="https://nosgestesclimat.fr" target="_blank">Calculer mon empreinte carbone ⬇️</a>

`
link.style.cssText = `
margin: 1rem auto .6rem;
text-align: center

`

script.parentNode.insertBefore(link, script)

script.parentNode.insertBefore(iframe, script)
