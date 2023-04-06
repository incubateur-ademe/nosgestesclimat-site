import { useState } from 'react'
import emoji from '../../emoji'

export default function KmHelpButton({ text, onHandleClick }) {
	const [hover, setHover] = useState(false)
	return (
		<button
			className="ui__ small button"
			css="margin-bottom: 0.5rem"
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
				{emoji('✋')}
				{text}
			</div>
		</button>
	)
}
