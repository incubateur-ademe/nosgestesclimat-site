import { useEngine } from 'Components/utils/EngineContext'
import { correctValue } from 'Components/publicodesUtils'
import HumanWeight from './HumanWeight'
import { Link } from 'react-router-dom'

export default ({ endURL }) => {
	const engine = useEngine()
	const evaluation = engine.evaluate('pétrole . pleins')
	const nbrePleins = Math.round(correctValue(evaluation))

	const roundedValue = nbrePleins

	return (
		<Link
			css={`
				background: rgba(0, 0, 0, 0)
					linear-gradient(60deg, var(--darkColor) 0%, var(--darkestColor) 100%)
					repeat scroll 0% 0%;
			`}
			to={endURL}
			title="Page de fin de simulation"
		>
			<div css="display: flex; align-items: center">
				<img
					src="/images/pompe-essence.svg"
					css="width: 3rem; "
					alt="Pompe à pétrole"
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
