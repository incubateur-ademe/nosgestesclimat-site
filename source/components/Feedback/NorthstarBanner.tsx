import { motion } from 'framer-motion'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { setRatings } from '../../actions/actions'
import { RootState } from '../../reducers/rootReducer'
import { useTestCompleted } from '../../selectors/simulationSelectors'
import Northstar from './Northstar'

export default ({
	type,
}: {
	type: 'SET_RATING_LEARNED' | 'SET_RATING_ACTION'
}) => {
	const dispatch = useDispatch()
	const testCompleted = useSelector(useTestCompleted)
	const hasRatedAction = useSelector((state: RootState) => state.ratings.action)
	const hasRatedLearning = useSelector(
		(state: RootState) => state.ratings.learned
	)
	const actionChoicesLength = Object.entries(
		useSelector((state: RootState) => state.actionChoices)
	).filter(([key, value]) => value).length

	const displayActionRating =
		type === 'SET_RATING_ACTION' &&
		hasRatedAction == null &&
		actionChoicesLength > 2
	const displayLearnedRating =
		type === 'SET_RATING_LEARNED' && hasRatedLearning == null

	const closeFeedback = () => {
		setTimeout(() => {
			dispatch(setRatings(type, 0))
		}, 1000)
	}

	if (!testCompleted || (!displayActionRating && !displayLearnedRating)) return

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ delay: 0.4 }}
			css={`
				width: auto;
				background: #fff;
				border-radius: 5px;
				height: auto;
				position: relative;
				margin: 0 10px;
				box-shadow: rgb(187, 187, 187) 2px 2px 10px;
			`}
		>
			<button
				css={`
					position: absolute;
					top: 10px;
					right: 10px;
					padding: 0;
					img {
						width: 1.2rem;
					}
				`}
				onClick={closeFeedback}
			>
				<img src={`/images/274C.svg`} />
			</button>
			<div
				css={`
					display: flex;
					align-items: center;
					justify-content: center;
				`}
			>
				<div
					css={`
						padding: 20px;
						max-width: 420px;
						margin: auto;
					`}
				>
					{displayActionRating && (
						<div>
							<Trans i18nKey={`publicodes.northstar.title`}>
								<b>Petite question entre nous...</b>
							</Trans>
							<br />
							<Trans i18nKey={`publicodes.northstar.action`}>
								Nos Gestes Climat vous donne envie d'agir pour réduire votre
								empreinte carbone ?
							</Trans>
							<Northstar type="SET_RATING_ACTION"></Northstar>
						</div>
					)}
					{displayLearnedRating && (
						<div>
							<Trans i18nKey={`publicodes.northstar.title`}>
								<b>Petite question entre nous...</b>
							</Trans>
							<br />
							<Trans i18nKey={`publicodes.northstar.learned`}>
								Nos Gestes Climat vous a appris quelque chose ?
							</Trans>
							<Northstar type="SET_RATING_LEARNED"></Northstar>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	)
}
