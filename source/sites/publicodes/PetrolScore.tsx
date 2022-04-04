import { useEngine } from 'Components/utils/EngineContext'
import { correctValue } from 'Components/publicodesUtils'

export default () => {
	const engine = useEngine()
	const evaluation_EROI = engine.evaluate('pétrole . pleins EROI')
	const nbrePleins_EROI = Math.round(correctValue(evaluation_EROI))
	const evaluation_energ = engine.evaluate('pétrole . pleins énergie')
	const nbrePleins_energ = Math.round(correctValue(evaluation_energ))

	const roundedValue = nbrePleins_EROI // TODO difference to be investigated

	return (
		<div css="display: flex; align-items: center">
			<img
				src="/images/pompe-essence.svg"
				css="width: 3rem; margin-right: .4rem"
				alt="Icône représentant une pompe à pétrole"
			/>
			<div
				css="display: flex; flex-direction: column"
				title={`${roundedValue} pleins de pétrole`}
			>
				<div css="font-size: 120%; font-weight: bold">
					{roundedValue} pleins
				</div>

				<div css="@media (max-width: 800px){display: none}">de pétrole</div>
			</div>
		</div>
	)
}
