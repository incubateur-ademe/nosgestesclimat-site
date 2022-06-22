import { motion } from 'framer-motion'
import Inhabitants from './Inhabitants'

export default ({ currentQuestion, categoryColor, value }) => {
	if (currentQuestion === 'logement . habitants')
		return (
			<motion.div
				css={`
					svg {
						width: 100%;
						height: 100%;
					}
				`}
			>
				<Inhabitants
					{...{
						activeColor: 'var(--color)',
						backgroundColor: categoryColor || 'var(--darkerColor)',
						value: 1 / value,
					}}
				/>
			</motion.div>
		)
	return null
}
