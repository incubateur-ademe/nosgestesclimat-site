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
				<Trans>Une nouvelle expérience métier intéractive</Trans>
			</h2>
			<p>
				Le modèle est basé sur <a href="https://publi.codes">publicodes</a>, un
				langage conçu par l'État pour exprimer des algorithmes d'intérêt public.
			</p>
			<p>
				{' '}
				Entièrement paramétrable, des questions posées à l'utilisateur jusqu'aux
				hypothèses du modèle de calcul, TODO Montrer ici qu'en modifiant une
				valeur (par exemple l'empreinte d'une voiture) on change le résultat
				final de la simulation, et que ça tourne là directement dans le
				navigateur.
			</p>
			<ModelDemoBlock />
			<p>
				🕵️
				<Trans>
					Le modèle de calcul est directement embarqué chez le client, dans son
					navigateur. En effet, les données collectées sont si descriptive de la
					vie des utilisateurs que faire les calculs côté serveur poserait un
					risque élevé pour ces données sensibles.
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
				TODO montrer visuellement le périmètre important du projet. Vue en
				graphe ?{' '}
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
			<h2>
				<Trans>Un modèle hybride</Trans>
			</h2>
			<p>Faire un lien vers la page de release du modèle hybride</p>
		</div>
	)
}
