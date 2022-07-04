import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'

const ConferenceBar = React.lazy(() => import('./ConferenceBar'))

export default () => {
	const conference = useSelector((state) => state.conference)
	if (!conference) return null

	return (
		<Suspense fallback={<div>Chargement</div>}>
			<ConferenceBar />
		</Suspense>
	)
}
