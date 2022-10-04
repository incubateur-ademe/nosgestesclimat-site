import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { WithEngine } from '../RulesProvider'
import { configSelector } from '../selectors/simulationSelectors'
import { useSimulationProgress } from './utils/useNextQuestion'

export default () => {
	return (
		<WithEngine fallback={<CircleSVG />}>
			<Circle />
		</WithEngine>
	)
}
const Circle = ({}) => {
	const config = useSelector(configSelector)
	const progress = useSimulationProgress()
	const realProgress = config.objectifs ? progress : 0
	const motionProgress = useMotionValue(0)

	const pathLength = useSpring(motionProgress, { stiffness: 400, damping: 90 })

	useEffect(() => {
		motionProgress.set(realProgress)
	}, [realProgress])

	return <CircleSVG {...{ pathLength, realProgress }} />
}

export const CircleSVG = ({ progress = 0, pathLength = 0, white = false }) => (
	<svg
		aria-label="Avancement du test"
		role="progressbar"
		aria-valuenow={Math.round(progress * 100)}
		className="progress-icon"
		viewBox="0 0 50 50"
		css={`
			width: 2rem;
		`}
	>
		<motion.path
			fill="none"
			strokeWidth="5"
			stroke="var(--color)"
			strokeDasharray="0 1"
			d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
			style={{
				pathLength,
				rotate: 90,
				translateX: 5,
				translateY: 5,
				scaleX: -1, // Reverse direction of line animation
			}}
		/>
		<motion.path
			fill={white ? 'white' : 'var(--color)'}
			d="M15 15 L40 30 L15 40 L15 15"
			strokeDasharray="0 1"
			transform="translate(-0 -3)"
			animate={{ display: progress === 1 ? 'none' : 'block' }}
		/>
		<motion.path
			fill="none"
			strokeWidth="5"
			stroke="var(--color)"
			d="M14,26 L 22,33 L 35,16"
			initial={false}
			strokeDasharray="0 1"
			animate={{ pathLength: progress === 1 ? 1 : 0 }}
		/>
	</svg>
)
