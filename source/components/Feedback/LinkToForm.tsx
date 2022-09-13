import { Trans } from 'react-i18next'

// Envie de donner un coup de pouce ? Répondez à notre sondage sur le simulateur.
export default function LinkToForm() {
	const hostname = new URL(
		new URLSearchParams(document.location.search).get('integratorUrl') ||
			document.referrer ||
			document.location.origin
	).hostname.replace(/^www\.|^m\./, '')
	return (
		<div
			style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}
		>
			<span className="feedback-page ui__ notice">
				<span>
					<Trans>Envie de donner un coup de pouce ?</Trans>{' '}
					<a
						target="_blank"
						href={`https://docs.google.com/forms/d/e/1FAIpQLSdrA0Jl61oACUmn54uYN7hd3XRgBQEJkpzAihPLtJn4FezmsQ/viewform?usp=pp_url&entry.455823333=${hostname}`}
					>
						<Trans>Répondez à notre sondage sur le simulateur.</Trans>
					</a>
				</span>
			</span>
		</div>
	)
}
