import { useState } from 'react'
import emoji from 'react-easy-emoji'
import Progress from '../../../components/ui/Progress'
import { humanWeight } from '../HumanWeight'
import CategoryStats from './CategoryStats'
import DefaultFootprint, { meanFormatter } from '../DefaultFootprint'
import { extremeThreshold } from './utils'

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
}) => {
	const [spotlight, setSpotlightRaw] = useState(currentUser)
	const elements = rawElements.filter(
		/* Simulations with less than 10% progress are excluded, in order to avoid a perturbation of the mean group value by
		 * people that did connect to the conference, but did not seriously start the test, hence resulting in multiple default value simulations  */
		(el) => el.total < threshold && el.progress > 0.1
	)
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
		max = humanWeight(maxValue, true).join(' '),
		min = humanWeight(minValue, true).join(' ')

	const formatTotal = (total) =>
		(total / 1000).toLocaleString('fr-FR', {
			maximumSignificantDigits: 2,
		})
	const spotlightElement = elements.find((el) => el.username === spotlight),
		spotlightValue = spotlightElement && formatTotal(spotlightElement.total)

	return (
		<div>
			<div css=" text-align: center">
				<p role="heading" aria-level="2">
					Avancement du groupe ({rawElements.length} participant
					{rawElements.length > 1 ? 's' : ''})
				</p>
				<Progress progress={meanProgress} label="Avancement du groupe" />
			</div>
			<div css="margin: 1.6rem 0">
				<div css="display: flex; flex-direction: column; align-items: center; margin-bottom: .6rem">
					<div>
						Moyenne : {humanMean}{' '}
						<small title="Moyenne française">
							({emoji('🇫🇷')} <DefaultFootprint />)
						</small>
					</div>
					<small>
						<label>
							Exclure au-dessus de{' '}
							<input
								css={`
									width: 2.5rem;
									height: 1.2rem;
									text-align: right;
									border: none;
									border-bottom: 1px dashed var(--color);
									font-size: 100%;
									color: inherit;
								`}
								onChange={(e) => setThreshold(e.target.value * 1000)}
								value={threshold / 1000}
								type="number"
							/>{' '}
							tonnes.
						</label>
					</small>
				</div>

				<ul
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
								left: ${((value - minValue) / (maxValue - minValue)) * 100}%;
								background: ${users.find((u) => u.name === username)?.color ||
								'var(--color)'};
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
							title={`${username} : ${formatTotal(value)} t`}
							{...(spotlight === username ? { role: 'mark' } : {})}
							onClick={() => setSpotlight(username)}
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
			</div>
			<CategoryStats
				{...{ categories, maxCategory, spotlight, setSpotlight }}
			/>

			{spotlightValue && (
				<div>
					{spotlight === currentUser ? (
						<span>
							<span css="background: #fff45f;">En jaune</span> : ma simulation à{' '}
							{spotlightValue} t.
						</span>
					) : (
						<button
							className="ui__ link-button"
							onClick={() => setSpotlight(currentUser)}
						>
							<span css="background: #fff45f;">Afficher ma simulation</span>
						</button>
					)}
				</div>
			)}
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
