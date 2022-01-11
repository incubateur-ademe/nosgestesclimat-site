import { motion } from 'framer-motion'
import LogoMIT from '../../../images/LogoMIT'

export default function KmHelpButton({ text, setIsOpen, openmojiURL }) {
	return (
		<button
			className="ui__ plain small button"
			css="margin-bottom: 0.5rem"
			onClick={() => setIsOpen(true)}
		>
			<div
				css={`
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100%;
				`}
			>
				<LogoMIT />
				{text}
			</div>
		</button>
	)
}
