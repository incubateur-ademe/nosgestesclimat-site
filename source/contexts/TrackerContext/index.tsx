import { createContext } from 'react'
import Tracker, { instantiateDevTracker } from './Tracker'

export const TrackerContext = createContext<Tracker | undefined>(undefined)

export const TrackerProvider = ({ children }) => {
	console.log({ context: CONTEXT, env: NODE_ENV })
	const shouldUseDevTracker =
		NODE_ENV === 'development' || CONTEXT === 'deploy-preview'

	const tracker = shouldUseDevTracker ? instantiateDevTracker() : new Tracker()

	return (
		<TrackerContext.Provider value={tracker}>
			{children}
		</TrackerContext.Provider>
	)
}
