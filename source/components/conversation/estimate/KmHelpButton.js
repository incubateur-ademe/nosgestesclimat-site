import { motion } from 'framer-motion'

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
				<motion.div
					animate={{
						rotate: [0, 360, 0, 0],
					}}
					transition={{
						duration: 4,
						delay: 1,
						repeat: Infinity,
						repeatDelay: 2,
					}}
				>
					<img src={openmojiURL('aide')} css="display: block; width: 2rem" />
				</motion.div>
				{text}
			</div>
		</button>
	)
}
