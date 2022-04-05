import { useEngine } from 'Components/utils/EngineContext'
import { correctValue } from 'Components/publicodesUtils'
import HumanWeight from './HumanWeight'
import { Link } from 'react-router-dom'

export default ({ endURL }) => {
	const engine = useEngine()
	const evaluation_EROI = engine.evaluate('pétrole . pleins EROI')
	const nbrePleins_EROI = Math.round(correctValue(evaluation_EROI))
	const evaluation_energ = engine.evaluate('pétrole . pleins énergie')
	const nbrePleins_energ = Math.round(correctValue(evaluation_energ))

	const roundedValue = nbrePleins_EROI // TODO difference to be investigated

	return (
		<Link
			css={`
				background: rgba(0, 0, 0, 0)
					linear-gradient(60deg, var(--darkColor) 0%, var(--darkestColor) 100%)
					repeat scroll 0% 0%;
				border-left-style: solid;
			`}
			to={endURL}
			title="Page de fin de simulation"
		>
			<div css="display: flex; align-items: center">
				<img
					src="/images/pompe-essence.svg"
					css="width: 3rem; "
					alt="Une pompe à pétrole"
				/>
				<div
					css="display: flex; flex-direction: column; padding: 0 .4rem"
					title={`${roundedValue} pleins de pétrole`}
				>
					<div
						css={`
							.humanValue {
								font-size: 140%;
								font-weight: bold;
							}
						`}
					>
						<HumanWeight
							{...{
								nodeValue: roundedValue,
								metric: 'pétrole',
								unitSuffix: 'pleins',
								longUnitSuffix: 'pleins de pétrole',
							}}
						/>
					</div>
				</div>
			</div>
		</Link>
	)
}
