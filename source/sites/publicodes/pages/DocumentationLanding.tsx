import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import SearchBar from '../../../components/SearchBar'
import Meta from '../../../components/utils/Meta'
import editorialisedModels from './editorialisedModels.yaml'

export default function DocumentationLanding() {
	const { t } = useTranslation()
	const rules = useSelector((state) => state.rules)
	const editos = Object.entries(editorialisedModels).map(([key, value]) => ({
		...rules[key],
		edito: value.label,
	}))
	return (
		<div className="ui__ container">
			<Meta
				title={t('Comprendre nos calculs')}
				description={t('meta.publicodes.pages.Documentation.description')}
			/>
			<h1>Documentation</h1>
			<h2>
				<Trans>Explorez nos modèles</Trans>
			</h2>
			<SearchBar />
			<h2>
				<Trans>Quelques suggestions </Trans>
			</h2>
			<ol
				css={`
					display: flex;
					justify-content: center;
					align-items: center;
					flex-wrap: wrap;
					> li {
						height: 10rem;
					}
				`}
			>
				{editos.map(({ icônes, color, dottedName, title, edito }) => (
					<li key={dottedName} className="ui__ card box">
						{icônes}
						{edito}
					</li>
				))}
			</ol>
		</div>
	)
}
