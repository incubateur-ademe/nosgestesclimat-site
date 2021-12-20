import { motion } from 'framer-motion'

export default function KmHelpButton({ text, setIsOpen }) {
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
						rotate: [0, 15, -15, 0],
						y: [0, 0, 0, -3, 4, 0],
					}}
					transition={{
						duration: 1.5,
						delay: 1,
						repeat: Infinity,
						repeatDelay: 2,
					}}
				>
					✏️
				</motion.div>
				{text}
			</div>
		</button>
	)
}
