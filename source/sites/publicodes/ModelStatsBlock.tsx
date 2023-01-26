import { Trans } from 'react-i18next'
import useRules from '../../components/useRules'

const Loading = () => <p>Chargement du modèle...</p>
export default () => {
	const rules = useRules({ optimized: false })
	if (!rules) return <Loading />
	const numberOfRules = Object.keys(rules).length
	const numberOfQuestions = Object.values(rules).filter(
		(el) => el && el.question
	).length

	console.log(rules, numberOfRules, numberOfQuestions)
	const NumberOfRules = () => <span>{numberOfRules}</span>
	const NumberOfQuestions = () => <span>{numberOfQuestions}</span>
	return (
		<p>
			<Trans i18nKey={'model.stats'}>
				Le modèle comprend aujourd'hui <NumberOfRules /> règles de calcul. Parmi
				elles, <NumberOfQuestions /> règles sont des questions à poser à
				l'utilisateur pour calculer un résultat précis.
			</Trans>
		</p>
	)
}
