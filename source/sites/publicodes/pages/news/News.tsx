import Meta from 'Components/utils/Meta'
import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import NewsItem from './NewsItem'
import NewsList from './NewsList'

export default () => {
	const { t } = useTranslation()
	const title = t('Nouveautés'),
		description = t('Découvrez les dernières nouveautés de Nos Gestes Climat')
	return (
		<div className="ui__ container fluid">
			<Meta title={title} description={description} />
			<h1>{title}</h1>
			<p>{description}</p>
			<Routes>
				<Route path="/:slug" element={<NewsItem />} />
				<Route path="/" element={<NewsList />} />
			</Routes>
		</div>
	)
}
