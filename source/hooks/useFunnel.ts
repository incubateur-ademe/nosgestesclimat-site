import { useContext, useEffect } from 'react'
import { TrackingContext } from '../contexts/TrackingContext'
import { useSimulationProgress } from './useNextQuestion'

export const useFunnel = () => {
	// Centralize the tracking of the progress of the simulation
	const progress = useSimulationProgress()

	const { trackEvent } = useContext(TrackingContext)

	useEffect(() => {
		if (progress > 0.9) {
			trackEvent(['trackEvent', 'NGC', 'Progress > 90%'])
		}

		if (progress > 0.5) {
			trackEvent(['trackEvent', 'NGC', 'Progress > 50%'])
		}
	}, [progress, trackEvent])
}
