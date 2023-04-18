import { useTranslation } from 'react-i18next'
import { Lang } from '../../../locales/translation'
import MarkdownPage from './MarkdownPage'

import contentEn from '../../../locales/pages/en-us/privacy.md'
// import contentEs from '../../../locales/pages/es/privacy.md'
import contentFr from '../../../locales/pages/fr/privacy.md'
// import contentIt from '../../../locales/pages/it/privacy.md'

export default () => {
	const { t } = useTranslation()

	return (
		<MarkdownPage
			markdownFiles={[
				[Lang.Fr, contentFr],
				[Lang.En, contentEn],
				// [Lang.Es, contentEs],
				// [Lang.It, contentIt],
			]}
			title={t('meta.publicodes.Privacy.title')}
			description={t('meta.publicodes.Privacy.description')}
		/>
	)
}
