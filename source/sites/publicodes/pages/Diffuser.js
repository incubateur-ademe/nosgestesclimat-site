import { Markdown } from 'Components/utils/markdown'
import content from 'raw-loader!./diffuser.md'
import Meta from '../../../components/utils/Meta'

export default ({ t }) => (
	<section className="ui__ container" id="diffuser">
		<Meta
			title={t('Diffuser Nos Gestes Climat')}
			description={t('meta.publicodes.pages.Diffuser.description')}
		/>
		<Markdown children={content} />
	</section>
)
