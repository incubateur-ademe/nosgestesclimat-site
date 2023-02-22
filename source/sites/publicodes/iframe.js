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

const src = `http://${hostname}:8080/?iframe&integratorUrl=${integratorUrl}${optionFragments.join(
	''
)}`

const iframe = document.createElement('iframe')

const iframeAttributes = {
	src,
	style:
		'border: 8px solid #32337b; border-radius: 1rem; display: block; margin: 10px auto; height: 800px; width: 500px; max-width: 95%',
	allowfullscreen: true,
	webkitallowfullscreen: true,
	mozallowfullscreen: true,
}
for (var key in iframeAttributes) {
	iframe.setAttribute(key, iframeAttributes[key])
}

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
