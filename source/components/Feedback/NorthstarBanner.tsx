import { setRatings } from '@/actions/actions'
import { AppState } from '@/reducers/rootReducer'
import { useTestCompleted } from '@/selectors/simulationSelectors'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Northstar from './Northstar'

export default ({
	type,
}: {
	type: 'SET_RATING_LEARNED' | 'SET_RATING_ACTION'
}): JSX.Element | null => {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const testCompleted = useTestCompleted()
	const hasRatedAction = useSelector((state: AppState) => state.ratings.action)
	const hasRatedLearning = useSelector(
		(state: AppState) => state.ratings.learned
	)
	const actionChoices = useSelector((state: AppState) => state.actionChoices)

	const actionChoicesLength = Object.entries(actionChoices).filter(
		([_, value]) => value
	).length

	const displayActionRating =
		type === 'SET_RATING_ACTION' &&
		hasRatedAction?.toString().includes('display') &&
		actionChoicesLength > 2
	const displayLearnedRating =
		type === 'SET_RATING_LEARNED' &&
		hasRatedLearning?.toString().includes('display')

	const closeFeedback = () => {
		setTimeout(() => {
			dispatch(setRatings(type, 'refuse'))
		}, 1000)
	}

	const [animationComplete, setAnimationComplete] = useState(false)

	if (
		!testCompleted ||
		(!displayActionRating && !displayLearnedRating) ||
		// Display only the Northstar banner in production mode
		NODE_ENV === 'development' ||
		CONTEXT === 'deploy-preview'
	) {
		return null
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 100, scale: 0, display: 'none' }}
			animate={{ opacity: 1, y: 0, scale: 1, display: 'block' }}
			exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.8 } }}
			transition={{ delay: 10, duration: 0.8 }}
			onAnimationComplete={() => {
				setAnimationComplete(true)
			}}
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
							<Northstar
								type="SET_RATING_ACTION"
								animationComplete={animationComplete}
								text={t('publicodes.northstar.action')}
							/>
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
							<Northstar
								type="SET_RATING_LEARNED"
								animationComplete={animationComplete}
								text={t('publicodes.northstar.learned')}
							/>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	)
}
