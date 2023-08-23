import { SetRatingAction, setRatings } from '@/actions/actions'
import { AppState } from '@/reducers/rootReducer'
import { useTestCompleted } from '@/selectors/simulationSelectors'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Northstar from './Northstar'

export default ({
	type,
}: {
	type: SetRatingAction['type']
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
		actionChoicesLength > 1

	const displayLearnedRating =
		type === 'SET_RATING_LEARNED' &&
		hasRatedLearning?.toString().includes('display')

	const closeFeedback = () => {
		setTimeout(() => {
			dispatch(setRatings(type, 'refuse'))
		}, 1000)
	}

	const [animationComplete, setAnimationComplete] = useState(false)

	const shouldDisplayNorthstarBanner =
		testCompleted &&
		(displayActionRating || displayLearnedRating) &&
		process.env.NODE_ENV === 'production'

	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		if (shouldDisplayNorthstarBanner && !animationComplete) {
			timeoutRef.current = setTimeout(() => {
				document.getElementById('northstarBanner')?.scrollIntoView({
					behavior: 'smooth',
				})
			}, 2000)
		}
	}, [shouldDisplayNorthstarBanner, animationComplete])

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	if (!shouldDisplayNorthstarBanner) {
		return null
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 100, scale: 0, display: 'none' }}
			animate={{ opacity: 1, y: 0, scale: 1, display: 'block' }}
			exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.8 } }}
			transition={{ delay: displayLearnedRating ? 8 : 1, duration: 0.8 }}
			onAnimationComplete={() => {
				setAnimationComplete(true)
			}}
			id="northstarBanner"
			className="w-auto bg-green-50 rounded-lg h-auto relative m-0 sm:m-2 shadow-md"
		>
			<button
				className="absolute top-0 right-0 text-lg bold w-10 h-10 text-center"
				onClick={closeFeedback}
				aria-label={t('Fermer le bandeau de feedback')}
			>
				&#215;
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
							<Trans i18nKey={'publicodes.northstar.title'}>
								<b>Petite question entre nous...</b>
							</Trans>
							<br />
							<Trans i18nKey={'publicodes.northstar.action'}>
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
							<Trans i18nKey={'publicodes.northstar.title'}>
								<b>Petite question entre nous...</b>
							</Trans>
							<br />
							<Trans i18nKey={'publicodes.northstar.learned'}>
								Nos Gestes Climat vous a-t-il appris quelque chose ?
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
