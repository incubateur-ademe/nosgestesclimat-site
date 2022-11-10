import { useTranslation } from 'react-i18next'
import { Lang } from '../../../locales/translation'
import MarkdownPage from './MarkdownPage'

import contentEn from 'raw-loader!../../../locales/pages/en-us/petrogazLanding.md'
import contentFr from 'raw-loader!../../../locales/pages/fr/petrogazLanding.md'

export default () => {
	const { t } = useTranslation()
	return (
		<MarkdownPage
			markdownFiles={[
				[Lang.Fr, contentFr],
				[Lang.En, contentEn],
			]}
			title={t('meta.publicodes.PetrogazLanding.title')}
			description={t('meta.publicodes.PetrogazLanding.description')}
			image={
				'https://images.unsplash.com/photo-1613483760414-75759637dc21?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
			}
		/>
	)
}
