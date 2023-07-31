import { Helmet } from 'react-helmet'

export default function AutoCanonicalTag() {
	return (
		<Helmet>
			<link
				rel="canonical"
				href={`${window.location.origin}${window.location.pathname}`}
			/>
		</Helmet>
	)
}
