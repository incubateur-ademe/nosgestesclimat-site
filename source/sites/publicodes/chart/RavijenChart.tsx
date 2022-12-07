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
import { getTitle, groupTooSmallCategories } from './chartUtils'

// This component was named in the honor of http://ravijen.fr/?p=440

export default ({
	target = 'bilan',
	numberBottomRight,
	verticalReverse,
	noLinks,
}) => {
	const { t, i18n } = useTranslation()
	const rules = useSelector((state) => state.rules)
	const engine = useEngine()
	const sortedCategories = extractCategories(rules, engine, null, target).map(
		(category) => ({
			...category,
			abbreviation: rules[category.dottedName].abréviation,
		})
	)

	const categories =
		target === 'bilan'
			? relegateCommonCategories(sortedCategories)
			: sortedCategories

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
				height: 100%;
				padding: 0;
				border: 2px solid white;
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
							justify-content: ${verticalReverse ? 'start' : 'end'};
						`}
					>
						<div
							css={`
								background: ${category.color};
								height: ${(category.nodeValue / empreinteMax.nodeValue) * 100}%;
							`}
						>
							<SubCategoriesVerticalBar
								{...{
									noLinks,
									category,
									engine,
									rules,
									numberBottomRight,
									verticalReverse,
								}}
							/>
						</div>
						<ConditionalLink
							active={!noLinks}
							css={`
								${verticalReverse && ` order: -1;`}
							`}
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
						</ConditionalLink>
					</li>
				)
			})}
		</ol>
	)
}

const SubCategoriesVerticalBar = ({
	rules,
	category,
	engine,
	numberBottomRight,
	verticalReverse,
	noLinks,
}) => {
	const { t, i18n } = useTranslation()
	const categories = getSubcategories(rules, category, engine, true)
	const { rest, restWidth, bigEnough, total } =
		groupTooSmallCategories(categories)

	const reverseOrNot = (list) => (verticalReverse ? list : list.reverse())

	const Other = () =>
		restWidth > 0 && (
			<VerticalBarFragment
				{...{
					label: restWidth < 5 ? '...' : 'Autres',
					title: t('Le reste : ') + rest.labels.join(', '),
					nodeValue: rest.value,
					dottedName: 'rest',
					heightPercentage: restWidth,
					compact: true,
					numberBottomRight,
				}}
			/>
		)
	const List = () =>
		reverseOrNot(bigEnough).map(
			({ nodeValue, title, abbreviation, icons, color, dottedName }) => {
				const titleWithoutPercent = getTitle(title)
				return (
					<ConditionalLink
						active={!noLinks}
						to={`/documentation/${utils.encodeRuleName(dottedName)}`}
					>
						<VerticalBarFragment
							{...{
								label:
									(abbreviation && capitalise0(abbreviation)) ||
									titleWithoutPercent,
								title:
									(abbreviation && capitalise0(abbreviation)) ||
									titleWithoutPercent,
								nodeValue,
								dottedName,
								heightPercentage: (nodeValue / total) * 100,
								icons,
								numberBottomRight,
							}}
						/>
					</ConditionalLink>
				)
			}
		)
	return (
		<ol
			css={`
				height: 100%;
				list-style-type: none;
				padding-left: 0;
				a {
					text-decoration: none;
				}
			`}
		>
			{verticalReverse ? (
				<>
					<List /> <Other />
				</>
			) : (
				<>
					<Other /> <List />
				</>
			)}
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
	numberBottomRight,
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
				position: relative;
				small {
					${numberBottomRight &&
					`
					position: absolute;
					bottom: 0.2rem;
					right: 0.3rem;
					`}
					color: inherit;
					line-height: 1rem;
				}
				border-top: 1px solid white;
				display: flex;
				flex-direction: ${nodeValue < 100 ? 'row' : 'column'};
				justify-content: center;
				img {
					width: 2rem;
					${compact ? 'height: 1rem' : 'height: auto'}
				}
			`}
			ref={ref}
			key={dottedName}
			title={`${title} : ${value} ${unit}`}
		>
			<SafeCategoryImage element={{ dottedName }} voidIfFail={!compact} />

			{!isOverflow && <strong>{label}</strong>}
			<small
				css={`
					${nodeValue < 100 &&
					`
					padding-left: 0.5rem;
					line-height: 1.2rem !important`};
				`}
			>
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

const ConditionalLink = ({ active, ...props }) =>
	active ? <Link {...props} /> : <span>{props.children}</span>
