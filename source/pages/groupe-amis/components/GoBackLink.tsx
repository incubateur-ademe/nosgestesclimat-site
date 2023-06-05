import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function GoBackLink({ className }: { className?: string }) {
	return (
		<Link to={'..'} className={`${className} inline-block`}>
			← <Trans>Retour</Trans>
		</Link>
	)
}
