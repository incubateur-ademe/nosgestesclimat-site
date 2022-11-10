import { correctValue } from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import HumanWeight from './HumanWeight'

export default ({ endURL }) => {
	const engine = useEngine()
	const evaluation = engine.evaluate('pétrole . pleins')
	const nbrePleins = Math.round(correctValue(evaluation))

	const roundedValue = nbrePleins

	const { t } = useTranslation()

	return (
		<Link
			css={`
				background: rgba(0, 0, 0, 0)
					linear-gradient(60deg, var(--darkColor) 0%, var(--darkestColor) 100%)
					repeat scroll 0% 0%;
				color: white !important;
			`}
			to={endURL}
			title={t('Page de fin de simulation pétrole')}
		>
			<div css="display: flex; align-items: center">
				<img
					src="/images/pompe-essence.svg"
					css="width: 3rem; "
					alt={t('Pompe à pétrole')}
				/>
				<div
					css="display: flex; flex-direction: column; padding: 0 .4rem"
					title={roundedValue + ' ' + t(`pleins de pétrole`)}
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
								unitText: 'pleins',
								longUnitText: t('pleins de pétrole'),
							}}
						/>
					</div>
				</div>
			</div>
		</Link>
	)
}
