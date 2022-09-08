import { Markdown } from 'Components/utils/markdown'
import about from 'raw-loader!./about.md'
import Meta from '../../../components/utils/Meta'

export default ({ t }) => (
	<section className="ui__ container" id="about">
		<Meta
			title={t('À propos')}
			description={t('meta.pages.about.description')}
		/>

		<Markdown>{about}</Markdown>
	</section>
)
