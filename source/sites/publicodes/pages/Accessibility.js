import { Markdown } from 'Components/utils/markdown'
import content from 'raw-loader!./accessibility.md'
import Meta from '../../../components/utils/Meta'

export default () => (
	<section className="ui__ container">
		<Meta
			title="Accessibilité"
			description="Le site Nos Gestes Climat est partiellement conforme avec le référentiel général d’amélioration de l’accessibilité, RGAA version 4.1"
		/>
		<Markdown children={content} />
	</section>
)
