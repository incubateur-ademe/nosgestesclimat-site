import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ScrollToTop } from '../../components/utils/Scroll'
import ModelDemoBlock from './ModelDemoBlock'

// I18N : I didn't write this page as a .md file, even if it's easier to translate and edit, because of its highly interactive nature
export default ({}) => {
	const rules = useSelector((state) => state.rules)
	const numberOfRules = Object.keys(rules).length
	const numberOfQuestions = Object.values(rules).filter(
		(el) => el && el.question
	).length

	console.log(rules, numberOfRules, numberOfQuestions)
	const NumberOfRules = () => <span>{numberOfRules}</span>
	const NumberOfQuestions = () => <span>{numberOfQuestions}</span>
	return (
		<div>
			<ScrollToTop />
			<h1>
				<Trans>Le modèle d'empreinte carbone de référence</Trans>
			</h1>
			<p>
				<Trans>
					Derrière le site nosgestesclimat.fr, se cache le modèle d'empreinte
					climat individuelle de consommation de référence.
				</Trans>
			</p>
			<p>
				<Trans>
					Entièrement ouvert (open source) et contributif, chacun peut l'
					<Link to="/documention">explorer</Link>,{' '}
					<Link to="/contribuer">donner son avis</Link>,{' '}
					<a href="https://github.com/datagir/nosgestesclimat">l'améliorer</a>.
					C'est un standard qui évolue régulièrement et qui peut être réutilisé{' '}
					<a href="https://github.com/datagir/nosgestesclimat/blob/master/LICENSE">
						librement
					</a>{' '}
					par tout type d'acteur.
				</Trans>
			</p>
			<h2>
				<Trans>Une technologie moderne</Trans>
			</h2>
			<p>
				Le modèle est basé sur <a href="https://publi.codes">publicodes</a>, un
				langage conçu par l'État pour exprimer des algorithmes d'intérêt public.
				Entièrement paramétrable, depuis les questions posées à l'utilisateur
				jusqu'aux hypothèses du modèle de calcul.
			</p>
			<p>
				{' '}
				⬇️ Ci-dessous, vous pouvez voir l'influence de 3 paramètres de calcul
				sur les résultats finaux.
			</p>
			<ModelDemoBlock />
			<p>
				🕵️
				<Trans>
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
				<Trans>Un modèle complet</Trans>
			</h2>
			<p>
				<Trans i18nKey={'model.stats'}>
					Le modèle comprend aujourd'hui <NumberOfRules /> règles de calcul.
					Parmi elles, <NumberOfQuestions /> règles sont des questions à poser à
					l'utilisateur pour calculer un résultat précis.
				</Trans>
			</p>
			<p>
				Il est constitué d'une combinaison de centaines de modèles micro
				"bottom-up" pour les consommations carbonées de notre vie quotidienne,
				et d'un modèle "top-down" dérivé des travaux du SDES pour estimer
				l'empreinte par personne des services dits sociétaux (services publics
				et services de base tels les télécom). TODO lien vers la realease
				d'explication.
			</p>
			<h2>
				<Trans>En développement actif</Trans>
			</h2>
			<p>
				<Trans i18nKey={'model.active'}>
					TODO Montrer ici l'activité intense sur github : les issues, une vue
					"Puelse" github ?{' '}
				</Trans>
			</p>
		</div>
	)
}
