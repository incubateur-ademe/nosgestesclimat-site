import { Markdown } from '@/components/utils/markdown'
import { useTranslation } from 'react-i18next'

import AutoCanonicalTag from '@/components/utils/AutoCanonicalTag'
import Meta from '@/components/utils/Meta'
import { ScrollToTop } from '@/components/utils/Scroll'
import { getMarkdownInCurrentLang, Lang } from '@/locales/translation'

export type PageProps = {
	markdownFiles: Array<[Lang, string]>
	// Information about the page metadata
	title?: string
	description?: string
	image?: string
}

export default ({ markdownFiles, title, description, image }: PageProps) => {
	const { i18n } = useTranslation()
	const lang: Lang = i18n.language as Lang

	const content = getMarkdownInCurrentLang(markdownFiles, lang)

	return (
		<section className="ui__ container">
			{title && description && (
				<Meta title={title} description={description} image={image} />
			)}
			<AutoCanonicalTag />
			<ScrollToTop />
			<Markdown children={content} />
		</section>
	)
}
