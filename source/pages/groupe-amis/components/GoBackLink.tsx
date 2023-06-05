import { Trans } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function GoBackLink({ className }: { className?: string }) {
	const navigate = useNavigate()
	return (
		<button
			onClick={() => navigate(-1)}
			className={`${className} inline-block`}
		>
			← <Trans>Retour</Trans>
		</button>
	)
}
