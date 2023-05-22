import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Logo from './Logo'

type Props = {
	error: Error
	largeScreen: boolean
}

export const ErrorFallback = ({ largeScreen, error }: Props) => {
	const { t } = useTranslation()

	useEffect(() => {
		const chunkFailedMessage = /Loading chunk [\d]+ failed/
		if (error?.message && chunkFailedMessage.test(error.message)) {
			window.location.reload()
		}
	}, [error])

	return (
		<div
			css={`
				text-align: center;
			`}
		>
			<Logo showText size={largeScreen ? 'large' : 'medium'} />
			<h1>{t("Une erreur s'est produite")}</h1>
			<p
				css={`
					margin-bottom: 2rem;
				`}
			>
				{t(
					'Notre équipe a été notifiée, nous allons résoudre le problème au plus vite.'
				)}
			</p>
			<button
				className="ui__ button plain"
				onClick={() => {
					window.location.reload()
				}}
			>
				{t('Recharger la page')}
			</button>
		</div>
	)
}
