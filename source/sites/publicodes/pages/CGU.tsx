import { Markdown } from 'Components/utils/markdown'
import content from 'raw-loader!./CGU.md'
import Meta from '../../../components/utils/Meta'

export default () => (
	<section className="ui__ container">
		<Meta title="Conditions générales d'utilisation" />
		<Markdown children={content} />
	</section>
)
