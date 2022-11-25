import { Trans, useTranslation } from 'react-i18next'
import SearchBar from '../../../components/SearchBar'
import Meta from '../../../components/utils/Meta'

export default function DocumentationLanding() {
	const { t } = useTranslation()
	return (
		<div className="ui__ container">
			<Meta
				title={t('Comprendre nos calculs')}
				description={t('meta.publicodes.pages.Documentation.description')}
			/>
			<h1>Documentation</h1>
			<h2>
				<Trans>Explorez notre modèle</Trans>
			</h2>
			<SearchBar />
		</div>
	)
}
