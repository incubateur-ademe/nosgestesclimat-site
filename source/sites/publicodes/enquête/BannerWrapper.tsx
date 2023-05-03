import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { enquêteSelector } from './enquêteSelector'

export default () => {
	const enquête = useSelector(enquêteSelector)

	if (!enquête) return
	return (
		<Suspense fallback={<div>Chargement de la bannière d'enquête</div>}>
			<LazyBanner />
		</Suspense>
	)
}

const LazyBanner = React.lazy(() => import('./Banner'))
