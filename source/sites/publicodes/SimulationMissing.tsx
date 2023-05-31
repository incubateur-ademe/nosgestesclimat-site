import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

export default ({}) => {
	return (
		<div
			className="ui__ card light colored content"
			css={`
				margin: 1.6em 0.5rem 1.6rem 0.5rem;
				text-align: center;
				padding: 1rem !important;
			`}
		>
			<p
				css={`
					text-align: center;
				`}
			>
				🔒{' '}
				<Trans i18nKey={'publicodes.SimulationMissing.simulationManquante'}>
					Pour débloquer ce parcours, vous devez d'abord terminer le test.
				</Trans>
			</p>
			<div css="margin: 1rem auto; text-align: center">
				<Link to="/simulateur/bilan" className="ui__ plain button">
					<Trans>Faire le test</Trans>
				</Link>
			</div>
			<p css="text-align: center; margin: 0 ">
				<small>
					<Trans i18nKey={'publicodes.SimulationMissing.personnas'}>
						Vous pouvez aussi continuer avec un{' '}
						<Link to="/personas">profil type</Link>.
					</Trans>
				</small>
			</p>
		</div>
	)
}
