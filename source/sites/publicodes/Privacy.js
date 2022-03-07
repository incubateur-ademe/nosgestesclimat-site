import { Markdown } from 'Components/utils/markdown'
import content from 'raw-loader!./confidentialité.md'
import { Link } from 'react-router-dom'
import Meta from '../../components/utils/Meta'

export default () => (
	<section className="ui__ container">
		<Meta
			title="Données personnelles"
			description="Nos gestes climat, hors mode groupe, fonctionne sans serveur, donc vos données restent chez vous. Nous collectons anonymement des données aggregées pour améliorer le simulateur."
		/>
		<Markdown source={content} />
	</section>
)
