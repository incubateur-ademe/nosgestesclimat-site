import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import styled from 'styled-components'

const variants = {
	enter: (direction: number) => {
		return {
			x: direction > 0 ? 1000 : -1000,
			opacity: 0,
			position: 'absolute',
		}
	},
	center: {
		zIndex: 1,
		x: 0,
		opacity: 1,
		position: 'relative',
	},
	exit: (direction: number) => {
		return {
			x: direction < 0 ? 1000 : -1000,
			opacity: 0,
			position: 'absolute',
			visibility: 'hidden',
		}
	},
}

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
	return Math.abs(offset) * velocity
}

export default ({ children, next, previous }) => {
	const [[page, direction], setPage] = useState([0, 0])

	const paginate = (newDirection: number) => {
		newDirection < 0 ? previous() : next()
		setPage([page + newDirection, newDirection])
	}

	return (
		<>
			<AnimatePresence initial={false} custom={direction}>
				<motion.div
					className="slides"
					css={`
						width: 35rem;
						max-width: 100%;
						top: 0.4rem;
						@media (min-height: 800px) {
							top: 1.7rem;
						}
					`}
					key={page}
					custom={direction}
					variants={variants}
					initial="enter"
					animate="center"
					exit="exit"
					transition={{
						x: { type: 'spring', stiffness: 300, damping: 30 },
						opacity: { duration: 0.2 },
					}}
					drag="x"
					dragConstraints={{ left: 0, right: 0 }}
					dragElastic={1}
					onDragEnd={(e, { offset, velocity }) => {
						const swipe = swipePower(offset.x, velocity.x)

						if (swipe < -swipeConfidenceThreshold) {
							paginate(1)
						} else if (swipe > swipeConfidenceThreshold) {
							paginate(-1)
						}
					}}
				>
					{children}
				</motion.div>
			</AnimatePresence>
			<NextButton onClick={() => paginate(1)} attention={page === 0}>
				{'‣'}
			</NextButton>
			<NextButton reverse onClick={() => paginate(-1)}>
				{'‣'}
			</NextButton>
		</>
	)
}

const NextButton = styled.button`
	opacity: 0.75;
	top: calc(50% - 20px);
	position: absolute;
	background: white;
	border: 1px solid var(--darkColor);
	color: var(--darkColor);
	border-radius: 30px;
	width: 40px;
	height: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
	user-select: none;
	cursor: pointer;
	font-weight: bold;
	font-size: 18px;
	z-index: 2;
	right: 10px;

	${(props) =>
		props.reverse &&
		`
    left: 10px;
    transform: scale(-1);
	`}
	${(props) =>
		props.attention &&
		`

animation-name: light, strong;
animation-duration: 1s;
animation-delay: 8s, 14s;
animation-timing-function: ease-in-out;
animation-iteration-count: 6, infinite;
animation-direction: alternate;

@keyframes light{
		0% {
			transform: scale(1);
			opacity: 0.6;
		}
		100% {
			transform: scale(1.2);
			opacity: 1
		}
	}
	@keyframes strong {
		0% {
			transform: scale(1);
			opacity: 0.6;
			background: white;
			color: var(--color)
		}
		100% {
			transform: scale(1.2);
			opacity: 1
			; background: var(--color); color: white
		}
	}
	`}
`
