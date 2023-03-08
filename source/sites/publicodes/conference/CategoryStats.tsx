import { useTranslation } from 'react-i18next'
import { sortBy } from '../../../utils'
import { humanWeight } from '../HumanWeight'

export default ({
	categories: decreasingCategories,
	maxCategory,
	spotlight,
	setSpotlight,
}) => {
	const { t, i18n } = useTranslation()

	const categories = sortBy(([key, values]) =>
		values.reduce((memo, next) => memo + next, 0)
	)(Object.entries(decreasingCategories))
	const values = Object.values(decreasingCategories)
			.flat()
			.map(({ value }) => value),
		max = Math.max(...values),
		humanMax = humanWeight({ t, i18n }, max, true)

	return (
		<div>
			<ul
				title="Empreinte par catégorie"
				css={`
					padding-left: 0;
					> li:nth-child(2n + 1) {
						background: var(--lightestColor);
					}
					list-style-type: none;
					li > span {
						padding-left: 0.6rem;
						width: 30%;
						display: inline-block;
						border-right: 1px solid var(--lightColor);
					}

					ul {
						list-style-type: none;
						display: inline-block;
						position: relative;
						width: 65%;
					}
					ul li {
						position: absolute;
						width: 8px;
						height: 8px;
						display: inline-block;
						background: black;
						border-radius: 1rem;
						opacity: 0.2;
					}
				`}
			>
				{categories.map(([name, values]) => (
					<li key={name}>
						<span>{name}</span>
						<ul>
							{values.map(({ username, value }) => (
								<li
									key={value}
									css={`
										left: ${(value / maxCategory) * 100}%;
										cursor: pointer;
										${spotlight === username
											? `background: yellow !important; opacity: 1 !important; z-index: 2; border: 2px solid black; width: 10px !important`
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
									onClick={() => setSpotlight(username)}
									role="button"
									aria-pressed={spotlight === username}
								></li>
							))}
						</ul>
					</li>
				))}
			</ul>
			<div css="width: 70%; margin-left: 30%;  display: flex; justify-content: space-between">
				<small>{Math.round(0)}</small>
				<small>
					{humanMax[0]} {humanMax[1]}
				</small>
			</div>
		</div>
	)
}
