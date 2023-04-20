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

	return (
		<TrackerContext.Provider value={tracker}>
			{children}
		</TrackerContext.Provider>
	)
}
