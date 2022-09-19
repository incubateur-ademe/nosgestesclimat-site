import { Markdown } from 'Components/utils/markdown'
import { useTranslation } from 'react-i18next'

import Meta from '../../../components/utils/Meta'
import { getLangInfos, Lang } from '../../../locales/translation'

export type PageProps = {
	markdownFiles: Array<[Lang, string]>
	// Information about the page metadata
	title: string
	descriptionId: string
}

export default ({ markdownFiles, title, descriptionId }: PageProps) => {
	const { t, i18n } = useTranslation()
	const l: Lang = i18n.language as Lang

	const content =
		markdownFiles.find(([lang]) => getLangInfos(lang).abrv === l)?.[1] ||
		markdownFiles[0][1]

	return (
		<section className="ui__ container">
			<Meta
				title={t(title)}
				description={t(`meta.publicodes.pages.${descriptionId}.description`)}
			/>
			<Markdown children={content} />
		</section>
	)
}
