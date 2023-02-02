import Markdown from 'markdown-to-jsx'
import { utils } from 'publicodes'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { splitName } from '../../../components/publicodesUtils'
import SafeCategoryImage from '../../../components/SafeCategoryImage'
import SearchBar from '../../../components/SearchBar'
import Meta from '../../../components/utils/Meta'
import editorialisedModels from './editorialisedModels.yaml'

export default function DocumentationLanding() {
	const { t } = useTranslation()
	const rules = useSelector((state) => state.rules)
	const editos = editorialisedModels.map((dottedName) => ({
		...rules[dottedName],
		dottedName,
	}))
	const getColor = (dottedName) => rules[splitName(dottedName)[0]].couleur
	return (
		<div className="ui__ container">
			<Meta
				title={t('Comprendre nos calculs')}
				description={t('meta.publicodes.pages.Documentation.description')}
			/>
			<h1>Documentation</h1>
			<p>
				<Trans i18nKey={'meta.publicodes.pages.Documentation.intro'}>
					Le simulateur Nos Gestes Climat est basé sur le modèle de calcul du
					même nom, composé d'un ensemble de briques. Sur cette documentation,
					vous avez accès en toute transparence à l'ensemble des variables du
					calcul.
				</Trans>
			</p>
			<p>
				<Link to="/modèle">
					💡 <Trans> En savoir plus sur notre modèle</Trans>
				</Link>
			</p>
			<h2>
				<Trans>Explorez nos modèles</Trans>
			</h2>
			<SearchBar />
			<h2>
				<Trans>Quelques suggestions </Trans>
			</h2>
			<ol
				css={`
					display: flex;
					justify-content: start;
					align-items: center;
					flex-wrap: wrap;
					> li {
						height: 10rem;
					}
					max-width: 60rem;
					padding: 0;
				`}
			>
				{editos.map(({ icônes, color, dottedName, title, résumé, couleur }) => (
					<li
						key={dottedName}
						className="ui__ card box"
						css={`
							flex: auto !important;
							background: ${getColor(dottedName) || 'var(--color)'} !important;
							a {
								text-decoration: none;
								z-index: 1;
								display: flex;
								align-items: center;
								height: 100%;
								h2 {
									margin-top: 0rem;
									text-align: center;
									display: inline;
									font-size: 120%;
									line-height: 1.3rem;
									display: inline-block;
									color: white;
									@media (min-width: 800px) {
										font-size: 110%;
									}
									font-weight: 400;
									strong {
										font-weight: bold;
									}
								}
								text-decoration: none;
							}
							position: relative;
							height: 12rem !important;
							width: 11rem !important;
							max-width: 12rem !important;
							@media (max-width: 800px) {
								width: 10rem !important;
								height: 11rem !important;
								padding: 0.6rem !important;
								margin: 0.4rem !important;
							}
						`}
					>
						<Link to={'/documentation/' + utils.encodeRuleName(dottedName)}>
							<span
								css={`
									position: absolute;
									top: 50%;
									transform: translateX(-50%) translateY(-50%);
									left: 50%;
									font-size: 600%;
									white-space: nowrap;
									mix-blend-mode: lighten;
									filter: grayscale(1);
									opacity: 0.2;
									img {
										width: 11rem;
									}
								`}
							>
								<SafeCategoryImage element={{ dottedName }} />
							</span>
							{résumé && <h2>{<Markdown>{résumé}</Markdown>}</h2>}
						</Link>
					</li>
				))}
			</ol>
		</div>
	)
}
