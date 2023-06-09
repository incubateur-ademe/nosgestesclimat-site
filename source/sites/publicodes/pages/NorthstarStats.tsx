import Meta from '@/components/utils/Meta'
import { useTranslation } from 'react-i18next'

export default () => {
	const { t } = useTranslation()
	const title = t('Statistiques Northstar')
	const description = t('A compléter')
	return (
		<div className={'ui__ container fluid'}>
			<Meta title={title} description={description} />
			<h1 data-cypress-id="blog-title">{title}</h1>
			<iframe
				src="http://metabase-ngc.osc-fr1.scalingo.io/public/dashboard/0f6974c5-1254-47b4-b6d9-6e6f22a6faf7"
				frameborder="0"
				width="100%"
				height="1000px"
				allowtransparency
			></iframe>
		</div>
	)
}
