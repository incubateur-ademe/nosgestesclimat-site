import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Location as ReactRouterLocation } from 'react-router-dom'
import { inIframe } from '../utils'

const groupExclusionRegexp = /\/(sondage|conférence)\//

const shouldUseDevTracker =
	NODE_ENV === 'development' || CONTEXT === 'deploy-preview'

const ua = window.navigator.userAgent
// https://chromium.googlesource.com/chromium/src.git/+/master/docs/ios/user_agent.md
const iOSSafari =
	(!!/iPad/i.exec(ua) || !!/iPhone/i.exec(ua)) &&
	!!/WebKit/i.exec(ua) &&
	!/CriOS/i.exec(ua)
interface TrackingContextType {
	trackEvent: (args: any[]) => void
	trackPageView: (location: ReactRouterLocation) => void
	resetEventState: () => void
}

interface EventObjectType {
	[key: string]: boolean
}

declare global {
	interface Window {
		plausible: any
		_paq: any
	}
}

export const TrackingContext = createContext<TrackingContextType>({
	trackEvent: () => {},
	trackPageView: () => {},
	resetEventState: () => {},
})

export const TrackingProvider = ({ children }) => {
	const [eventsSent, setEventsSent] = useState({})

	// Get the user simulation id
	const currentSimulationId = useSelector(
		(state: { currentSimulationId: string }) => state.currentSimulationId
	)

	// Get events sents from localStorage
	useEffect(() => {
		if (currentSimulationId) {
			const eventsSentString =
				localStorage.getItem(`events-sent-${currentSimulationId}`) || ''

			const eventsSentObject: EventObjectType | undefined = eventsSentString
				? JSON.parse(eventsSentString)
				: undefined

			// Imbricated ifs, not ideal but no better way to do this to my knowledge
			if (eventsSentObject) {
				setEventsSent(eventsSentObject)
			}
		}
	}, [currentSimulationId])

	// Call before sending an event
	const checkIfEventAlreadySent = useCallback(
		(event) => {
			return eventsSent[`${event.toString()}`]
		},
		[eventsSent]
	)

	// Call after an event is sent, concerns only "trackEvent" typed events
	const updateEventsSent = useCallback(
		(event) => {
			if (currentSimulationId) {
				const newEventsSent = { ...eventsSent, [`${event.toString()}`]: true }
				localStorage.setItem(
					`events-sent-${currentSimulationId}`,
					JSON.stringify(newEventsSent)
				)
				setEventsSent(newEventsSent)
			}
		},
		[currentSimulationId, eventsSent]
	)

	if (!shouldUseDevTracker) {
		console.warn(
			'Tracking is disabled in development and deploy-preview contexts.'
		)
	}

	const resetEventState = () => {
		localStorage.removeItem(`events-sent-${currentSimulationId}`)
		setEventsSent({})
	}

	const previousPath = useRef('')

	const trackEvent = useCallback(
		(args) => {
			// Send only if not already sent
			const shouldSendEvent = !checkIfEventAlreadySent(args)
			console.log({ args, shouldSendEvent })
			if (!shouldSendEvent) return

			/*
		if (shouldUseDevTracker) {
			console?.debug(args)
			return
		}
		*/

			if (window.location.pathname.match(groupExclusionRegexp)) return
			// There is an issue with the way Safari handle cookies in iframe, cf.
			// https://gist.github.com/iansltx/18caf551baaa60b79206. We could probably
			// do better but for now we don't track action of iOs Safari user in
			// iFrame -- to avoid errors in the number of visitors in our stats.
			if (iOSSafari && inIframe()) return

			// Pass a copy of the array to avoid mutation
			window._paq.push([...args])

			// pour plausible, je n'envoie que les events
			// les pages vues sont gérées de base
			const [typeTracking, eventName, subEvent] = args

			if (typeTracking === 'trackEvent') {
				// Mise à jour du state local et du localStorage
				updateEventsSent(args)

				// Could be due to an adblocker not allowing the script to set this global attribute
				if (!window.plausible) return
				const subEventName = `Details : ${eventName}`
				window.plausible(eventName, {
					props: { [subEventName]: subEvent },
				})
			}
		},
		[checkIfEventAlreadySent, updateEventsSent]
	)

	const trackPageView = (loc: ReactRouterLocation) => {
		const currentPath = loc.pathname + loc.search
		if (loc.pathname.match(groupExclusionRegexp)) return
		if (previousPath?.current === currentPath) {
			return
		}
		if (previousPath?.current) {
			trackEvent(['setReferrerUrl', previousPath?.current])
		}
		trackEvent(['setCustomUrl', currentPath])
		// TODO: We should also call 'setDocumentTitle' but at this point the
		// document.title isn't updated yet.
		trackEvent(['trackPageView'])
		previousPath.current = currentPath
	}

	return (
		<TrackingContext.Provider
			value={{
				trackEvent,
				trackPageView,
				resetEventState,
			}}
		>
			{children}
		</TrackingContext.Provider>
	)
}
