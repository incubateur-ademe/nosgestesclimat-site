import { useSimulationProgress } from './utils/useNextQuestion'

export default ({}) => {
	const progress = useSimulationProgress()
	const motionProgress = useMotionValue(0)
	const pathLength = useSpring(motionProgress, { stiffness: 400, damping: 90 })

	useEffect(() => {
		motionProgress.set(progress)
	}, [progress])

	return (
		<svg
			className="progress-icon"
			viewBox="0 0 60 60"
			css="width: 3rem; position: absolute; right: 0; top: .4rem"
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
