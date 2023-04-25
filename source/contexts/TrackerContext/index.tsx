import { posthog } from 'posthog-js'
import { createContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
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

	const currentSimulationId = useSelector(
		(state: { currentSimulationId: string }) => state.currentSimulationId
	)

	const tracker = shouldUseDevTracker ? instantiateDevTracker() : new Tracker()

	useEffect(() => {
		if (!shouldUseDevTracker && currentSimulationId) {
			posthog.init('phc_XZx1t672SA98ffOol1wQsNzRfyVX9uull53Y8lXqdg9', {
				api_host: 'https://eu.posthog.com',
				autocapture: false,
				persistence: 'memory',
				bootstrap: {
					distinctID: currentSimulationId,
				},
			})
		}
	}, [currentSimulationId, shouldUseDevTracker])

	return (
		<TrackerContext.Provider value={tracker}>
			{children}
		</TrackerContext.Provider>
	)
}
