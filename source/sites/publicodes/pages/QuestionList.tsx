import { useSelector } from 'react-redux'
import { parentName } from '../../../components/publicodesUtils'
import FriendlyObjectViewer from './FriendlyObjectViewer'

export default () => {
	const rules = useSelector((state) => state.rules)
	const questionRules = Object.entries(rules)
		.map(([dottedName, v]) => ({ ...v, dottedName }))
		.filter((el) => el && el.question)

	return (
		<div>
			<h1>Les questions du modèle Nos Gestes Climat</h1>
			<ul
				css={`
					h2 {
						font-size: 110%;
						margin: 0;
						margin-left: 0.6rem;
					}
				`}
			>
				{questionRules.map((rule) => (
					<QuestionDescription rules={rules} rule={rule} />
				))}
			</ul>
		</div>
	)
}

const QuestionDescription = ({ rule, rules }) => {
	const questionType = rule.unité
		? '🔢 Numérique'
		: rule.mosaique
		? '🪟 Mosaïque'
		: '☑️ Oui/Non'
	const category = rules[parentName(rule.dottedName, undefined, 0, -1)],
		categoryLetter = category.titre[0]
	return (
		<li>
			<div
				css={`
					display: flex;
				`}
			>
				<span
					css={`
						text-transform: uppercase;
						background: ${category.couleur};
						color: white;
						font-weight: bold;
						width: 1.4rem;
						height: 1.4rem;
					`}
					title={category.titre}
				>
					{categoryLetter}
				</span>
				<h2>{rule.question}</h2>
			</div>
			<div>
				<span title="Type de question">{questionType}</span>
			</div>
			<details>
				<summary title="Spécifications complètes">🔦</summary>
				<FriendlyObjectViewer data={rule} options={{ capitalise0: false }} />
			</details>
		</li>
	)
}
