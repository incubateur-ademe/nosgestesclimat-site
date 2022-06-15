import { setSimulationConfig } from 'Actions/actions'
import { extractCategories } from 'Components/publicodesUtils'
import { buildEndURL } from 'Components/SessionBar'
import Simulation from 'Components/Simulation'
import Title from 'Components/Title'
import { useEngine } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { TrackerContext } from 'Components/utils/withTracker'
import { utils } from 'publicodes'
import { compose, isEmpty, symmetricDifference } from 'ramda'
import React, { useContext, useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useLocation } from 'react-router'
import { setTrackingVariable } from '../../actions/actions'
import { FullName } from '../../components/publicodesUtils'
import Meta from '../../components/utils/Meta'
import { situationSelector } from '../../selectors/simulationSelectors'
import BandeauContribuer from './BandeauContribuer'
import ScoreBar from './ScoreBar'
import Chart from './chart/index.js'
import { questionConfig } from './questionConfig'

const eqValues = compose(isEmpty, symmetricDifference)

const Simulateur = (props) => {
	const objectif = props.match.params.name,
		decoded = utils.decodeRuleName(objectif),
		rules = useSelector((state) => state.rules),
		rule = rules[decoded],
		engine = useEngine(),
		evaluation = engine.evaluate(decoded),
		dispatch = useDispatch(),
		config = {
			objectifs: [decoded],
			questions: questionConfig,
		},
		configSet = useSelector((state) => state.simulation?.config),
		categories = decoded === 'bilan' && extractCategories(rules, engine)
	const tutorials = useSelector((state) => state.tutorials)

	useEffect(
		() =>
			!eqValues(config.objectifs, configSet?.objectifs || [])
				? dispatch(setSimulationConfig(config))
				: () => null,
		[]
	)

	const isMainSimulation = decoded === 'bilan'
	if (!configSet) return null

	const introPassed = tutorials.testIntro

	return (
		<div>
			<Meta title={evaluation.title} />
			<Title>Le test</Title>
			{introPassed && <ScoreBar />}
			{!isMainSimulation && (
				<h1>
					{evaluation.rawNode.title || (
						<FullName dottedName={evaluation.dottedName} />
					)}
				</h1>
			)}
			{tutorials.testIntro ? (
				<Simulation
					noFeedback
					orderByCategories={categories}
					customEnd={
						isMainSimulation ? (
							<RedirectionToEndPage {...{ rules, engine }} />
						) : rule.description ? (
							<Markdown source={rule.description} />
						) : (
							<EndingCongratulations />
						)
					}
					explanations={
						<>
							<Chart />
						</>
					}
				/>
			) : (
				<TutorialRedirection />
			)}
			<BandeauContribuer />
		</div>
	)
}

const TutorialRedirection = () => {
	const dispatch = useDispatch(),
		to = useLocation().pathname
	useEffect(() => dispatch({ type: 'SET_THEN_REDIRECT_TO', to }), [to])
	return <Redirect to="/tutoriel" />
}

const RedirectionToEndPage = ({ rules, engine }) => {
	// Necessary to call 'buildEndURL' with the latest situation
	const situation = useSelector(situationSelector)

	return <Redirect to={buildEndURL(rules, engine)} />
}

export default Simulateur

const EndingCongratulations = () => (
	<h3>{emoji('🌟')} Vous avez complété cette simulation</h3>
)
