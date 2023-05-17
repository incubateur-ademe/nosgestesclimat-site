import * as Sentry from '@sentry/react'
import 'core-js/stable'
import { createRoot } from 'react-dom/client'
import Workbox from 'workbox-window'
import i18next from '../../locales/i18n'
import { getLangInfos, Lang } from '../../locales/translation'
import App from './App'

Sentry.init({
	dsn: SENTRY_DSN,
	integrations: [new Sentry.BrowserTracing()],
	// NOTE(@EmileRoley): Quite an arbitrary value
	tracesSampleRate: 0.25,
	enabled: process.env.NODE_ENV !== 'development',
	environment: CONTEXT,
})

Object.keys(Lang).forEach((lang) => {
	if (lang !== Lang.Default) {
		const infos = getLangInfos(Lang[lang])
		console.log(`[i18next] Loading '${infos.abrv}'...`)
		i18next.addResourceBundle(infos.abrv, 'translation', infos.uiTrad)
	}
})

// Register the service worker
if ('serviceWorker' in navigator) {
	const wb = new Workbox('/sw.js')
	wb.register()
}

let anchor = document.querySelector('#js')

const root = createRoot(anchor) // createRoot(container!) if you use TypeScript
root.render(<App />)
