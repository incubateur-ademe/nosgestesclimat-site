import { motion } from 'framer-motion'
import LogoMIT from '../../../images/LogoMIT'
import { useState } from 'react'

export default function KmHelpButton({ text, openmojiURL, onHandleClick }) {
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
				<LogoMIT hover={hover} />
				{text}
			</div>
		</button>
	)
}
