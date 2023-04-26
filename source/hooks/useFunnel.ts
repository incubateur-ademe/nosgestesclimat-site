import { useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useEngine } from '../components/utils/EngineContext'
import { TrackingContext } from '../contexts/TrackingContext'
import { answeredQuestionsSelector } from '../selectors/simulationSelectors'
import { useNextQuestions, useSimulationProgress } from './useNextQuestion'

export const useFunnel = () => {
	// Centralize the tracking of the progress of the simulation
	const progress = useSimulationProgress()

	const { trackEvent } = useContext(TrackingContext)

	const engine = useEngine()

	const nextQuestions = useNextQuestions()
	const previousAnswers = useSelector(answeredQuestionsSelector)

	useEffect(() => {
		if (previousAnswers.length >= 1) {
			// Cannot be sent several times, trackEvent filters duplicates
			trackEvent(['trackEvent', 'NGC', '1ère réponse au bilan'])
		}
	}, [previousAnswers, trackEvent])

	useEffect(() => {
		if (progress > 0.9) {
			// Cannot be sent several times, trackEvent filters duplicates
			trackEvent(['trackEvent', 'NGC', 'Progress > 90%'])
		}
	}, [progress, trackEvent])

	useEffect(() => {
		if (progress > 0.5) {
			// Cannot be sent several times, trackEvent filters duplicates
			trackEvent(['trackEvent', 'NGC', 'Progress > 50%'])
		}
	}, [progress, trackEvent])

	const noQuestionsLeft = !nextQuestions.length

	const bilan = engine
		? Math.round(
				parseFloat((engine?.evaluate('bilan')?.nodeValue as string) || '')
		  )
		: undefined

	useEffect(() => {
		if (noQuestionsLeft) {
			// Cannot be sent several times, trackEvent filters duplicates
			trackEvent([
				'trackEvent',
				'NGC',
				'A terminé la simulation',
				'bilan',
				bilan,
			])
		}
	}, [noQuestionsLeft, bilan, trackEvent])
}
