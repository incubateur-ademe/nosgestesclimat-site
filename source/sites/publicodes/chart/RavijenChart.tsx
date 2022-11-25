import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
	extractCategories,
	getSubcategories,
	relegateCommonCategories,
} from '../../../components/publicodesUtils'
import { useEngine } from '../../../components/utils/EngineContext'

import { capitalise0, utils } from 'publicodes'
import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SafeCategoryImage from '../../../components/SafeCategoryImage'
import { humanWeight } from '../HumanWeight'
import { groupTooSmallCategories } from './chartUtils'

// This component was named in the honor of http://ravijen.fr/?p=440

export default () => {
	const { t, i18n } = useTranslation()
	const rules = useSelector((state) => state.rules)
	const engine = useEngine()
	const sortedCategories = extractCategories(rules, engine).map((category) => ({
		...category,
		abbreviation: rules[category.dottedName].abréviation,
	}))
	const categories = relegateCommonCategories(sortedCategories)

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
				min-width: 30rem;
				height: 50rem;
				padding: 0;
				border: 2px solid white;
				cursor: pointer;
				display: flex;
				justify-content: center;
				align-items: end;
			`}
			title={t('Explorer les catégories')}
		>
			{categories.map((category, index) => {
				const [value, unit] = humanWeight(
					{ t, i18n },
					category.nodeValue,
					false
				)
				return (
					<li
						key={category.title}
						title={`${category.title} : ${Math.round(
							(category.nodeValue / empreinteTotale) * 100
						)}%`}
						css={`
							width: calc(${barWidthPercent}% - 0.8rem);
							margin: 0 0.4rem;
							list-style-type: none;
							height: 100%;
							display: flex;
							flex-direction: column;
							justify-content: end;
						`}
					>
						<div
							css={`
								background: ${category.color};
								height: ${(category.nodeValue / empreinteMax.nodeValue) * 100}%;
							`}
						>
							<SubCategoriesVerticalBar {...{ category, engine, rules }} />
						</div>
						<Link
							to={`/documentation/${utils.encodeRuleName(category.dottedName)}`}
						>
							<div
								css={`
									margin-top: 0.4rem;
									background: var(--color) !important;
									> span > img {
										height: 2.5rem;
										width: 2.5rem;
										${category.nodeValue / empreinteMax.nodeValue < 0.1 &&
										'width: 1.5rem'}
									}
									h3 {
										font-size: 100%;
										color: white;
										margin: 0;
									}
									text-align: center;
									padding: 0.6rem 0;
									color: white;
								`}
							>
								<SafeCategoryImage element={category} />
								<h3>
									{category.title.length < 12
										? category.title
										: capitalise0(category.abbreviation)}
								</h3>
								{value}&nbsp;{unit}
							</div>
						</Link>
					</li>
				)
			})}
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
						label: restWidth < 10 ? '...' : 'Autres',
						title: t('Le reste : ') + rest.labels.join(', '),
						nodeValue: rest.value,
						dottedName: 'rest',
						heightPercentage: restWidth,
						compact: true,
					}}
				/>
			)}
			{bigEnough
				.reverse()
				.map(({ nodeValue, title, abbreviation, icons, color, dottedName }) => {
					return (
						<VerticalBarFragment
							{...{
								label: (abbreviation && capitalise0(abbreviation)) || title,
								nodeValue,
								dottedName,
								heightPercentage: (nodeValue / total) * 100,
								icons,
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
	compact,
}) => {
	const { t, i18n } = useTranslation()
	const [value, unit] = humanWeight({ t, i18n }, nodeValue, false)

	const ref = useRef()
	const isOverflow = useIsOverflow(ref, true)

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
				border-top: 1px solid white;
				display: flex;
				flex-direction: column;
				justify-content: center;
				img {
					width: 2rem;
					${compact ? 'height: 1rem' : 'height: auto'}
				}
				${isOverflow && `border: 1px dashed chartreuse`}
			`}
			ref={ref}
			key={dottedName}
			title={title}
		>
			<SafeCategoryImage element={{ dottedName }} voidIfFail={!compact} />

			{!isOverflow && <strong>{label}</strong>}
			<small>
				{value}&nbsp;{unit}
			</small>
		</li>
	)
}

const useIsOverflow = (ref, isVerticalOverflow, callback) => {
	const [isOverflow, setIsOverflow] = useState(undefined)

	useLayoutEffect(() => {
		const { current } = ref
		const { clientWidth, scrollWidth, clientHeight, scrollHeight } = current

		const trigger = () => {
			const hasOverflow = isVerticalOverflow
				? scrollHeight > clientHeight
				: scrollWidth > clientWidth

			setIsOverflow(hasOverflow)

			if (callback) callback(hasOverflow)
		}

		if (current) {
			trigger()
		}
	}, [callback, ref, isVerticalOverflow])

	return isOverflow
}
