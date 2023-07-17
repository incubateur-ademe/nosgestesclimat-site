import Title from '@/components/groupe/Title'
import Meta from 'Components/utils/Meta'
import { useTranslation } from 'react-i18next'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import NewsItem from './NewsItem'
import NewsList from './NewsList'

export default () => {
	const { t } = useTranslation()
	const title = t('Les nouveautés ✨'),
		description = t('pages.News.premierParagraphe')
	//'Nous améliorons le site en continu à partir de vos retours. Découvrez ici les dernières nouveautés.'
	const path = decodeURIComponent(useLocation().pathname),
		isReleasePage = path.length > '/nouveautés/'.length

	return (
		<div className={'ui__ container ' + (isReleasePage ? '' : 'fluid')}>
			<Meta title={title} description={description} />
			{isReleasePage ? (
				<Link to="/nouveautés">
					<strong data-cypress-id="news-title">{title}</strong>
				</Link>
			) : (
				<Title data-cypress-id="news-title" title={title} />
			)}
			<p>{description}</p>
			<Routes>
				<Route path="/:slug" element={<NewsItem />} />
				<Route path="/" element={<NewsList />} />
			</Routes>
		</div>
	)
}
