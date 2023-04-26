import Title from 'Components/Title'
import Meta from 'Components/utils/Meta'
import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import NewsItem from './NewsItem'
import NewsList from './NewsList'

export default () => {
	const { t } = useTranslation()
	const title = t('Nouveautés')
	return (
		<>
			<Meta
				title={title}
				description={t(
					'Découvrez les dernières nouveautés au sujet de Nos Gestes Climat.'
				)}
			/>
			<Title>{title}</Title>
			<Routes>
				<Route path="/:slug" element={<NewsItem />} />
				<Route path="/" element={<NewsList />} />
			</Routes>
		</>
	)
}
