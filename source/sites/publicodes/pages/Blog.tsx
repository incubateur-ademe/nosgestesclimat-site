import Meta from 'Components/utils/Meta'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { blogData } from './BlogData'

export default () => {
	const { t } = useTranslation()
	const title = t('Le blog')
	const description = t('pages.News.premierParagraphe')

	return (
		<div className={'ui__ container fluid'}>
			<Meta title={title} description={description} />
			<h1 data-cypress-id="blog-title">{title}</h1>
			<p>{description}</p>
			<ul>
				{blogData.map((post) => (
					<li key={post.id}>
						<Link to={`/blog/${post.slug}`}>{post.title}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
