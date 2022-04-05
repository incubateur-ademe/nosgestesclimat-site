import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'
import { useSimulationProgress } from './utils/useNextQuestion'

export default ({}) => {
	const progress = 0.3 || useSimulationProgress()
	const motionProgress = useMotionValue(0)

	const pathLength = useSpring(motionProgress, { stiffness: 400, damping: 90 })

	useEffect(() => {
		motionProgress.set(progress)
	}, [progress])

	return (
		<svg
			className="progress-icon"
			viewBox="0 0 50 50"
			css={`
				width: 2rem;
			`}
		>
			<path
				fill="none"
				strokeWidth="5"
				stroke="var(--lighterColor)"
				stroke-dasharray="0.3px 1px"
				d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
				pathLength="1"
				stroke-dashoffset="0px"
				data-projection-id="1"
				css="transform: translateX(5px) translateY(5px) scaleX(-1) rotate(90deg); transform-origin: 20px 20px 0px;"
				transform-origin="20px 20px"
			></path>
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
				fill="var(--color)"
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
}
