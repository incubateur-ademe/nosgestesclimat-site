import { Trans } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function GoBackLink({ className }: { className?: string }) {
	const navigate = useNavigate()
	return (
		<button
			onClick={() => navigate(-1)}
			className={`${className} inline-block text-primary hover:opacity-80 !text-[1rem] transition-opacity px-0`}
		>
			← <Trans>Retour</Trans>
		</button>
	)
}
