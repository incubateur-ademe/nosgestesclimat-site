import { Link } from 'react-router-dom'
import { minutes } from './Banner'
import ReturnToEnquêteButton from './ReturnToEnquêteButton'

const nothing = () => null
export default ({ setTimeMessage = nothing }) => (
	<div
		css={`
			padding-top: 4vh;
			max-width: 650px;
			margin: 0 auto;
			p {
				margin-bottom: 1rem;
			}
			button {
				margin: 1rem;
			}
		`}
	>
		<p>
			Une fois{' '}
			<Link to="/simulateur/bilan" onClick={() => setTimeMessage(false)}>
				le test
			</Link>{' '}
			terminé, explorez le{' '}
			<Link to="/actions" onClick={() => setTimeMessage(false)}>
				parcours&nbsp;action
			</Link>
			, qui vous propose diverses façons concrètes pour réduire votre empreinte
			climat.
		</p>
		<p>
			Vous pourrez les mettre dans votre panier et visualiser la réduction
			d'empreinte ainsi gagnée.
		</p>
		<p>
			<strong>N'oubliez pas</strong>, une fois le parcours action terminé, de
			retourner sur le questionnaire d'enquête OpinionWay avec le deuxième
			bouton ci-dessous. Nous vous le rappelerons dans {minutes} minutes.
		</p>
		<button className="ui__ button " onClick={() => setTimeMessage(false)}>
			⏳️ Je n'ai pas terminé
		</button>
		<ReturnToEnquêteButton />
	</div>
)
