import { motion } from 'framer-motion'
import Inhabitants from './Inhabitants'

export default ({ currentQuestion, categoryColor, value }) => {
	// Not ready yet. Animation should start from the bottom
	// Should be iterated
	if (false && currentQuestion === 'logement . habitants')
		return (
			<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
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
