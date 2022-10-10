import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { WithEngine } from '../../../RulesProvider'

const ConferenceBar = React.lazy(() => import('./ConferenceBar'))

export default () => {
	const conference = useSelector((state) => state.conference)
	if (!conference) return null

	return (
		<Suspense fallback={<div>Chargement</div>}>
			<WithEngine>
				<ConferenceBar />
			</WithEngine>
		</Suspense>
	)
}
