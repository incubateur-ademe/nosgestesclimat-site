import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ScrollToTop } from '../../components/utils/Scroll'

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
					C'est un standard qui évolue régulièrement et qui peut être réutilisé
					librement par tout type d'acteur.
				</Trans>
			</p>
			<h2>
				<Trans>Une nouvelle expérience métier intéractive</Trans>
			</h2>
			<p>
				TODO Montrer ici qu'en modifiant une valeur (par exemple l'empreinte
				d'une voiture) on change le résultat final de la simulation, et que ça
				tourne là directement dans le navigateur.
			</p>
			<p>Parle de la vie privée : ça tourne chez vous, pas sur des serveurs</p>
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
		</div>
	)
}
