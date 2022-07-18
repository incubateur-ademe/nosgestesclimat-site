import { setSimulationConfig } from 'Actions/actions'
import { useParams, useLocation } from 'react-router-dom'
import { extractCategories } from 'Components/publicodesUtils'
import { buildEndURL } from 'Components/SessionBar'
import Simulation from 'Components/Simulation'
import Title from 'Components/Title'
import { useEngine } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { TrackerContext } from 'Components/utils/withTracker'
import { utils } from 'publicodes'
import React, { useContext, useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import { setTrackingVariable } from '../../actions/actions'
import { FullName } from '../../components/publicodesUtils'
import Meta from '../../components/utils/Meta'
import { situationSelector } from '../../selectors/simulationSelectors'
import BandeauContribuer from './BandeauContribuer'
import { questionConfig } from './questionConfig'
import ScoreBar from './ScoreBar'
import InlineCategoryChart from './chart/InlineCategoryChart'

const equivalentTargetArrays = (array1, array2) =>
	array1.length === array2.length &&
	array1.every((value, index) => value === array2[index])

const Simulateur = (props) => {
	const urlParams = useParams()
	const objectif = urlParams['*'],
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
	const url = useLocation().pathname

	useEffect(() => {
		!equivalentTargetArrays(config.objectifs, configSet?.objectifs || []) &&
			dispatch(setSimulationConfig(config, url))
	}, [])

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
					explanations={<InlineCategoryChart />}
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
	useEffect(() => {
		dispatch({ type: 'SET_THEN_REDIRECT_TO', to })
	}, [to])
	return <Navigate to="/tutoriel" replace />
}

const RedirectionToEndPage = ({ rules, engine }) => {
	// Necessary to call 'buildEndURL' with the latest situation
	const situation = useSelector(situationSelector)

	return <Navigate to={buildEndURL(rules, engine)} />
}

export default Simulateur

const EndingCongratulations = () => (
	<h3>{emoji('🌟')} Vous avez complété cette simulation</h3>
)
