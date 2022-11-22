import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
	extractCategories,
	getSubcategories,
} from '../../../components/publicodesUtils'
import { useEngine } from '../../../components/utils/EngineContext'

import { relegate } from 'Components/publicodesUtils'
import SafeCategoryImage from '../../../components/SafeCategoryImage'
import { humanWeight } from '../HumanWeight'
import { groupTooSmallCategories } from './chartUtils'

// This component was named in the honor of http://ravijen.fr/?p=440

export default () => {
	const { t } = useTranslation()
	const rules = useSelector((state) => state.rules)
	const engine = useEngine()
	const sortedCategories = extractCategories(rules, engine).map((category) => ({
		...category,
		abbreviation: rules[category.dottedName].abbréviation,
	}))
	const categories = relegate('services publics', sortedCategories)

	if (!categories) return null

	const empreinteTotale = categories.reduce(
			(memo, next) => next.nodeValue + memo,
			0
		),
		empreinteMax = categories.reduce(
			(memo, next) => (next.nodeValue > memo.nodeValue ? next : memo),
			{ nodeValue: -Infinity }
		)

	const barWidthPercent = 100 / categories.length
	return (
		<ol
			css={`
				margin: 0;
				height: 40rem;
				padding: 0;
				border: 2px solid white;
				cursor: pointer;
				display: flex;
				justify-content: center;
				align-items: end;
				border: 5px dashed chartreuse;
			`}
			title={t('Explorer les catégories')}
		>
			{categories.map((category, index) => (
				<li
					key={category.title}
					title={`${category.title} : ${Math.round(
						(category.nodeValue / empreinteTotale) * 100
					)}%`}
					css={`
						width: calc(${barWidthPercent}% - 0.8rem);
						margin: 0 0.4rem;
						list-style-type: none;
						background: ${category.color};
						height: ${(category.nodeValue / empreinteMax.nodeValue) * 100}%;

						> img {
							height: 3rem;
							width: 3rem;
							${category.nodeValue / empreinteMax.nodeValue < 0.1 &&
							'width: 1.5rem'}
						}
					`}
				>
					<div
						css={`
							height: calc(100% - 3rem);
						`}
					>
						<SubCategoriesVerticalBar {...{ category, engine, rules }} />
					</div>
					<SafeCategoryImage element={category} />
				</li>
			))}
		</ol>
	)
}

const SubCategoriesVerticalBar = ({ rules, category, engine }) => {
	const { t, i18n } = useTranslation()
	const categories = getSubcategories(rules, category, engine)
	const { rest, restWidth, bigEnough, total } =
		groupTooSmallCategories(categories)
	return (
		<ol
			css={`
				height: 100%;
				list-style-type: none;
				padding-left: 0;
			`}
		>
			{restWidth > 0 && (
				<VerticalBarFragment
					{...{
						label: 'Autres',

						title: t('Le reste : ') + rest.labels.join(', '),
						nodeValue: rest.value,
						dottedName: 'rest',
						heightPercentage: restWidth,
					}}
				/>
			)}
			{bigEnough
				.reverse()
				.map(({ nodeValue, title, icons, color, dottedName }) => {
					return (
						<VerticalBarFragment
							{...{
								label: title,
								nodeValue,

								dottedName,
								heightPercentage: (nodeValue / total) * 100,
							}}
						/>
					)
				})}
		</ol>
	)
}

const VerticalBarFragment = ({
	title,
	label,
	nodeValue,
	dottedName,
	heightPercentage,
}) => {
	const { t, i18n } = useTranslation()
	const [value, unit] = humanWeight({ t, i18n }, nodeValue, false)

	return (
		<li
			css={`
				text-align: center;
				margin: 0;
				padding: 0 0 0.4rem;
				height: ${heightPercentage}%;
				color: white;
				strong {
					color: inherit;
					display: block;
					line-height: 1.2rem;
				}
				small {
					color: inherit;
					line-height: 1rem;
				}
				border-bottom: 1px solid white;
				display: flex;
				flex-direction: column;
				justify-content: center;
			`}
			key={dottedName}
			title={title}
		>
			<strong>{label}</strong>
			<small>
				{value}&nbsp;{unit}
			</small>
		</li>
	)
}
