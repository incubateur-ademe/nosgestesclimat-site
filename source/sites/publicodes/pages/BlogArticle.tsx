import { useTranslation } from 'react-i18next'
import { Lang } from '../../../locales/translation'
import MarkdownPage from './MarkdownPage'

import { Link, useParams } from 'react-router-dom'
import { blogData } from './BlogData'

const MarkdownPageWrapper = () => {
	const { t } = useTranslation()
	const { slug } = useParams()

	const markdownFile = blogData.find((element) => element.slug == slug)
	const content = markdownFile?.content || ''
	const title = markdownFile?.title
	const description = markdownFile?.description

	if (!markdownFile) {
		return (
			<div>
				<Link to="/blog">← {t('Retour à la liste des articles')}</Link>
				<br />
				{t("Oups, nous n'avons pas d'article correspondant")}
			</div>
		)
	}

	return (
		<div>
			<Link to="/blog">← {t('Retour à la liste des articles')}</Link>
			<MarkdownPage
				markdownFiles={[[Lang.Fr, content]]}
				title={title}
				description={description}
			/>
		</div>
	)
}

export default MarkdownPageWrapper
