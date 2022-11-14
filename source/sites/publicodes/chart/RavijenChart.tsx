import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { extractCategories } from '../../../components/publicodesUtils'
import { useEngine } from '../../../components/utils/EngineContext'

import { relegate } from 'Components/publicodesUtils'
import SafeCategoryImage from '../../../components/SafeCategoryImage'

// This component was named in the honor of http://ravijen.fr/?p=440

export default ({ categories, empreinteTotale, color, onCategoryClick }) => {
	const { t } = useTranslation()
	const rules = useSelector((state) => state.rules)
	const engine = useEngine()
	const sortedCategories = extractCategories(rules, engine, details).map(
		(category) => ({
			...category,
			abbreviation: rules[category.dottedName].abbréviation,
		})
	)
	const categories = relegate('services publics', sortedCategories)

	if (!categories) return null

	const empreinteTotale = categories.reduce(
		(memo, next) => next.nodeValue + memo,
		0
	)
	return (
		<ol
			css={`
				margin: 0;
				width: ${barWidth};
				height: 100%;
				padding: 0;
				${barBorderStyle(color)}
				cursor: pointer;
				:hover {
					border-color: var(--lightColor);
				}
			`}
			onClick={onCategoryClick}
			title={t('Explorer les catégories')}
		>
			{categories.map((category, index) => (
				<li
					key={category.title}
					title={`${category.title} : ${Math.round(
						(category.nodeValue / empreinteTotale) * 100
					)}%`}
					css={`
						margin: 0;
						list-style-type: none;
						background: ${category.color};
						height: ${(category.nodeValue / empreinteTotale) * 100}%;
						display: flex;
						align-items: center;
						justify-content: center;
						img {
							font-size: 120%;
						}
						@media (min-height: 800px) {
							img {
								font-size: 180%;
							}
						}
						${index < categories.length - 1 &&
						`
					border-bottom: 4px solid ${color};

					padding: 0;
					`}
					`}
				>
					{category.nodeValue / empreinteTotale > 0.1 ? (
						<SafeCategoryImage element={category} />
					) : (
						''
					)}
				</li>
			))}
		</ol>
	)
}
