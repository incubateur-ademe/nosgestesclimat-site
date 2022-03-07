import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'

const SurveyBar = React.lazy(() => import('./SurveyBar'))

export default () => {
	const survey = useSelector((state) => state.survey)
	if (!survey) return null

	return (
		<Suspense fallback="Chargement">
			<SurveyBar />
		</Suspense>
	)
}
