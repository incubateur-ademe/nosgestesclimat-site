import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { TrackerContext } from '../contexts/TrackerContext'
import ShareButtonIcon from './ShareButtonIcon'
const eventData = ['trackEvent', 'partage', 'Partage page fin']

export default ({ text, url, title, color, label, score }) => {
	const tracker = useContext(TrackerContext)
	const { t } = useTranslation()

	return navigator.share ? (
		<Button
			color={color}
			title={t('Cliquez pour partager le lien')}
			onClick={() => {
				tracker.push([...eventData, 'mobile', score])
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
				trackEvent: () => tracker.push([...eventData, 'bureau', score]),
			}}
		/>
	)
}

const copyToClipboardAsync = (str) => {
	if (navigator && navigator.clipboard && navigator.clipboard.writeText)
		return navigator.clipboard.writeText(str)
	return Promise.reject('The Clipboard API is not available.')
}

export const DesktopShareButton = ({ label, text, color, url, trackEvent }) => {
	const [copySuccess, setCopySuccess] = useState(false)
	const { t } = useTranslation()

	const clipboardText = `${text}

${decodeURIComponent(url)}`

	return (
		<Button
			title={t('Cliquez pour partager le lien')}
			color={color}
			onClick={() => {
				trackEvent()
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
	font-size: 100%;
	${(props) => `color: ${props.color}`}
`
