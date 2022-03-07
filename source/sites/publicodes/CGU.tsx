import { Markdown } from 'Components/utils/markdown'
import content from 'raw-loader!./CGU.md'
import { Link } from 'react-router-dom'
import Meta from '../../components/utils/Meta'

export default () => (
	<section className="ui__ container">
		<Meta title="Conditions générales d'utilisation" />
		<Markdown source={content} />
	</section>
)
