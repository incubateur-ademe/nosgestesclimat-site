import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import { Link } from 'Components/Link'
import Meta from 'Components/utils/Meta'
import { Trans, useTranslation } from 'react-i18next'

import { getLangInfos, Lang } from '../../../locales/translation'

import contentFr from 'raw-loader!../../../locales/pages/fr/documentation.md'
import contentEn from 'raw-loader!../../../locales/pages/en-us/documentation.md'
import contentEs from 'raw-loader!../../../locales/pages/es/documentation.md'
import contentIt from 'raw-loader!../../../locales/pages/it/documentation.md'

export default () => {
	const { t, i18n } = useTranslation()
	const l: Lang = i18n.language as Lang

	const content =
		[
			[Lang.Fr, contentFr],
			[Lang.En, contentEn],
			[Lang.Es, contentEs],
			[Lang.It, contentIt],
		].find(([lang]) => getLangInfos(lang).abrv === l)?.[1] || contentFr

	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 1rem auto;">
			<Meta title={t('Documentation Contexte Sondage')} />
			<ScrollToTop />
			<div>
				<Link to={'/groupe'}>
					<button className="ui__ button simple small ">
						<Trans>◀ Retour</Trans>
					</button>
				</Link>
			</div>
			<div css="margin: 1.6rem 0">
				<Markdown>{content || t('En cours de chargement')}</Markdown>
			</div>
		</div>
	)
}
