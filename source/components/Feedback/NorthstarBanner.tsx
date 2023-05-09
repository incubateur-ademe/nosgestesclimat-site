import { motion } from 'framer-motion'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useMediaQuery } from 'usehooks-ts'
import { RootState } from '../../reducers/rootReducer'
import { useTestCompleted } from '../../selectors/simulationSelectors'
import { ScrollToTop } from '../utils/Scroll'
import Northstar from './Northstar'

export default () => {
	const uglyBannerContentColor = '#ffffbf'

	const thinScreen = useMediaQuery('(max-width: 400px)')

	const testCompleted = useTestCompleted()
	const shouldDisplayTimeMessage = testCompleted //&& timeMessage

	const height = thinScreen ? 100 : 56
	const animationVariants = {
		mini: { height: '2rem' },
		large: { height: height + 'vh' },
	}

	const hasRatedAction = useSelector((state: RootState) => state.ratings.action)
	const hasRatedLearning = useSelector(
		(state: RootState) => state.ratings.learned
	)
	const actionChoicesLength = Object.entries(
		useSelector((state: RootState) => state.actionChoices)
	).filter(([key, value]) => value).length

	const displayActionRating = !hasRatedAction && actionChoicesLength > 2
	const displayLearnedRating = !hasRatedLearning

	return (
		<motion.div
			animate={shouldDisplayTimeMessage ? 'large' : 'mini'}
			variants={animationVariants}
			transition={{ delay: 0, duration: 1 }}
			css={`
				width: 100vw;
				height: 2rem;
				text-align: center;
				z-index: 1;
			`}
		>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ delay: 0.4 }}
				css={`
					background: ${uglyBannerContentColor}; /*J'étais pas très inspiré là */
					height: ${height - 1}vh;
					@media (max-width: 380) {
						height: 100vh;
					}
					display: flex;
					align-items: center;
					justify-content: center;
				`}
			>
				<ScrollToTop />
				<div
					css={`
						padding: 20px;
						max-width: 420px;
						margin: auto;
					`}
				>
					{displayActionRating && (
						<div>
							<Trans i18nKey={`publicodes.northstar.action`}>
								Dans quelle mesure Nos Gestes Climat vous donne envie d'agir
								pour réduire votre empreinte carbone ?
							</Trans>
							<Northstar type="SET_RATING_ACTION"></Northstar>
						</div>
					)}
					{displayLearnedRating && (
						<div>
							<Trans i18nKey={`publicodes.northstar.learned`}>
								Dans quelle mesure Nos Gestes Climat vous a appris quelque chose
								?
							</Trans>
							<Northstar type="SET_RATING_LEARNED"></Northstar>
						</div>
					)}
				</div>
			</motion.div>
		</motion.div>
	)
}
