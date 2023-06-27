import { setSimulationConfig } from '@/actions/actions'
import Simulation from '@/components/Simulation'
import { useNextQuestions } from '@/hooks/useNextQuestion'
import { AppState } from '@/reducers/rootReducer'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { questionConfig } from './questionConfig'

export default ({ dottedName }) => {
	const nextQuestions = useNextQuestions()
	const configSet = useSelector((state: AppState) => state.simulation?.config)

	// TODO here we need to apply a rustine to accommodate for this issue
	// https://github.com/betagouv/mon-entreprise/issues/1316#issuecomment-758833973
	// to be continued...
	const config = {
		objectifs: [dottedName],
		situation: { ...(configSet?.situation || {}) },
		questions: questionConfig,
	}

	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(setSimulationConfig(config))
	}, [dottedName])

	if (!configSet) {
		return null
	}

	return nextQuestions.length > 0 ? (
		<Simulation
			explanations={null}
			animation="fromBottom"
			conversationProps={{
				customEnd: <div />,
				questionHeadingLevel: 3,
				isFromActionCard: true,
			}}
		/>
	) : null
}
