import { ReactNode } from 'react'
import { Helmet } from 'react-helmet'
import { useLocation } from 'react-router-dom'

type PropType = {
	title: string
	description: string
	image?: string
	url?: string
	more?: ReactNode | null
}

const websiteURL = 'https://nosgestesclimat.fr'

export default function Meta({
	title,
	description,
	image,
	url,
	children,
}: PropType) {
	const { pathname } = useLocation()
	console.log('OIZNAOINZDOINZAdesc', title, description, image, url, pathname)
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
			<link
				rel="alternate"
				hrefLang="en"
				href={websiteURL + pathname + '?lang=en'}
			/>
			<link
				rel="alternate"
				hrefLang="fr"
				href={websiteURL + pathname + '?lang=fr'}
			/>
			<link rel="alternate" hrefLang="x-default" href={websiteURL + pathname} />
		</Helmet>
	)
}
