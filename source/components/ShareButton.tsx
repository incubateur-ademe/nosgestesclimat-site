import React, { useContext, useRef, useState } from 'react'
import styled from 'styled-components'
import emoji from './emoji'
import ShareButtonIcon from './ShareButtonIcon'
import { TrackerContext } from './utils/withTracker'
const eventData = ['trackEvent', 'partage', 'Partage page fin']

export default ({ text, url, title, color, label, score }) => {
	const tracker = useContext(TrackerContext)
	return navigator.share ? (
		<Button
			color={color}
			title="Cliquez pour partager le lien"
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

	const clipboardText = `${text}

${decodeURIComponent(url)}`

	return (
		<Button
			title="Cliquez pour partager le lien"
			color={color}
			onClick={() => {
				trackEvent()
				copyToClipboardAsync(clipboardText).then(
					function () {
						/* clipboard successfully set */
						setCopySuccess(true)
					},
					function () {
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
					'Copier le lien'
				)
			) : (
				<span>Lien copié {emoji('✅')}</span>
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
