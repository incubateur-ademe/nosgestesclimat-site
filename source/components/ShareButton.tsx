import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import emoji from './emoji'
import ShareButtonIcon from './ShareButtonIcon'

export default ({ text, url, title, color, label }) =>
	navigator.share ? (
		<Button
			title="Cliquez pour partager le lien"
			onClick={() =>
				navigator
					.share({ text, url, title, color, label })
					.then(() => console.log('Successful share'))
					.catch((error) => console.log('Error sharing', error))
			}
		>
			<ShareButtonIcon />
			{label && <span>{label}</span>}
			{/* Created by Barracuda from the Noun Project */}
		</Button>
	) : (
		<DesktopShareButton {...{ label, color, text, url }} />
	)

const copyToClipboardAsync = (str) => {
	if (navigator && navigator.clipboard && navigator.clipboard.writeText)
		return navigator.clipboard.writeText(str)
	return Promise.reject('The Clipboard API is not available.')
}

export const DesktopShareButton = ({ label, text, color, url }) => {
	const [copySuccess, setCopySuccess] = useState(false)

	const clipboardText = `${text}

${decodeURIComponent(url)}`

	return (
		<Button
			title="Cliquez pour partager le lien"
			css={`
				color: ${color};
			`}
			onClick={() => {
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
`
