import React, { Suspense } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { WithEngine } from '../../../RulesProvider'

const ConferenceBar = React.lazy(() => import('./ConferenceBar'))

export default () => {
	const conference = useSelector((state) => state.conference)
	if (!conference) {
		return null
	}

	return (
		<Suspense
			fallback={
				<div>
					<Trans>Chargement</Trans>
				</div>
			}
		>
			<WithEngine>
				<ConferenceBar />
			</WithEngine>
		</Suspense>
	)
}
