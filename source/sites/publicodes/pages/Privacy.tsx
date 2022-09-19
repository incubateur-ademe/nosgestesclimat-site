import MarkdownPage from './MarkdownPage'
import { Lang } from '../../../locales/translation'

import contentFr from 'raw-loader!../../../locales/pages/fr/privacy.md'
import contentEn from 'raw-loader!../../../locales/pages/en/privacy.md'
import contentEs from 'raw-loader!../../../locales/pages/es/privacy.md'
import contentIt from 'raw-loader!../../../locales/pages/it/privacy.md'

export default () => {
	return (
		<MarkdownPage
			markdownFiles={[
				[Lang.Fr, contentFr],
				[Lang.En, contentEn],
				[Lang.Es, contentEs],
				[Lang.It, contentIt],
			]}
			title="Données personnelles"
			descriptionId="Privacy"
		/>
	)
}
