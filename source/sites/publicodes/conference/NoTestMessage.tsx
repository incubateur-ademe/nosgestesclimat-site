import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import IllustratedMessage from '../../../components/ui/IllustratedMessage'

export default ({ setHasDataState }) => (
	<IllustratedMessage
		emoji="🏁"
		message={
			<div>
				<p>
					Bienvenue dans le mode groupe de Nos Gestes Climat ! Vous n'avez pas
					encore débuté votre test, lancez-vous !
				</p>
				<div
					css={`
						display: flex;
						flex-wrap: wrap;
						justify-content: space-evenly;
						margin: 1rem 0 0;
						button {
							margin: 0.4rem 0;
						}
					`}
				>
					<button>
						<Link className="ui__ button plain" to={'/simulateur/bilan'}>
							Faire mon test
						</Link>
					</button>
					<button
						className="ui__ small button"
						onClick={() => {
							setHasDataState(true)
						}}
					>
						{emoji('🧮')} Voir les réponses
					</button>
				</div>
			</div>
		}
	/>
)
