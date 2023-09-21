import Container from '@/components/groupe/Container'
import { Trans } from 'react-i18next'

export const ServerErrorSection = () => {
	return (
		<Container className="mt-7 bg-gray-100 p-4">
			<h2 className="text-lg font-medium mb-2 mt-0">
				<Trans>Oups ! Désolé, une erreur est survenue.</Trans>
			</h2>
			<p className="text-sm mb-6">
				<Trans>
					Nos équipes ont été prévenues ; veuillez réessayer d'accéder à cette
					page plus tard.
				</Trans>
			</p>
		</Container>
	)
}
