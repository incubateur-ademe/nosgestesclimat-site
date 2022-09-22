/*
	This module is used to extend the react-router-dom lib by overriding
	the Link component to keep the current search parameters when navigating.
*/
import { Link as LinkReact, useLocation } from 'react-router-dom'

export const Link = ({ to, children, ...props }) => {
	const { search } = useLocation()
	return (
		<LinkReact to={{ pathname: to, search }} {...props}>
			{children}
		</LinkReact>
	)
}
