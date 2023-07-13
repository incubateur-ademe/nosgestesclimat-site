import {
	deleteSimulationById,
	setActionsChoices,
	setAllStoredTrajets,
	setCurrentSimulation,
} from '@/actions/actions'
import { Simulation } from '@/reducers/rootReducer'
import { Trans } from 'react-i18next'

export default ({ dispatch, list, currentSimulationId }) => {
	return (
		<ul>
			{list.map((simulation: Simulation) => {
				const dateSimu =
					simulation.date !== undefined ? new Date(simulation.date) : new Date()
				return (
					<li key={simulation.id} css="list-style-type: none">
						<details>
							<summary>
								<div
									css={`
										display: inline-flex;
									`}
								>
									<span>{dateSimu.toLocaleDateString()}</span>
									<span
										css={`
											margin-left: 0.25rem;
											width: 8rem;
											overflow: hidden;
											white-space: nowrap;
											text-overflow: ellipsis;
											@media (max-width: 800px) {
												display: none;
											}
										`}
									>
										- {simulation.id}
									</span>
									{currentSimulationId === simulation.id ? (
										<span css="margin: 0 1rem">
											✅ <Trans>Chargée</Trans>
										</span>
									) : (
										<span>
											<button
												className={'ui__ button simple small'}
												css="margin: 0 1rem"
												onClick={() => {
													dispatch(setCurrentSimulation(simulation))
													dispatch(setActionsChoices(simulation.actionChoices))
													dispatch(
														setAllStoredTrajets(simulation.storedTrajets)
													)
												}}
											>
												<Trans>Charger</Trans>
											</button>
											<button
												className={'ui__ button simple small'}
												css="margin: 0 1rem"
												onClick={() => {
													dispatch(deleteSimulationById(simulation.id))
												}}
											>
												<Trans>supprimer</Trans>
											</button>
										</span>
									)}
								</div>
							</summary>
							<ul>
								<li>
									Date complète : {dateSimu.toLocaleDateString()}{' '}
									{dateSimu.toLocaleTimeString()}.
								</li>
								<li>Identifiant : {simulation.id}.</li>
							</ul>
						</details>
					</li>
				)
			})}
		</ul>
	)
}
