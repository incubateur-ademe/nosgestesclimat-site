import { posthog } from 'posthog-js'
import { debounce, inIframe } from '../../utils'

declare global {
	interface Window {
		_paq: any
		plausible: any
	}
}

type MatomoAction =
	| 'trackPageView'
	| 'trackEvent'
	| 'setReferrerUrl'
	| 'setCustomUrl'
	| 'setCustomVariable'
type PushArgs = [MatomoAction, ...Array<string | number | boolean | null>]
type PushType = (args: PushArgs) => void

const ua = window.navigator.userAgent
// https://chromium.googlesource.com/chromium/src.git/+/master/docs/ios/user_agent.md
const iOSSafari =
	(!!/iPad/i.exec(ua) || !!/iPhone/i.exec(ua)) &&
	!!/WebKit/i.exec(ua) &&
	!/CriOS/i.exec(ua)

const groupExclusionRegexp = /\/(sondage|conférence)\//

export default class Tracker {
	push: PushType
	debouncedPush: PushType
	previousPath: string | undefined

	constructor(
		pushFunction: PushType = (args) => {
			if (window.location.pathname.match(groupExclusionRegexp)) return
			// There is an issue with the way Safari handle cookies in iframe, cf.
			// https://gist.github.com/iansltx/18caf551baaa60b79206. We could probably
			// do better but for now we don't track action of iOs Safari user in
			// iFrame -- to avoid errors in the number of visitors in our stats.
			if (iOSSafari && inIframe()) return

			// Could be due to an adblocker not allowing the script to set this global attribute
			if (!window.plausible) return

			window._paq.push(args)

			// pour plausible, je n'envoie que les events
			// les pages vues sont gérées de base
			const [typeTracking, eventName, subEvent] = args
			if (typeTracking === 'trackEvent') {
				var subEventName = `Details : ${eventName}`
				window.plausible(eventName, {
					props: { [subEventName]: subEvent },
				})

				posthog.capture(String(eventName))
				if (subEvent) {
					posthog.capture(String(subEvent))
				}
			}
		}
	) {
		if (typeof window !== 'undefined') window._paq = window._paq || []
		this.push = pushFunction
		this.debouncedPush = debounce(200, pushFunction)
	}

	track(loc) {
		const currentPath = loc.pathname + loc.search
		if (loc.pathname.match(groupExclusionRegexp)) return
		if (this.previousPath === currentPath) {
			return
		}
		if (this.previousPath) {
			this.push(['setReferrerUrl', this.previousPath])
		}
		this.push(['setCustomUrl', currentPath])
		// TODO: We should also call 'setDocumentTitle' but at this point the
		// document.title isn't updated yet.
		this.push(['trackPageView'])
		this.previousPath = currentPath
	}
}

export const instantiateDevTracker = () =>
	new Tracker(
		console?.debug?.bind(console) ?? (() => {}) // eslint-disable-line no-console
	)
