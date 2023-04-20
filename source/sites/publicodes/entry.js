import * as Sentry from '@sentry/react'
import 'core-js/stable'
import { createRoot } from 'react-dom/client'
import i18next from '../../locales/i18n'
import { getLangInfos, Lang } from '../../locales/translation'
import App from './App'

Sentry.init({
	dsn: 'https://d134af84d6db41eea0331919c58865b9@o4505041038606336.ingest.sentry.io/4505041042014208',
	integrations: [new Sentry.BrowserTracing()],
	// NOTE(@EmileRoley): in the future, we may want to set this to a lower value
	tracesSampleRate: 1.0,
})

Object.keys(Lang).forEach((lang) => {
	if (lang !== Lang.Default) {
		const infos = getLangInfos(Lang[lang])
		console.log(`[i18next] Loading '${infos.abrv}'...`)
		i18next.addResourceBundle(infos.abrv, 'translation', infos.uiTrad)
	}
})

let anchor = document.querySelector('#js')

const root = createRoot(anchor) // createRoot(container!) if you use TypeScript
root.render(<App />)
