import { Trans } from 'react-i18next'
import { WithEngine } from '../../../RulesProvider'
import Chart from '../chart'

export default () => (
	<>
		<Trans i18nKey={'publicodes.Tutorial.slide6'}>
			<h1>D'où vient notre empreinte ?</h1>
			<p>
				Prendre la voiture, manger un steak, chauffer sa maison, se faire
				soigner, acheter une TV...
			</p>
			<div
				css={`
					margin: 0.6rem 0 1rem;
				`}
			>
				<WithEngine>
					<Chart demoMode />
				</WithEngine>
			</div>
			<p>
				L'empreinte de notre consommation individuelle, c'est la somme de toutes
				ces activités qui font notre vie moderne.{' '}
			</p>
		</Trans>
	</>
)
