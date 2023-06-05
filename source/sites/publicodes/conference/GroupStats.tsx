import { useContext, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { getMatomoEventModeGroupeRealtimeActivation } from '../../../analytics/matomo-events'
import Checkbox from '../../../components/ui/Checkbox'
import Progress from '../../../components/ui/Progress'
import { MatomoContext } from '../../../contexts/MatomoContext'
import {
	getLangFromAbreviation,
	getLangInfos,
} from '../../../locales/translation'
import { WithEngine } from '../../../RulesProvider'
import { meanFormatter } from '../DefaultFootprint'
import { humanWeight } from '../HumanWeight'
import CategoryStats from './CategoryStats'
import FilterBar from './FilterBar'
import { defaultProgressMin, getElements } from './utils'

export const computeMean = (simulationArray) =>
	simulationArray &&
	simulationArray.length > 0 &&
	simulationArray
		.filter((el) => el !== null)
		.reduce((memo, next) => memo + next || 0, 0) / simulationArray.length

export const computeHumanMean = ({ t, i18n }, simulationArray) => {
	const result = computeMean(simulationArray)

	return result ? meanFormatter({ t, i18n }, result) : 'résultats en attente'
}

export default ({
	rawElements,
	users = [],
	username: currentUser,
	threshold,
	setThreshold,
	existContext,
}) => {
	const { trackEvent } = useContext(MatomoContext)
	const { t, i18n } = useTranslation()
	const currentLangInfos = getLangInfos(getLangFromAbreviation(i18n.language))

	const survey = useSelector((state) => state.survey)
	const contextRules = existContext && survey.contextRules

	const completedTests = getElements(
		rawElements,
		threshold,
		contextRules,
		defaultProgressMin
	)

	const participants = getElements(rawElements, threshold, null, 0)

	const [realTimeMode, setRealTimeMode] = useState(true)
	const [contextFilter, setContextFilter] = useState({})
	const filteredCompletedTests = filterElements(completedTests, contextFilter)
	const filteredRawTests = filterElements(participants, contextFilter)

	const [spotlight, setSpotlightRaw] = useState(currentUser)

	const setSpotlight = (username) =>
		spotlight === username ? setSpotlightRaw(null) : setSpotlightRaw(username)

	const displayedTests = realTimeMode
		? filteredRawTests
		: filteredCompletedTests

	const values = displayedTests.map((el) => el.total)
	const mean = computeMean(values),
		humanMean = computeHumanMean({ t, i18n }, values)

	const progressList = filteredRawTests.map((el) => {
			const contextCompleted =
				contextRules &&
				!(
					Object.keys(el.context).length ===
					Object.values(contextRules).filter((rule) => rule?.question).length
				)
					? 0
					: 1
			return el.progress * contextCompleted
		}),
		meanProgress = computeMean(progressList)

	if (isNaN(mean)) return null

	const categories = reduceCategories(
			displayedTests.map(({ byCategory, username }) => [username, byCategory])
		),
		maxCategory = Object.values(categories).reduce(
			(memo, next) => Math.max(memo, ...next.map((el) => el.value)),
			0
		)

	const maxValue = Math.max(...values),
		minValue = 2000, // 2 tonnes, the ultimate objective
		max = humanWeight({ t, i18n }, maxValue, true).join(' '),
		min = humanWeight({ t, i18n }, minValue, true).join(' ')

	const formatTotal = (total) =>
		(total / 1000).toLocaleString(currentLangInfos.abrvLocale, {
			maximumSignificantDigits: 2,
		})
	const spotlightElement = displayedTests.find(
			(el) => el.username === spotlight
		),
		spotlightValue = spotlightElement && formatTotal(spotlightElement.total)

	const plural = filteredCompletedTests.length > 1 ? 's' : ''
	return (
		<div>
			<div css=" text-align: center">
				<p role="heading" aria-level="2">
					<Trans>Avancement du groupe</Trans>{' '}
					<span role="status">
						({filteredCompletedTests.length} test{plural} complété{plural} sur{' '}
						{filteredRawTests.length})
					</span>
				</p>
				<Progress progress={meanProgress} label={t('Avancement du groupe')} />
			</div>
			<div css="margin: 1.6rem 0">
				<div css="display: flex; flex-direction: column; align-items: center; margin-bottom: .6rem">
					<div>
						<div role="status">
							<Trans>Moyenne du groupe</Trans> : {humanMean}{' '}
						</div>
						<div
							title={t('Moyenne française')}
							css={`
								margin: 0 auto;
								text-align: center;
							`}
						>
							<small>
								<em>🇫🇷 ~9 {t('tonnes', { ns: 'units' })}</em>
							</small>
						</div>
					</div>
				</div>
				<small>
					<Checkbox
						name="setRealTimeMode"
						id="setRealTimeMode"
						label="Afficher seulement les simulations terminées"
						showLabel
						checked={!realTimeMode}
						onChange={() => {
							trackEvent(
								getMatomoEventModeGroupeRealtimeActivation(realTimeMode)
							)
							setRealTimeMode(!realTimeMode)
						}}
					/>
				</small>
				<WithEngine>
					<FilterBar
						threshold={threshold}
						setThreshold={setThreshold}
						setContextFilter={setContextFilter}
					/>
				</WithEngine>
				{displayedTests.length > 0 && (
					<div>
						<ul
							title={t('Empreinte totale')}
							css={`
								width: 100%;
								position: relative;
								margin: 0 auto;
								border: 2px solid black;
								height: 2rem;
								list-style-type: none;
								li {
									position: absolute;
								}
							`}
						>
							{displayedTests.map(({ total: value, username }) => (
								<li
									key={username}
									css={`
										height: 100%;
										width: 10px;
										margin-left: -10px;
										left: ${((value - minValue) / (maxValue - minValue)) *
										100}%;
										background: ${users.find((u) => u.name === username)
											?.color || 'var(--color)'};
										opacity: 0.5;

										cursor: pointer;
										${spotlight === username
											? `background: yellow; opacity: 1;
										border-right: 2px dashed black;
										border-left: 2px dashed black;
										z-index: 1;
										`
											: ''}
									`}
									title={`${username} : ${humanWeight(
										{ t, i18n },
										value,
										true
									).join(' ')}`}
									aria-label={`${username} : ${humanWeight(
										{ t, i18n },
										value,
										true
									).join(' ')}`}
									role="button"
									onClick={() => setSpotlight(username)}
									aria-pressed={spotlight === username}
								></li>
							))}
						</ul>
						<div css="display: flex; justify-content: space-between; width: 100%">
							<small key="legendLeft">
								{emoji('🎯 ')}
								{min}
							</small>
							<small key="legendRight">{max}</small>
						</div>

						<div
							css={`
								text-align: center;
								font-style: italic;
								font-size: 90%;
								p {
									margin-bottom: 0rem;
								}
								margin: 1rem;
							`}
						>
							<p>
								<Trans i18nKey="site.publicodes.conferences.Stats.explication0">
									Chaque barre verticale ☝️ est le score total d'un participant,
									<br />
									chaque disque 👇️ un score sur une catégorie.
								</Trans>
							</p>
						</div>
						<CategoryStats
							{...{ categories, maxCategory, spotlight, setSpotlight }}
						/>
						{spotlightValue && spotlight === currentUser ? (
							<span>
								<Trans
									i18nKey={'site.publicodes.conferences.Stats.explication1'}
								>
									<span role="status" css="background: #fff45f;">
										En jaune
									</span>{' '}
									: mon score de {{ spotlightValue }} t.
								</Trans>
							</span>
						) : (
							<button
								className="ui__ link-button"
								onClick={() => setSpotlight(currentUser)}
							>
								<span css="background: #fff45f;">
									<Trans>Afficher mon score</Trans>
								</span>
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

const reduceCategories = (list) =>
	list.reduce(
		(memo, [username, categoriesValueSet]) => {
			const categories = Object.entries(categoriesValueSet).map(
				([name, nodeValue]) => ({ name, nodeValue })
			)
			return categories.reduce(
				(countByCategory, nextCategory) => ({
					...countByCategory,
					[nextCategory.name]: [
						...(countByCategory[nextCategory.name] || []),
						{ value: nextCategory.nodeValue, username },
					],
				}),
				memo
			)
		},

		{}
	)

const filterElements = (rawElements, contextFilter) =>
	rawElements.filter((el) => {
		const matches = Object.entries(contextFilter).map(
			([key, value]) =>
				!value ||
				value === '' ||
				el.context[key]?.toLowerCase().includes(value.toLowerCase())
		)
		return matches.every((bool) => bool === true)
	})
