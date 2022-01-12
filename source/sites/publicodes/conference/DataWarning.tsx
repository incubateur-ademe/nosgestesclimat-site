import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import emoji from '../../../components/emoji'
import IllustratedMessage from '../../../components/ui/IllustratedMessage'
import { Link } from 'react-router-dom'

export default ({ room }) => {
	const history = useHistory()
	const dispatch = useDispatch()
	return (
		<div>
			<IllustratedMessage
				emoji="📊"
				message={
					<div>
						<p>
							Vous avez été invités à un sondage Nos Gestes Climat nommé{' '}
							<span css="background: var(--color); color: var(--textColor); padding: 0 .2rem">
								{room}
							</span>
							.
						</p>
					</div>
				}
			/>

			<IllustratedMessage
				emoji="🕵"
				message={
					<div>
						<p>
							En participant, vous acceptez la collecte <em>anonyme</em> de vos
							résultats agrégés de simulation sur notre serveur : l'empreinte
							climat totale et les catégories (transport, logement, etc.).{' '}
							<Link to="/vie-privée">En savoir plus</Link>
						</p>
						<button
							className="ui__ button simple"
							onClick={() => {
								dispatch({ type: 'SET_SURVEY', room })
							}}
						>
							Lancer le sondage
						</button>
						<button
							className="ui__ button simple"
							onClick={() => history.push('/')}
						>
							Quitter
						</button>
					</div>
				}
			/>
		</div>
	)
}
