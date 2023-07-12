import { Trans } from 'react-i18next'

export default ({ customEnd, customEndMessages }) => {
	return (
		<div style={{ textAlign: 'center' }} data-cypress-id="simulation-ending">
			{customEnd ?? (
				<>
					<h3>
						<Trans i18nKey="simulation-end.title">
							🌟 Vous avez complété cette simulation
						</Trans>
					</h3>
					<p>
						{customEndMessages ? (
							customEndMessages
						) : (
							<Trans i18nKey="simulation-end.text">
								Vous avez maintenant accès à l'estimation la plus précise
								possible.
							</Trans>
						)}
					</p>
				</>
			)}
		</div>
	)
}
