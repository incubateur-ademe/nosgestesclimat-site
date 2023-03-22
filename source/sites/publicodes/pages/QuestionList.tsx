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
			<p>
				Voici une liste des questions qui sont posées à l'utilisateur au cours
				du test, et dans une moindre mesure au cours du parcours action. Le
				format des questions est présenté, et l'intégralité des propriétés{' '}
				<a href="https://publi.codes">publicodes</a> ainsi que les extensions
				spécifiques à Nos Gestes Climat (comme la mosaïque) sont spécifiées au
				clic. L'identifiant de la quesion est la propriété "dottedName".
			</p>
			<ul>
				{questionRules.map((rule) => (
					<QuestionDescription
						rules={rules}
						rule={rule}
						key={rule.dottedName}
					/>
				))}
			</ul>
		</div>
	)
}

const QuestionDescription = ({ rule, rules }) => {
	const questionType = rule.mosaique
		? '🪟 Mosaïque'
		: rule.unité
		? '🔢 Numérique'
		: '☑️ Oui/Non'
	const category = rules[parentName(rule.dottedName, undefined, 0, -1)],
		categoryLetter = category.titre[0]
	return (
		<li
			css={`
				details > summary {
					display: flex;
				}
				margin-top: 1rem;
			`}
		>
			<details>
				<summary>
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
					<div
						css={`
							margin-left: 0.6rem;
							h2 {
								font-size: 110%;
								margin: 0;
							}
						`}
					>
						<h2>{rule.question}</h2>

						<div
							css={`
								display: flex;
								> * {
									margin: 0 0.4rem;
								}
							`}
						>
							<span title="Type de question">{questionType}</span>
							{rule.mosaique && (
								<details>
									<summary>C'est quoi ?</summary>
									Une mosaïque ne sert qu'à regrouper plusieurs questions, soit
									toutes numériques, soit toutes à cocher. Sa valeur n'est pas
									saisie par l'utilisateur, c'est souvent une somme. Ses
									questions sont chacunes dans cette liste.
								</details>
							)}
						</div>
					</div>
				</summary>
				<FriendlyObjectViewer data={rule} options={{ capitalise0: false }} />
			</details>
		</li>
	)
}
