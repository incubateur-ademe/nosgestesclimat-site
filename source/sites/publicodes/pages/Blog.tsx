import Meta from 'Components/utils/Meta'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ScrollToTop } from '@/components/utils/Scroll'
import { getCurrentLangInfos } from '@/locales/translation'
import React, { Suspense } from 'react'
import { blogData } from './BlogData'
import { dateCool, extractImage } from './news/NewsItem'
const LazyIllustration = React.lazy(
	() =>
		import(
			/* webpackChunkName: 'AnimatedIllustration' */ '@/components/AnimatedIllustration'
		)
)

const Illustration = () => (
	<Suspense fallback={null}>
		<LazyIllustration small={true} />
	</Suspense>
)

export default () => {
	const { t } = useTranslation()
	const title = t('Le blog')
	const description = t('pages.Blog.premierParagraphe')
	const { i18n } = useTranslation()
	const currentLangInfos = getCurrentLangInfos(i18n)

	return (
		<div className={'ui__ container fluid'}>
			<Meta title={title} description={description} />
			<h1 data-cypress-id="blog-title">{title}</h1>

			<div
				css={`
					text-align: center;
				`}
			>
				<Illustration aria-hidden="true" />
				<p>{description}</p>
			</div>
			<ScrollToTop />
			<ul
				css={`
					display: flex;
					flex-wrap: wrap;
					list-style-type: none;
					justify-content: center;
					padding-left: 0;
					li {
						width: 18rem !important;
						height: 15rem !important;
						margin: 1rem;
						> a {
							height: 100%;
							width: 100%;
						}
					}
				`}
			>
				{blogData.map((post) => (
					<li key={post.slug}>
						<Link
							to={`/blog/${post.slug}`}
							className="ui__ card box content"
							css={`
								display: flex;
								flex-direction: column;
							`}
						>
							<img
								src={extractImage(post.content)}
								css={`
									object-fit: cover;
									width: 12rem;
									height: 8rem;
									margin-bottom: 0.6rem;
								`}
								alt={`Illustration: ${post.title}`}
							/>
							<div
								css={`
									line-height: 1.4rem;
									max-width: 80%;
								`}
							>
								{post.title}
								<div>
									<small>
										{dateCool(new Date(post.date), currentLangInfos.abrvLocale)}
									</small>
								</div>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
