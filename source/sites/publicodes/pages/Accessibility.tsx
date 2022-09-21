import MarkdownPage from './MarkdownPage'
import { Lang } from '../../../locales/translation'

import contentFr from 'raw-loader!../../../locales/pages/fr/accessibility.md'
import contentEn from 'raw-loader!../../../locales/pages/en-us/accessibility.md'
import contentEs from 'raw-loader!../../../locales/pages/es/accessibility.md'
import contentIt from 'raw-loader!../../../locales/pages/it/accessibility.md'

export default () => {
	return (
		<MarkdownPage
			markdownFiles={[
				[Lang.Fr, contentFr],
				[Lang.En, contentEn],
				[Lang.Es, contentEs],
				[Lang.It, contentIt],
			]}
			title={'Accessibilité'}
			descriptionId="Accessibility"
		/>
	)
}
