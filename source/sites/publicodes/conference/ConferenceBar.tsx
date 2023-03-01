import { correctValue, extractCategories } from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { situationSelector } from 'Selectors/simulationSelectors'
import * as Y from 'yjs'
import { minimalCategoryData } from '../../../components/publicodesUtils'
import { useSimulationProgress } from '../../../components/utils/useNextQuestion'
import { conferenceElementsAdapter } from './Conference'
import { computeHumanMean } from './Stats'
import { CountDisc, CountSection, EmojiStyle } from './SurveyBar'
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

	//TODO mutualise this display part with SurveyBar
	return (
		<Link to={'/conférence/' + conference.room} css="text-decoration: none;">
			<div
				css={`
					color: white;
					padding: 0.3rem;
					display: flex;
					flex-direction: column;

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
					}
				`}
			>
				<span css="">«&nbsp;{conference.room}&nbsp;»</span>
				<div
					css={`
						display: flex;
						justify-content: space-evenly;
						align-items: center;
						width: 100%;
					`}
				>
					<span>
						<EmojiStyle>🧮</EmojiStyle>
						{result.replace(/tonnes?/, 't')}
					</span>
					<CountSection>
						{rawNumber != null && (
							<span title={t('Nombre total de participants')}>
								<EmojiStyle>👥</EmojiStyle>
								<CountDisc color="#55acee">{rawNumber}</CountDisc>
							</span>
						)}
						{completedTestNumber != null && (
							<span title={t('Nombre de tests terminés')}>
								<EmojiStyle>✅</EmojiStyle>
								<CountDisc color="#78b159">{completedTestNumber}</CountDisc>
							</span>
						)}
					</CountSection>
				</div>
			</div>
		</Link>
	)
}
