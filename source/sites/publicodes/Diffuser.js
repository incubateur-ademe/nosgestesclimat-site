import { Markdown } from 'Components/utils/markdown'
import content from 'raw-loader!./diffuser.md'
import Meta from '../../components/utils/Meta'

export default () => (
	<section className="ui__ container" id="diffuser">
		<Meta
			title="Diffuser Nos Gestes Climat"
			description={`
Ce simulateur vous permet d'évaluer votre empreinte carbone individuelle annuelle totale et par grandes catégories (alimentation, transport, logement, divers, services publics, numérique), de la situer par rapport aux objectifs climatiques et surtout de passer à l’action à votre niveau avec des gestes personnalisés en fonction de vos réponses.

		`}
		/>
		<Markdown children={content} />
	</section>
)
