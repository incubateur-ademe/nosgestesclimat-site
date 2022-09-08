import { Markdown } from 'Components/utils/markdown'
import content from 'raw-loader!./accessibility.md'
import Meta from '../../../components/utils/Meta'

export default ({ t }) => (
	<section className="ui__ container">
		<Meta
			title={t('Accessibilité')}
			description={t('meta.pages.accessibility.description')}
		/>
		<Markdown children={content} />
	</section>
)
