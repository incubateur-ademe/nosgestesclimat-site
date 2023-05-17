import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { enquêteSelector } from './enquêteSelector'

const LazyBanner = React.lazy(
	() => import(/* webpackChunkName: 'Banner' */ './Banner')
)

export default () => {
	const enquête = useSelector(enquêteSelector)

	if (!enquête) return null

	return (
		<Suspense fallback={<div>Chargement de la bannière d'enquête</div>}>
			<LazyBanner />
		</Suspense>
	)
}
