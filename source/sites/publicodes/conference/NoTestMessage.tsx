import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'

export default ({ setHasDataState }) => (
	<div
		className="ui__ card"
		css={`
			max-width: 30rem;
			margin: 0 auto;
			display: flex;
			flex-direction: column;
			align-items: center;
		`}
	>
		<span
			css={`
				img {
					font-size: 300%;
					margin: 0.6rem !important;
				}
			`}
		>
			{emoji('🕳️')}
		</span>
		<div
			css={`
				margin: 0 0 1rem 0;
			`}
		>
			<p>
				Bienvenue dans le mode "A plusieurs" de Nos Gestes Climat ! Vous n'avez
				pas encore débuter votre test, lancez-vous !
			</p>{' '}
		</div>
		<div
			css={`
				display: flex;
				flex-direction: row;
				align-items: space-evenly;
				margin-bottom: 1rem;
				> button {
					width: 50% !important;
					margin: 0.1rem;
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
				Accéder directement aux résultats du groupe{' '}
			</button>
		</div>
	</div>
)
