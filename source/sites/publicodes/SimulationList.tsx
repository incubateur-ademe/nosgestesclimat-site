import { deleteSimulationById } from 'Actions/actions'
import { Trans } from 'react-i18next'
import { setActionChoice, setCurrentSimulation, setStoredTrajets } from '../../actions/actions'
export default ({ dispatch, list, currentSimulation }) => {
	return (
		<ul>
			{list.map((simulation) => (
				<li key={simulation.id}>
					"{simulation.id}" du {new Date(simulation.date).toLocaleDateString()}
					{currentSimulation.id === simulation.id ? (
						<span css="margin: 0 1rem">
							<Trans>Chargée</Trans>
						</span>
					) : (
						<span>
							<button
								className={`ui__ button simple small`}
								css="margin: 0 1rem"
								onClick={() => {
									dispatch(setCurrentSimulation(simulation))
									for (const choice in simulation.actionChoices) {
										dispatch(setActionChoice(choice, simulation.actionChoices[choice]))
									}
									for (const trajet in simulation.storedTrajets) {
										dispatch(setStoredTrajets(trajet, simulation.storedTrajets[trajet]))
									}
								}}
							>
								<Trans>Charger</Trans>
							</button>
							<button
								className={`ui__ button simple small`}
								css="margin: 0 1rem"
								onClick={() => {
									dispatch(deleteSimulationById(simulation.id))
								}}
							>
								<Trans>supprimer</Trans>
							</button>
						</span>
					)}
				</li>
			))}
		</ul>
	)
}
