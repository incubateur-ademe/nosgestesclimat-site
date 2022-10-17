import { Lang } from '../../../locales/translation'
import MarkdownPage from './MarkdownPage'

import contentEn from 'raw-loader!../../../locales/pages/en-us/about.md'
import contentEs from 'raw-loader!../../../locales/pages/es/about.md'
import contentFr from 'raw-loader!../../../locales/pages/fr/about.md'
import contentIt from 'raw-loader!../../../locales/pages/it/about.md'

export default () => {
	return (
		<MarkdownPage
			markdownFiles={[
				[Lang.Fr, contentFr],
				[Lang.En, contentEn],
				[Lang.Es, contentEs],
				[Lang.It, contentIt],
			]}
			title={'À propos'}
			descriptionId="About"
		/>
	)
}