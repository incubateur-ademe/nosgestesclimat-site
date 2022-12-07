import { motion } from 'framer-motion'
import Inhabitants from './Inhabitants'
import RavijenChart from './RavijenChart'

export const activatedSpecializedVisualisations = [
	'services sociétaux . question rhétorique',
]
export default ({ currentQuestion, categoryColor, value }) => {
	if (currentQuestion === 'services sociétaux . question rhétorique')
		return (
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				css={`
					width: 100%;
					min-width: 40rem;
					height: 100%;
				`}
			>
				<RavijenChart
					noLinks
					target="services sociétaux"
					numberBottomRight
					verticalReverse={true}
				/>
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
