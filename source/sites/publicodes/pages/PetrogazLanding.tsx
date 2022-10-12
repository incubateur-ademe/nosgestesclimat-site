import { Markdown } from 'Components/utils/markdown'
import content from 'raw-loader!./petrogazLanding.md'
import Meta from '../../../components/utils/Meta'

export default () => (
	<section className="ui__ container" id="about" css={``}>
		<Meta
			title="Mon empreinte pétrole et gaz"
			image={
				'https://images.unsplash.com/photo-1613483760414-75759637dc21?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
			}
			description={`
Nos Gestes Climat vous permet non seulement d'estimer votre empreinte sur le climat, mais également votre consommation de pétrole. Ce dernier est responsable d'une grande partie de l'empreinte climat, mais son achat a également d'autres conséquences, notamment géopolitiques. 

		`}
		/>

		<Markdown>{content}</Markdown>
	</section>
)
