import ButtonLink from '@/components/groupe/ButtonLink'
import Container from '@/components/groupe/Container'
import { Trans } from 'react-i18next'

export default function NoSimulationSection() {
	return (
		<Container className="mt-7 bg-gray-100 p-4">
			<h2 className="text-lg font-medium mb-2 mt-0">
				<Trans>Créer un groupe</Trans>
			</h2>
			<p className="text-sm mb-6">
				Pour créer un groupe, vous devez d'abord calculer votre empreinte
				carbone.
			</p>
			<ButtonLink
				href={'/simulateur/bilan'}
				data-cypress-id="button-create-group-no-simulation"
			>
				<Trans>Passer le test</Trans>
			</ButtonLink>
		</Container>
	)
}
