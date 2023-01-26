import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ScrollToTop } from '../../components/utils/Scroll'
import ModelDemoBlock from './ModelDemoBlock'
import ModelIssuePreviews from './ModelIssuePreviews'
import ModelStatsBlock from './ModelStatsBlock'

// I18N : I didn't write this page as a .md file, even if it's easier to translate and edit, because of its highly interactive nature
export default ({}) => {
	return (
		<div>
			<ScrollToTop />
			<h1>
				<Trans>Le modèle d'empreinte carbone de référence</Trans>
			</h1>
			<p>
				<Trans i18nKey="model.intro">
					Derrière le site nosgestesclimat.fr, se cache le modèle d'empreinte
					climat individuelle de consommation de référence.
				</Trans>
			</p>
			<p>
				<Trans i18nKey="model.intro2">
					Entièrement ouvert (open source) et contributif, chacun peut l'
					<Link to="/documentation">explorer</Link>,{' '}
					<Link to="/contribuer">donner son avis</Link>,{' '}
					<a href="https://github.com/datagir/nosgestesclimat">l'améliorer</a>.
				</Trans>
			</p>
			<h2>
				💫 <Trans>Une technologie moderne</Trans>
			</h2>
			<p>
				<Trans i18nKey="model.modern">
					Le modèle est basé sur <a href="https://publi.codes">publicodes</a>,
					un langage conçu par l'État pour exprimer des algorithmes d'intérêt
					public.
				</Trans>
			</p>
			<p>
				<Trans i18nKey="model.modern2">
					Entièrement paramétrable, depuis les questions posées à l'utilisateur
					jusqu'aux hypothèses du modèle de calcul, il peut être réutilisé{' '}
					<a href="https://github.com/datagir/nosgestesclimat/blob/master/LICENSE">
						librement
					</a>{' '}
					par tout type d'acteur.
				</Trans>
			</p>
			<p>
				<Trans i18nKey="model.modern3">
					⬇️ Ci-dessous, vous pouvez voir l'influence de 3 paramètres de calcul
					sur les résultats finaux.
				</Trans>
			</p>
			<ModelDemoBlock />
			<p>
				🕵️
				<Trans i18nKey="model.modern4">
					Le modèle de calcul est directement embarqué chez le client, le calcul
					a lieu là dans votre navigateur, pas sur nos serveurs. Les données
					collectées sont si descriptives de la vie des utilisateurs, donc
					sensibles en termes de vie privée, que faire les calculs côté serveur{' '}
					<a href="https://github.com/datagir/nosgestesclimat-site/issues/400">
						et les stocker
					</a>{' '}
					poserait un risque trop élevé.
				</Trans>
			</p>
			<h2>
				📚️ <Trans>Un modèle complet</Trans>
			</h2>
			<ModelStatsBlock />
			<p>
				<Trans i18nKey={'model.stats2'}>
					Il est constitué d'une combinaison de centaines de modèles micro
					"bottom-up" pour les consommations carbonées de notre vie quotidienne,
					et d'un modèle "top-down" dérivé des travaux du SDES pour estimer
					l'empreinte par personne des services dits sociétaux (services publics
					et services de base tels les télécom).{' '}
					<a href="https://github.com/datagir/nosgestesclimat/releases/tag/2.5.0">
						En savoir plus sur cette hybridation
					</a>
					.
				</Trans>
			</p>
			<h2>
				⏩️ <Trans>En développement actif</Trans>
			</h2>
			<p>
				<Trans i18nKey={'model.active'}>
					La construction du modèle (pistes de travail, réflexions en cours,
					feuille de route, etc.) est amplement{' '}
					<a href="https://github.com/datagir/nosgestesclimat/issues">
						documentée publiquement
					</a>
					.
				</Trans>
				<p>
					<Trans i18nKey={'model.active'}>
						Voici à titre d'exemple quelques <em>issues</em> importantes du
						moment parmi la centaine de sujets documentés.
					</Trans>
				</p>
				<ModelIssuePreviews />
			</p>
		</div>
	)
}
