import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers/rootReducer'

export default () => {
	const hasRatedAction = useSelector((state: RootState) => state.ratings.action)
	const hasRatedLearning = useSelector(
		(state: RootState) => state.ratings.learned
	)
	const actionChoicesLength = Object.entries(
		useSelector((state: RootState) => state.actionChoices)
	).filter(([key, value]) => value).length
	const displayActionRating = !hasRatedAction && actionChoicesLength > 2
	const displayLearnedRating = !hasRatedLearning

	if (displayActionRating || displayLearnedRating)
		return (
			<Suspense fallback={<div>Chargement de la bannière d'enquête</div>}>
				<LazyBanner />
			</Suspense>
		)

	return
}

const LazyBanner = React.lazy(() => import('./NorthstarBanner'))
