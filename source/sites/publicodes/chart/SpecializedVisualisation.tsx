import { motion } from 'framer-motion'
import Inhabitants from './Inhabitants'
import RavijenChart from './RavijenChart'

export const activatedSpecializedVisualisations = [
	'services publics . question rhétorique',
]
export default ({ currentQuestion, categoryColor, value }) => {
	if (currentQuestion === 'services publics . question rhétorique')
		return (
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				css={`
					height: 100%;
				`}
			>
				<RavijenChart target="services publics" />
			</motion.div>
		)

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
