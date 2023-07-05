import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {
	getMatomoEventShareDesktop,
	getMatomoEventShareMobile,
} from '../analytics/matomo-events'
import { useMatomo } from '../contexts/MatomoContext'
import ShareButtonIcon from './ShareButtonIcon'
const eventData = ['trackEvent', 'partage', 'Partage page fin']

export default ({
	text,
	url,
	title,
	color,
	label,
	score,
}: {
	text: string
	url: string
	title: string
	color: string
	label: string
	score: number
}) => {
	const { trackEvent } = useMatomo()
	const { t } = useTranslation()

	return navigator.share ? (
		<Button
			color={color}
			title={t('Cliquez pour partager le lien')}
			onClick={() => {
				trackEvent(getMatomoEventShareMobile(score))
				navigator
					.share({ text, url, title, color, label })
					.then(() => console.log('Successful share'))
					.catch((error) => console.log('Error sharing', error))
			}}
		>
			<ShareButtonIcon />
			{label && <span>{label}</span>}
			{/* Created by Barracuda from the Noun Project */}
		</Button>
	) : (
		<DesktopShareButton
			{...{
				label,
				color,
				text,
				url,
				trackEventDesktop: () => trackEvent(getMatomoEventShareDesktop(score)),
			}}
		/>
	)
}

const copyToClipboardAsync = (str) => {
	if (navigator && navigator.clipboard && navigator.clipboard.writeText)
		return navigator.clipboard.writeText(str)
	return Promise.reject('The Clipboard API is not available.')
}

export const DesktopShareButton = ({
	label,
	text,
	color,
	url,
	trackEventDesktop,
}: {
	label: string
	text: string
	color: string
	url: string
	trackEventDesktop: () => void
}) => {
	const [copySuccess, setCopySuccess] = useState(false)
	const { t } = useTranslation()

	const clipboardText = `${text}

${decodeURIComponent(url)}`

	return (
		<Button
			title={t('Cliquez pour partager le lien')}
			color={color}
			onClick={() => {
				trackEventDesktop()
				copyToClipboardAsync(clipboardText).then(
					() => {
						/* clipboard successfully set */
						setCopySuccess(true)
					},
					() => {
						/* clipboard write failed */
						setCopySuccess(false)
					}
				)
			}}
			css={`
				padding-left: 0 !important;
				padding-right: 0 !important;
			`}
		>
			<ShareButtonIcon />
			{!copySuccess ? (
				label ? (
					<span>{label}</span>
				) : (
					t('Copier le lien')
				)
			) : (
				<span>{t('Copié ✅')}</span>
			)}
			{/* Created by Barracuda from the Noun Project */}
		</Button>
	)
}

const Button = styled.button`
	margin: 0 auto;
	display: flex;
	align-items: center;
	font-size: 1rem;
	${(props) => `color: ${props.color}`}
`
