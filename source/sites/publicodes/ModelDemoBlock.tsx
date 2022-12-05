import { useEffect, useState } from 'react'
import { useEngine } from '../../components/utils/EngineContext'
import { WithEngine } from '../../RulesProvider'
import InlineCategoryChart from './chart/InlineCategoryChart'
import HumanWeight from './HumanWeight'

const demoDottedNames = [
	'intensité électricité',
	'transport . voiture . thermique . empreinte au litre',
	"logement . construction . durée d'amortissement",
]

export default () => {
	const [situation, setSituation] = useState({})
	const engine = useEngine()
	const bilan = engine.evaluate('bilan')

	useEffect(() => {
		engine.setSituation(situation)
	}, [situation])

	return (
		<WithEngine>
			<div>
				<ul>
					{demoDottedNames.map((el) => (
						<li key={el}>
							<label>
								{el}{' '}
								<input
									type="number"
									onChange={(e) =>
										e.target.value &&
										setSituation({ ...situation, [el]: e.target.value })
									}
								/>
							</label>
						</li>
					))}
				</ul>

				<div>
					<HumanWeight nodeValue={bilan.nodeValue} />
				</div>
				<InlineCategoryChart />
			</div>
		</WithEngine>
	)
}
