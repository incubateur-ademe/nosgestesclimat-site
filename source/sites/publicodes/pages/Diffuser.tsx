import MarkdownPage from './MarkdownPage'
import { Lang } from '../../../locales/translation'

import contentFr from 'raw-loader!../../../locales/pages/fr/diffuser.md'
import contentEn from 'raw-loader!../../../locales/pages/en/diffuser.md'
import contentEs from 'raw-loader!../../../locales/pages/es/diffuser.md'
import contentIt from 'raw-loader!../../../locales/pages/it/diffuser.md'

export default () => {
	return (
		<MarkdownPage
			markdownFiles={[
				[Lang.Fr, contentFr],
				[Lang.En, contentEn],
				[Lang.Es, contentEs],
				[Lang.It, contentIt],
			]}
			title={'Diffuser Nos Gestes Climat'}
			descriptionId="Diffuser"
		/>
	)
}
