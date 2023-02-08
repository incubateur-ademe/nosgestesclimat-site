import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import IllustratedMessage from '../../../components/ui/IllustratedMessage'

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
								Vous avez été invité à un sondage Nos Gestes Climat nommé
							</Trans>{' '}
							<span css="background: var(--color); color: var(--textColor); padding: 0 .2rem">
								{room}
							</span>
							.
						</p>
						<p>
							📘{' '}
							<Trans i18nKey={'publicodes.conference.DataWarning.explanation'}>
								Le principe est simple : chacun fait son test sur son appareil,
								et les résultats sont mis en commun en temps réel avec les
								autres participants du sondage.
							</Trans>
						</p>
						<p>
							<Trans i18nKey={'publicodes.conference.DataWarning.viePrivée'}>
								🕵 En participant, vous acceptez la collecte <em>anonyme</em> de
								vos résultats agrégés de simulation sur notre serveur :
								l'empreinte climat totale et les catégories (transport,
								logement, etc.). <Link to="/vie-privée">En savoir plus</Link>
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
