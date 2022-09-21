import MarkdownPage from './MarkdownPage'
import { Lang } from '../../../locales/translation'

import contentFr from 'raw-loader!../../../locales/pages/fr/méthode.md'
import contentEn from 'raw-loader!../../../locales/pages/en-us/méthode.md'
import contentEs from 'raw-loader!../../../locales/pages/es/méthode.md'
import contentIt from 'raw-loader!../../../locales/pages/it/méthode.md'

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
