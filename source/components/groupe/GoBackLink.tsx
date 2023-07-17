import { Trans } from 'react-i18next'
import Link from './Link'

export default function GoBackLink({ className }: { className?: string }) {
	return (
		<Link
			href="/groupes"
			className={`${className} no-underline inline-block text-primary hover:opacity-80 !text-[1rem] transition-opacity px-0`}
		>
			← <Trans>Retour</Trans>
		</Link>
	)
}
