import { Markdown } from '@/components/utils/markdown'
import Meta from '@/components/utils/Meta'
import { ScrollToTop } from '@/components/utils/Scroll'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { getMarkdownInCurrentLang, Lang } from '@/locales/translation'

import contentEn from '../../../locales/pages/en-us/documentation.md'
import contentFr from '../../../locales/pages/fr/documentation.md'

export default () => {
	const { t, i18n } = useTranslation()
	const l: Lang = i18n.language as Lang

	const content = getMarkdownInCurrentLang(
		[
			[Lang.Fr, contentFr],
			[Lang.En, contentEn],
		],
		l
	)

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
