import { setSimulationConfig } from 'Actions/actions'
import PeriodSwitch from 'Components/PeriodSwitch'
import SessionBar, { buildEndURL } from 'Components/SessionBar'
import ShareButton from 'Components/ShareButton'
import Simulation from 'Components/Simulation'
import { Markdown } from 'Components/utils/markdown'
import { TrackerContext } from 'Components/utils/withTracker'
import { utils } from 'publicodes'

import { compose, isEmpty, symmetricDifference } from 'ramda'
import React, { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router'
import CarbonImpact from './CarbonImpact'
import Chart from './chart/index.js'
import { extractCategories } from 'Components/publicodesUtils'

import { objectifsSelector } from 'Selectors/simulationSelectors'
import { useEngine } from 'Components/utils/EngineContext'
import emoji from 'react-easy-emoji'
import { situationSelector } from '../../selectors/simulationSelectors'
import BandeauContribuer from './BandeauContribuer'
import { sessionBarMargin } from '../../components/SessionBar'
import { FullName, splitName } from '../../components/publicodesUtils'
import Title from 'Components/Title'
import Meta from '../../components/utils/Meta'
import { skipTutorial } from '../../actions/actions'
import animate from '../../components/ui/animate'

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
			<Meta title={rule.title} title={evaluation.title || ''} />
			<Title>Le test</Title>
			{(introPassed || tutorials.testIntro1) && (
				<animate.appear delay="2">
					{' '}
					<CarbonImpact />
				</animate.appear>
			)}
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
					targets={<>{rule.period === 'flexible' && <PeriodBlock />}</>}
					explanations={
						<>
							<Chart />
						</>
					}
				/>
			) : (
				<animate.appear>
					<div
						className="ui__ card light colored content"
						css="margin-top: 1.6rem"
					>
						<h1> {emoji('😶‍🌫️')}&nbsp;Mon empreinte climat ?</h1>
						<p>Pas de panique, on vous l'explique pas à pas.</p>
						<img
							src="https://raw.githubusercontent.com/laem/openmoji-environment/greenhouse/greenhouse-effect.svg"
							css="width: 10rem"
						/>
						<p>
							La planète se réchauffe, au fur et à mesure des gaz à effet de
							serre que l'on émet.
						</p>
						<p>
							Ce test donne une mesure de <strong>votre part </strong> dans ce
							réchauffement, en mesurant votre <strong>consommation</strong>{' '}
							personnelle.
						</p>
						<div css="button {margin: 0 .4rem}">
							<button
								className="ui__ button small plain"
								onClick={() => dispatch(skipTutorial('testIntro1'))}
							>
								Suivant
							</button>
							<button
								className="ui__ button small"
								onClick={() => dispatch(skipTutorial('testIntro'))}
							>
								Passer le tutoriel
							</button>
						</div>
					</div>
				</animate.appear>
			)}
			{tutorials.testIntro && <BandeauContribuer />}
		</div>
	)
}

let PeriodBlock = () => (
	<div css="display: flex; justify-content: center">
		<PeriodSwitch />
	</div>
)

const RedirectionToEndPage = ({ rules, engine }) => {
	// Necessary to call 'buildEndURL' with the latest situation
	const situation = useSelector(situationSelector)
	const tracker = useContext(TrackerContext)

	useEffect(() => {
		tracker.push([
			'trackEvent',
			'NGC',
			'A terminé la simulation',
			null,
			rules['bilan'].nodeValue,
		])
	}, [tracker])

	return <Redirect to={buildEndURL(rules, engine)} />
}

export default Simulateur

const EndingCongratulations = () => (
	<h3>{emoji('🌟')} Vous avez complété cette simulation</h3>
)
