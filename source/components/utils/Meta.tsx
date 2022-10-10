import { ReactNode } from 'react'
import { Helmet } from 'react-helmet'
import { useLocation } from 'react-router'

type PropType = {
	title: string
	description: string
	image?: string
	url?: string
	more?: ReactNode | null
}

export default function Meta({
	title,
	description,
	image,
	url,
	children,
}: PropType) {
	const { pathname } = useLocation()
	return (
		<Helmet>
			<title>{title} - Nos Gestes Climat</title>
			<meta name="description" content={description} />
			<meta property="og:type" content="website" />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="twitter:card" content="summary_large_image" />
			{/* Attention : og:image does not accept SVG; It must be an absolute URL (https://xxx.png/jpg);  */}
			{image && <meta property="og:image" content={image} />}
			{url && <meta property="og:url" content={url} />}
			{children}
		</Helmet>
	)
}
