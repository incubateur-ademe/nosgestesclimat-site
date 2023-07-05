import { getMatomoEventParcoursTestCategoryStarted } from '@/analytics/matomo-events'
import { useMatomo } from '@/contexts/MatomoContext'
import useKeypress from '@/hooks/useKeyPress'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Trans } from 'react-i18next'
import SafeCategoryImage from '../SafeCategoryImage'

// Naive implementation - in reality would want to attach
// a window or resize listener. Also use state/layoutEffect instead of ref/effect
// if this is important to know on initial client render.
// It would be safer to  return null for unmeasured states.
export const useDimensions = (ref) => {
	const dimensions = useRef({ width: 0, height: 0 })

	useEffect(() => {
		dimensions.current.width = ref.current.offsetWidth
		dimensions.current.height = ref.current.offsetHeight
	}, [])

	return dimensions.current
}

const sidebar = {
	open: (width = 1000) => ({
		clipPath: `circle(${width * 2}px at 400px 40px)`,
		transition: {
			type: 'spring',
			stiffness: 20,
			restDelta: 2,
		},
	}),
	closed: (width = 1000) => ({
		clipPath: `circle(30px at ${width / 3}px 40px)`,
		transition: {
			delay: 0.5,
			type: 'spring',
			stiffness: 400,
			damping: 40,
		},
	}),
}

export default ({ dismiss, questionCategory }) => {
	const containerRef = useRef(null)
	const { width } = useDimensions(containerRef)

	const { trackEvent } = useMatomo()

	useKeypress('Enter', false, dismiss, 'keyup', [])

	return (
		<motion.section
			initial={'closed'}
			animate={'open'}
			custom={width}
			ref={containerRef}
			css={`
				text-align: center;
				padding: 1rem;
				h2 {
					color: white;
					margin: 0.4rem;
					text-transform: uppercase;
					font-weight: 300;
				}
				img {
					width: 5rem;
					margin: 0.4rem;
				}
				button {
					display: block !important;
					margin: 1rem auto;
				}
				position: relative;
				.background {
					position: absolute;
					top: 0;
					left: 0;
					bottom: 0;
					width: 100%;
					background: ${questionCategory.color};
					z-index: 1;
				}
			`}
		>
			<motion.div className="background" variants={sidebar} />
			<motion.div
				css="z-index: 2; position: relative"
				variants={{
					open: {
						opacity: 1,
						transition: {
							delay: 0.2,
						},
					},
					closed: {
						opacity: 0,
					},
				}}
			>
				<h2 data-cypress-id={`category-title-${questionCategory.dottedName}`}>
					{questionCategory.title}
				</h2>
				<SafeCategoryImage element={questionCategory} />
				<button
					className="ui__ plain button attention"
					data-cypress-id="start-button"
					onClick={(e) => {
						// We track the start of a new category
						// Can get called only once for each category
						trackEvent(
							getMatomoEventParcoursTestCategoryStarted(questionCategory?.title)
						)
						dismiss(e)
					}}
				>
					<Trans>Commencer</Trans>
				</button>
			</motion.div>
		</motion.section>
	)
}
