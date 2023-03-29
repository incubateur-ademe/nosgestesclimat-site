import emoji from 'Components/emoji'
import { useState } from 'react'
import styled from 'styled-components'

export default function KmHelpButton({ text, onHandleClick }) {
	const [hover, setHover] = useState(false)
	return (
		<StyledButton
			className="ui__ small"
			onClick={onHandleClick}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			<div
				css={`
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100%;
				`}
			>
				<span
					css={`
						margin-right: 0.25rem;
					`}
				>
					{emoji('⬇️')}
				</span>
				{text}
			</div>
		</StyledButton>
	)
}

const StyledButton = styled.button`
	font-size: 1rem;
	background-color: rgb(253 230 138);
	padding: 0.5rem;
	border-radius: 0.25rem;
	margin-bottom: 1rem;
	line-height: 1;
`
