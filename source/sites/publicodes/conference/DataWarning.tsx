import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import emoji from '../../../components/emoji'
import IllustratedMessage from '../../../components/ui/IllustratedMessage'
import { LinkWithQuery } from 'Components/LinkWithQuery'
import { Trans } from 'react-i18next'

export default ({ room }) => {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	return (
		<div>
			<IllustratedMessage
				emoji="📊"
				message={
					<div>
						<p>
							<Trans>
								Vous avez été invités à un sondage Nos Gestes Climat nommé
							</Trans>{' '}
							<span css="background: var(--color); color: var(--textColor); padding: 0 .2rem">
								{room}
							</span>
							.
						</p>
						<p>
							<Trans i18nKey={'publicodes.conference.DataWarning.viePrivée'}>
								{emoji('🕵')} En participant, vous acceptez la collecte{' '}
								<em>anonyme</em> de vos résultats agrégés de simulation sur
								notre serveur : l'empreinte climat totale et les catégories
								(transport, logement, etc.).{' '}
								<LinkWithQuery to="/vie-privée">En savoir plus</LinkWithQuery>
							</Trans>
						</p>
						<div
							css={`
								display: flex;
								flex-wrap: wrap;
								justify-content: space-evenly;
								margin: 1rem 0 0;
							`}
						>
							<button
								className="ui__ button plain  "
								onClick={() => {
									dispatch({ type: 'SET_SURVEY', room })
								}}
							>
								<Trans>Participer au sondage</Trans>
							</button>
							<button
								className="ui__ button simple"
								onClick={() => navigate('/')}
							>
								<Trans>Quitter</Trans>
							</button>
						</div>
					</div>
				}
			/>
		</div>
	)
}
