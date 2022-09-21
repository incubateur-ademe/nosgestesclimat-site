/*
	This module is used to extend the react-router-dom lib by overriding
	the Link component to keep the current search parameters when navigating.
*/
import { Link, useLocation } from 'react-router-dom'

export const LinkWithQuery = ({ to, children, ...props }) => {
	const { search } = useLocation()
	return (
		<Link to={{ pathname: to, search }} {...props}>
			{children}
		</Link>
	)
}
