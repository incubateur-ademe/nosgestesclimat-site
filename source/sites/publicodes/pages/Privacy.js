import { Markdown } from 'Components/utils/markdown'
import content from 'raw-loader!./privacy.md'
import Meta from '../../../components/utils/Meta'
import { useTranslation } from 'react-i18next'

export default () => {
	const { t } = useTranslation()

	return (
		<section className="ui__ container">
			<Meta
				title={t('Données personnelles')}
				description={t('meta.publicodes.pages.Privacy.description')}
			/>
			<Markdown children={content} />
		</section>
	)
}
