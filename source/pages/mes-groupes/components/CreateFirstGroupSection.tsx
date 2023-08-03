import ButtonLink from '@/components/groupe/ButtonLink'
import Container from '@/components/groupe/Container'
import { Trans } from 'react-i18next'

export default function CreateFirstGroupSection() {
	return (
		<Container className="mt-7 bg-gray-100 p-4">
			<h2 className="text-lg font-medium mb-2 mt-0">
				<Trans>Créez votre premier groupe</Trans>
			</h2>
			<p className="text-sm mb-6">
				Invitez vos proches pour comparer vos résultats. Cela prend{' '}
				<strong className="text-secondary">1 minute</strong> !
			</p>
			<ButtonLink
				href={'/groupes/creer'}
				data-cypress-id="button-create-first-group"
			>
				<Trans>Commencer</Trans>
			</ButtonLink>
		</Container>
	)
}
