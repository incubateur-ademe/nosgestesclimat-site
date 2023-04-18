import { deleteSimulationById } from 'Actions/actions'
import { Trans } from 'react-i18next'
import {
	setActionsChoices,
	setAllStoredTrajets,
	setCurrentSimulation,
} from '../../actions/actions'
export default ({ dispatch, list, currentSimulation }) => {
	
	return (
		<ul>
			{list.map((simulation) => {
				const dateSimu = new Date(simulation.date);
				return (<li key={simulation.id} css="list-style-type: none">
					<details css="display: inline-block;">
						<summary>{dateSimu.toLocaleDateString()}</summary>
						<ul>
							<li>Date complète : {dateSimu.toLocaleDateString()} {dateSimu.toLocaleTimeString()}.</li>
							<li>Identifiant : {simulation.id}.</li>
						</ul>
					</details>
					{currentSimulation.id === simulation.id ? (
						<span css="margin: 0 1rem">
							✅ <Trans>Chargée</Trans>
						</span>
					) : (
						<span>
							<button
								className={`ui__ button simple small`}
								css="margin: 0 1rem"
								onClick={() => {
									dispatch(setCurrentSimulation(simulation))
									dispatch(setActionsChoices(simulation.actionChoices))
									dispatch(setAllStoredTrajets(simulation.storedTrajets))
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
				</li>)
			}
			)}
		</ul>
	)
}
