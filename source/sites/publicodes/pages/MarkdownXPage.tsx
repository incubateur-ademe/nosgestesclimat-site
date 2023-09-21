import type { MDXContent } from 'mdx/types'
import { useTranslation } from 'react-i18next'

import Meta from '@/components/utils/Meta'
import { ScrollToTop } from '@/components/utils/Scroll'
import { getMarkdownXInCurrentLang, Lang } from '@/locales/translation'

export type PageProps = {
	markdownFiles: Array<[Lang, MDXContent]>
	// Information about the page metadata
	title?: string
	description?: string
	image?: string
}

export default ({ markdownFiles, title, description, image }: PageProps) => {
	const { i18n } = useTranslation()
	const lang: Lang = i18n.language as Lang

	const Content = getMarkdownXInCurrentLang(markdownFiles, lang)

	return (
		<section className="ui__ container">
			{title && description && (
				<Meta title={title} description={description} image={image} />
			)}
			<ScrollToTop />
			<Content />
		</section>
	)
}
