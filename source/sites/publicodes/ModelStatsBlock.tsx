import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Loading = () => <p>Chargement du modèle...</p>
export default () => {
	const rules = useSelector((state) => state.rules)
	if (!rules) return <Loading />
	const numberOfRules = Object.keys(rules).length
	const numberOfQuestions = Object.values(rules).filter(
		(el) => el && el.question
	).length

	const NumberOfRules = () => <span>{numberOfRules}</span>
	const NumberOfQuestions = () => <span>{numberOfQuestions}</span>
	return (
		<div>
			<p>
				<Trans i18nKey={'model.stats'}>
					Le modèle comprend aujourd'hui <NumberOfRules /> règles de calcul.
					Parmi elles, <NumberOfQuestions /> règles sont des questions à poser à
					l'utilisateur pour calculer un résultat précis.
				</Trans>
			</p>
			<p>
				<Trans i18nKey={'model.questions'}>
					Découvrez{' '}
					<Link to="/questions">
						la liste des questions disponibles dans le modèle
					</Link>
					.
				</Trans>
			</p>
		</div>
	)
}
