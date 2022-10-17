import { setSimulationConfig } from 'Actions/actions'
import { extractCategories } from 'Components/publicodesUtils'
import { buildEndURL } from 'Components/SessionBar'
import Simulation from 'Components/Simulation'
import Title from 'Components/Title'
import { useEngine } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { utils } from 'publicodes'
import { useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import { Link, useLocation, useParams } from 'react-router-dom'
import { FullName } from '../../components/publicodesUtils'
import Meta from '../../components/utils/Meta'
import { situationSelector } from '../../selectors/simulationSelectors'
import BandeauContribuer from './BandeauContribuer'
import { questionConfig } from './questionConfig'
import ScoreBar from './ScoreBar'

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
					orderByCategories={categories}
					customEnd={
						isMainSimulation ? (
							<MainSimulationEnding {...{ rules, engine }} />
						) : rule.description ? (
							<Markdown children={rule.description} />
						) : (
							<EndingCongratulations />
						)
					}
					explanations={null}
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

const MainSimulationEnding = ({ rules, engine }) => {
	// Necessary to call 'buildEndURL' with the latest situation
	const situation = useSelector(situationSelector)

	return (
		<div
			css={`
				img {
					width: 8rem;
					height: auto;
				}
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				padding: 1rem;
			`}
		>
			<img
				src="/images/glowing-ngc-star.svg"
				width="100"
				height="100"
				aria-hidden="true"
			/>
			<p>Vous avez terminé le test 👏</p>
			<Link to={buildEndURL(rules, engine)} className="ui__ button cta plain">
				Voir mon résultat
			</Link>
			ou
			<Link to="/profil" css="">
				Modifier mes réponses
			</Link>
		</div>
	)
}

export default Simulateur

const EndingCongratulations = () => (
	<h3>{emoji('🌟')} Vous avez complété cette simulation</h3>
)
