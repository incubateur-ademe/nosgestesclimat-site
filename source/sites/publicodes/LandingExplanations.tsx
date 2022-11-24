import Markdown from 'markdown-to-jsx'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'

import { getCurrentLangAbrv, Lang } from './../../locales/translation'
import avantages from './avantages.yaml'
import LandingContent from './LandingContent'
import MarkdownPage from './pages/MarkdownPage'

import contentEn from 'raw-loader!../../locales/pages/en-us/landing.md'
import contentEs from 'raw-loader!../../locales/pages/es/landing.md'
import contentFr from 'raw-loader!../../locales/pages/fr/landing.md'
import contentIt from 'raw-loader!../../locales/pages/it/landing.md'

const fluidLayoutMinWidth = '1200px'

type Avantage = {
	illustration: string
	icon?: string
	text: { fr: string; en: string; es: string; it: string }
}

// Meta's description (used by the i18next parser):
//
// <Trans i18nKey={'meta.publicodes.Landing.description'}>
// 	Testez votre empreinte carbone, tout seul ou en groupe. Découvrez la
// 	répartition de votre empreinte. Suivez le parcours de passage à l'action
// 	pour la réduire.
// </Trans>

export default () => {
	const { t, i18n } = useTranslation()
	const currentLangAbrv = getCurrentLangAbrv(i18n)

	return (
		<>
			<div
				css={`
					width: 100%;
				`}
			>
				<LandingContent background>
					<MarkdownPage
						markdownFiles={[
							[Lang.Fr, contentFr],
							[Lang.En, contentEn],
							[Lang.Es, contentEs],
							[Lang.It, contentIt],
						]}
					/>
				</LandingContent>
				<LandingContent>
					<h2>
						<Trans>Ouvert, documenté et contributif</Trans>
					</h2>
					<div
						css={`
							img {
								width: 2.6rem;
								height: auto;
								margin: 0.4rem;
							}
							display: flex;
							justify-content: center;
							align-items: center;
							flex-wrap: wrap;
							> div {
								width: 14rem;
								height: 14rem;
								justify-content: center;
							}
							@media (max-width: ${fluidLayoutMinWidth}) {
								flex-direction: column;
							}
						`}
					>
						{avantages.map((el: Avantage) => {
							return (
								<div key={el.icon} className="ui__ card box">
									{emoji(el.illustration)}

									<div>
										<Markdown>{el.text[currentLangAbrv]}</Markdown>
									</div>
								</div>
							)
						})}
					</div>
					<Markdown
						children={t(`sites.publicodes.LandingExplanations.faqLink`)}
					/>
				</LandingContent>
			</div>
		</>
	)
}
