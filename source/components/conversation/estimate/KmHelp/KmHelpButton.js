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
				{text}
			</div>
		</StyledButton>
	)
}

const StyledButton = styled.button`
	font-size: 0.875rem;
	background-color: rgb(253 230 138);
	padding: 0.5rem;
	border-radius: 0.25rem;
	margin-bottom: 0.5rem;
	line-height: 1;
	transition: background-color 0.2s;
	background-size: 280%;
	&:hover {
		background-color: #fcdb54;
		background-position-x: 0%;
		border-color: white !important;
		background-image: linear-gradient(
			50deg,
			var(--darkestColor) -50%,
			#fcdb54 10%
		);
	}
`
