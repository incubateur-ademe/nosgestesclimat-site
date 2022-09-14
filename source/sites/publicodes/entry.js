import 'core-js/stable'
import { createRoot } from 'react-dom/client'
import App from './App'
import i18next from '../../locales/i18n'
import { getLangInfos, Lang } from '../../locales/translation'

Object.keys(Lang).forEach((lang) => {
	console.log(`Loading ${lang}...`)
	console.log(`Loading Lang.${lang}`, Lang[lang])
	const abrv = getLangInfos(Lang[lang]).abrv
	console.log(`Loading abrv ${abrv}...`)
	i18next.addResourceBundle(
		abrv,
		'translation',
		require(`../../locales/ui-${abrv}.json`)
	)
})
i18next.changeLanguage(getLangInfos(Lang.Default).abrv)

let anchor = document.querySelector('#js')

const root = createRoot(anchor) // createRoot(container!) if you use TypeScript
root.render(<App />)
