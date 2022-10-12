/*
	This module is used to extend the react-router-dom lib by overriding
	the Link component to keep the current search parameters when navigating.
*/
import { Link as LinkReact, useSearchParams } from 'react-router-dom'

const persistentSearchParams = ['lang']

export const Link = ({ to, children, ...props }) => {
	const [searchParams] = useSearchParams()

	for (let key of searchParams.keys()) {
		if (!persistentSearchParams.includes(key)) {
			searchParams.delete(key)
		}
	}

	return (
		<LinkReact
			to={{ pathname: to, search: searchParams.toString() }}
			{...props}
		>
			{children}
		</LinkReact>
	)
}
