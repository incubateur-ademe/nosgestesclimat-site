import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import Meta from 'Components/utils/Meta'
import content from 'raw-loader!./documentation.md'
import { Trans, useTranslation } from 'react-i18next'

export default () => {
	const { t } = useTranslation()

	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 1rem auto;">
			<Meta title={t('Documentation Contexte Sondage')} />
			<ScrollToTop />
			<div>
				<Link to={'/groupe'}>
					<button className="ui__ button simple small ">
						{emoji('◀')} <Trans>Retour</Trans>
					</button>
				</Link>
			</div>
			<div css="margin: 1.6rem 0">
				<Markdown>{content || t('En cours de chargement')}</Markdown>
			</div>
		</div>
	)
}
