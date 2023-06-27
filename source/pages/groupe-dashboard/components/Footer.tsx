import ButtonLink from '@/pages/creer-groupe/components/ButtonLink'
import { Trans } from 'react-i18next'

export default function Footer() {
	return (
		<footer className="bg-lightGrey p-6 px-8 md:px-6 -ml-4">
			<h2 className="mt-0">
				<Trans>Comment agir</Trans>
			</h2>
			<p className="mb-8">
				<Trans>
					Découvrez nos pistes pour agir dès aujourd’hui pour le climat, ou
					passe le test pour obtenir des recommandations personnalisées
				</Trans>
			</p>
			<ButtonLink color="secondary" href="/actions">
				<Trans>Toutes les actions</Trans>
			</ButtonLink>
		</footer>
	)
}
