import { Helmet } from 'react-helmet'

export default function AutoCanonicalTag({
	overrideHref,
}: {
	overrideHref?: string
}) {
	return (
		<Helmet>
			<link
				rel="canonical"
				href={
					overrideHref ?? `${window.location.origin}${window.location.pathname}`
				}
			/>
		</Helmet>
	)
}
