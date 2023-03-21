import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'

export default () => {
	const enquête = useSelector((state) => state.enquête)

	if (!enquête) return
	return (
		<Suspense fallback={<div>Chargement de la bannière d'enquête</div>}>
			<LazyBanner />
		</Suspense>
	)
}

const LazyBanner = React.lazy(() => import('./Banner'))
