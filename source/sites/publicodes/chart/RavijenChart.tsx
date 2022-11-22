import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
	extractCategories,
	getSubcategories,
} from '../../../components/publicodesUtils'
import { useEngine } from '../../../components/utils/EngineContext'

import { relegate } from 'Components/publicodesUtils'
import SafeCategoryImage from '../../../components/SafeCategoryImage'

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
	return (
		<ol
			css={`
				margin: 0;
				height: 30rem;
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
						width: 3rem;
						margin: 0 1rem;
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
					<SubCategoriesVerticalBar {...{ category, engine, rules }} />
					<SafeCategoryImage element={category} />
				</li>
			))}
		</ol>
	)
}

const SubCategoriesVerticalBar = ({ rules, category, engine }) => {
	const subCategories = getSubcategories(rules, category, engine)
	return (
		<ol>
			{subCategories.map((subCategory) => (
				<li>Lalala</li>
			))}
		</ol>
	)
}
