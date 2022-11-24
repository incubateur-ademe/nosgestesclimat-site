import { Markdown } from 'Components/utils/markdown'
import { useTranslation } from 'react-i18next'

import Meta from '../../../components/utils/Meta'
import { getLangInfos, Lang } from '../../../locales/translation'

export type PageProps = {
	markdownFiles: Array<[Lang, string]>
	// Information about the page metadata
	title?: string
	description?: string
	image?: string
}

export default ({ markdownFiles, title, description, image }: PageProps) => {
	const { i18n } = useTranslation()
	const l: Lang = i18n.language as Lang

	const content =
		markdownFiles.find(([lang]) => getLangInfos(lang).abrv === l)?.[1] ||
		markdownFiles[0][1]

	return (
		<section className="ui__ container">
			{title && description && (
				<Meta title={title} description={description} image={image} />
			)}
			<Markdown children={content} />
		</section>
	)
}
