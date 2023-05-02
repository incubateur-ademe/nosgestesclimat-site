import { createContext } from 'react'
import Tracker, { instantiateDevTracker } from './Tracker'

export const TrackerContext = createContext<Tracker | undefined>(undefined)

export const TrackerProvider = ({ children }) => {
	const shouldUseDevTracker =
		NODE_ENV === 'development' || CONTEXT === 'deploy-preview'

	if (!shouldUseDevTracker) {
		console.warn(
			'Tracking is disabled in development and deploy-preview contexts.'
		)
	}

	const tracker = shouldUseDevTracker ? instantiateDevTracker() : new Tracker()

	// Désactivé pendant les recherches sur les
	// implications en termes de cookies
	/*
	if (!shouldUseDevTracker) {
		posthog.init('phc_XZx1t672SA98ffOol1wQsNzRfyVX9uull53Y8lXqdg9', {
			api_host: 'https://eu.posthog.com',
		})
	}
	*/

	return (
		<TrackerContext.Provider value={tracker}>
			{children}
		</TrackerContext.Provider>
	)
}
