import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import IllustratedMessage from '../../components/ui/IllustratedMessage'
import { PersonaGrid } from './Personas'

export default ({}) => {
	return (
		<div className="ui__ card light colored content" css="margin-top: 1.6rem">
			<h1>
				<Trans>Simulation manquante</Trans>
			</h1>
			<IllustratedMessage
				inline
				emoji="⏳"
				message={
					<p>
						<Trans i18nKey={`publicodes.SimulationMissing.simulationManquante`}>
							Vous n'avez pas encore fait le test. Pour débloquer ce parcours,
							vous devez nous en dire un peu plus sur votre mode de vie.
						</Trans>
					</p>
				}
			/>
			<div css="margin: 2rem auto 4rem; text-align: center">
				<Link to="/simulateur/bilan" className="ui__ plain button">
					<Trans>Faire le test</Trans>
				</Link>
			</div>
			<p css="text-align: center; max-width: 26rem; margin: 0 auto;">
				{emoji('💡 ')}
				<Trans i18nKey={`publicodes.SimulationMissing.personnas`}>
					Vous pouvez aussi voir le parcours action comme si vous étiez l'un de
					ces profils types.
				</Trans>
			</p>
			<PersonaGrid
				additionnalOnClick={() => null}
				warningIfSituationExists={true}
			/>
		</div>
	)
}
