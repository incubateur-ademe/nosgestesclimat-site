import { useTranslation } from 'react-i18next'
import { Lang } from '../../../locales/translation'
import MarkdownPage from './MarkdownPage'

import contentEn from 'raw-loader!../../../locales/pages/en-us/CGU.md'
import contentEs from 'raw-loader!../../../locales/pages/es/CGU.md'
import contentFr from 'raw-loader!../../../locales/pages/fr/CGU.md'
import contentIt from 'raw-loader!../../../locales/pages/it/CGU.md'

export default () => {
	const { t } = useTranslation()
	return (
		<MarkdownPage
			markdownFiles={[
				[Lang.Fr, contentFr],
				[Lang.En, contentEn],
				[Lang.Es, contentEs],
				[Lang.It, contentIt],
			]}
			title={t('meta.publicodes.CGU.title')}
			description={t('meta.publicodes.CGU.description')}
		/>
	)
}
