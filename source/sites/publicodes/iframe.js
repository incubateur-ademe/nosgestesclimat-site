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
	allowfullscreen: true,
	webkitallowfullscreen: true,
	mozallowfullscreen: true,
	id: 'iframeNGC',
}
document.head.insertAdjacentHTML(
	'beforeend',
	`<style>
	#iframeNGC {
	    border: none;
		border-radius: 1rem;
		display: block;
		margin: 10px auto;
		height: 800px;
		max-height: 80vh; /* Small smartphone screens should'nt have to scroll too much. We estimate that the host's header takes 20vh */
		width: 100%;
	}
	@media (min-width: 800px){
	  #iframeNGC{
	  max-width: 450px; /* On large monitors, the iframe should not extend too much, as to avoid confusion between the iframe (viewed as an app) and the rest of the content, e.g. when it's integrated in a blog article. Remember : the website is designed mobile first, so should work perfectly on this width */
		border: 8px solid #32337b;
		}
    }
    </style>`
)

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
