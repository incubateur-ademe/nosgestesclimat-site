import 'core-js/stable'
import { createRoot } from 'react-dom/client'
import App from './App'
import i18next from '../../locales/i18n'
import { getLangInfos, Lang } from '../../locales/translation'

Object.keys(Lang).forEach((lang) => {
	if (lang !== Lang.Default) {
		const abrv = getLangInfos(Lang[lang]).abrv
		console.log(`[i18next] Loading '${abrv}'...`)
		i18next.addResourceBundle(
			abrv,
			'translation',
			require(`../../locales/ui/ui-${abrv}.json`)
		)
	}
})

let anchor = document.querySelector('#js')

const root = createRoot(anchor) // createRoot(container!) if you use TypeScript
root.render(<App />)
