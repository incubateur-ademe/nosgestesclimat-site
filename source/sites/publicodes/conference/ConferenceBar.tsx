import { correctValue, extractCategories } from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import { useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { situationSelector } from 'Selectors/simulationSelectors'
import * as Y from 'yjs'
import { minimalCategoryData } from '../../../components/publicodesUtils'
import { useSimulationProgress } from '../../../components/utils/useNextQuestion'
import { conferenceElementsAdapter } from './Conference'
import { backgroundConferenceAnimation } from './conferenceStyle'
import { computeHumanMean } from './Stats'
import { CountDisc, CountSection } from './SurveyBar'
import useYjs from './useYjs'
import { defaultProgressMin, defaultThreshold, getElements } from './utils'

export default () => {
	const translation = useTranslation(),
		t = translation.t

	const situation = useSelector(situationSelector),
		engine = useEngine(),
		evaluation = engine.evaluate('bilan'),
		{ nodeValue: rawNodeValue, unit } = evaluation
	const rules = useSelector((state) => state.rules)

	const progress = useSimulationProgress()
	const { elements, users, username, conference } = useYjs(null)

	const byCategory = minimalCategoryData(extractCategories(rules, engine))

	const nodeValue = correctValue({ nodeValue: rawNodeValue, unit })

	useEffect(() => {
		if (!conference?.ydoc) return null

		const simulations = conference.ydoc.get('simulations', Y.Map)

		simulations.set(username, {
			total: Math.round(nodeValue),
			progress,
			byCategory,
		})
	}, [situation])

	if (!conference?.ydoc)
		return <Link to="/conférence">Lancer une conférence</Link>

	const simulationArray = elements && Object.values(elements),
		result = computeHumanMean(
			translation,
			simulationArray.map((el) => el.total)
		)

	const statElements = conferenceElementsAdapter(elements)
	const rawNumber = getElements(statElements, defaultThreshold, null, 0).length

	const completedTestNumber = getElements(
		statElements,
		defaultThreshold,
		null,
		defaultProgressMin
	).length

	return (
		<Link to={'/conférence/' + conference.room} css="text-decoration: none;">
			<div
				css={`
					${backgroundConferenceAnimation}
					color: white;
					padding: 0.3rem 1rem;
					display: flex;
					justify-content: space-evenly;
					align-items: center;
					> span {
						display: flex;
						align-items: center;
					}
					img {
						font-size: 150%;
						margin-right: 0.4rem !important;
					}
					@media (min-width: 800px) {
						flex-direction: column;
						align-items: start;
						> * {
							margin: 0.3rem 0;
						}
					}
				`}
			>
				<span css="text-transform: uppercase">
					«&nbsp;{conference.room}&nbsp;»
				</span>
				<span>
					{emoji('🧮')} {result}
				</span>
				<CountSection>
					{rawNumber != null && (
						<span title={t('Nombre total de participants')}>
							{emoji('👥')} <CountDisc color="#55acee">{rawNumber}</CountDisc>
						</span>
					)}
					{completedTestNumber != null && (
						<span title={t('Nombre de tests terminés')}>
							{emoji('✅')}
							<CountDisc color="#78b159">{completedTestNumber}</CountDisc>
						</span>
					)}
				</CountSection>
			</div>
		</Link>
	)
}
