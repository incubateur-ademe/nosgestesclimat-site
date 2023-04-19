import { createContext } from 'react'
import Tracker, { instantiateDevTracker } from './Tracker'

export const TrackerContext = createContext<Tracker | undefined>(undefined)

export const TrackerProvider = ({ children }) => {
	const tracker =
		process.env.NODE_ENV === 'development'
			? instantiateDevTracker()
			: new Tracker()
	return (
		<TrackerContext.Provider value={tracker}>
			{children}
		</TrackerContext.Provider>
	)
}
