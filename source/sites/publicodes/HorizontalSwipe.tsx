import * as React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { wrap } from 'popmotion'
import styled from 'styled-components'

const variants = {
	enter: (direction: number) => {
		return {
			x: direction > 0 ? 1000 : -1000,
			opacity: 0,
		}
	},
	center: {
		zIndex: 1,
		x: 0,
		opacity: 1,
	},
	exit: (direction: number) => {
		return {
			zIndex: 0,
			x: direction < 0 ? 1000 : -1000,
			opacity: 0,
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
						position: absolute;
						width: 35rem;
						max-width: 100%;
						top: 2rem;
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
			<NextButton onClick={() => paginate(1)}>{'‣'}</NextButton>
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
`
