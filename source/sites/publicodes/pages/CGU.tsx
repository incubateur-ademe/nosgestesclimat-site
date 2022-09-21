import MarkdownPage from './MarkdownPage'
import { Lang } from '../../../locales/translation'

import contentFr from 'raw-loader!../../../locales/pages/fr/CGU.md'
import contentEn from 'raw-loader!../../../locales/pages/en-us/CGU.md'
import contentEs from 'raw-loader!../../../locales/pages/es/CGU.md'
import contentIt from 'raw-loader!../../../locales/pages/it/CGU.md'

export default () => {
	return (
		<MarkdownPage
			markdownFiles={[
				[Lang.Fr, contentFr],
				[Lang.En, contentEn],
				[Lang.Es, contentEs],
				[Lang.It, contentIt],
			]}
			title={"Conditions générales d'utilisation"}
			descriptionId="CGU"
		/>
	)
}
