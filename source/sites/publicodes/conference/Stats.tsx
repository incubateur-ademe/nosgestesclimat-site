import { useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import Progress from '../../../components/ui/Progress'
import {
	getLangFromAbreviation,
	getLangInfos,
} from '../../../locales/translation'
import { WithEngine } from '../../../RulesProvider'
import { meanFormatter } from '../DefaultFootprint'
import { humanWeight } from '../HumanWeight'
import CategoryStats from './CategoryStats'
import FilterBar from './FilterBar'

export const computeMean = (simulationArray) =>
	simulationArray &&
	simulationArray.length > 0 &&
	simulationArray
		.filter((el) => el !== null)
		.reduce((memo, next) => memo + next || 0, 0) / simulationArray.length

export const computeHumanMean = (simulationArray) => {
	const result = computeMean(simulationArray)

	return result ? meanFormatter(result) : 'résultats en attente'
}

export default ({
	elements: rawElements,
	users = [],
	username: currentUser,
	threshold,
	setThreshold,
	contextRules,
}) => {
	const { t, i18n } = useTranslation()
	const currentLangInfos = getLangInfos(getLangFromAbreviation(i18n.language))

	const [contextFilter, setContextFilter] = useState({})

	const elements = filterElements(rawElements, contextFilter)

	const [spotlight, setSpotlightRaw] = useState(currentUser)

	const setSpotlight = (username) =>
		spotlight === username ? setSpotlightRaw(null) : setSpotlightRaw(username)
	const values = elements.map((el) => el.total)
	const mean = computeMean(values),
		humanMean = computeHumanMean(values)

	const progressList = elements.map((el) => el.progress),
		meanProgress = computeMean(progressList)

	if (isNaN(mean)) return null

	const categories = reduceCategories(
			elements.map(({ byCategory, username }) => [username, byCategory])
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
	const spotlightElement = elements.find((el) => el.username === spotlight),
		spotlightValue = spotlightElement && formatTotal(spotlightElement.total)

	return (
		<div>
			<div css=" text-align: center">
				<p role="heading" aria-level="2">
					<Trans>Avancement du groupe</Trans>{' '}
					<span role="status">
						({elements.length} participant
						{elements.length > 1 ? 's' : ''})
					</span>
				</p>
				<Progress progress={meanProgress} label={t('Avancement du groupe')} />
			</div>
			<WithEngine>
				<FilterBar
					threshold={threshold}
					setThreshold={setThreshold}
					contextFilter={contextFilter}
					setContextFilter={setContextFilter}
					contextRules={contextRules}
				/>
			</WithEngine>
			<div css="margin: 1.6rem 0">
				<div css="display: flex; flex-direction: column; align-items: center; margin-bottom: .6rem">
					<div>
						<span role="status">
							<Trans>Moyenne</Trans> : {humanMean}{' '}
						</span>
						<small title={t('Moyenne française')}>
							🇫🇷~10 {t('tonnes', { ns: 'units' })}
						</small>
					</div>
				</div>
				{elements.length > 0 && (
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
							{elements.map(({ total: value, username }) => (
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

						<CategoryStats
							{...{ categories, maxCategory, spotlight, setSpotlight }}
						/>

						{spotlightValue && (
							<div>
								{spotlight === currentUser ? (
									<span>
										<Trans
											i18nKey={'site.publicodes.conferences.Stats.explication1'}
										>
											<span role="status" css="background: #fff45f;">
												En jaune
											</span>{' '}
											: ma simulation à {{ spotlightValue }} t.
										</Trans>
									</span>
								) : (
									<button
										className="ui__ link-button"
										onClick={() => setSpotlight(currentUser)}
									>
										<span css="background: #fff45f;">
											<Trans>Afficher ma simulation</Trans>
										</span>
									</button>
								)}
							</div>
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
				el.context[key].toLowerCase().includes(value.toLowerCase())
		)
		console.log(matches)
		return matches.every((bool) => bool === true)
	})
