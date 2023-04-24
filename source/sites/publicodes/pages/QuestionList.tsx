import { useSelector } from 'react-redux'
import { getRelatedMosaicInfosIfExists } from '../../../components/conversation/RuleInput'
import {
	parentName,
	questionCategoryName,
} from '../../../components/publicodesUtils'
import { useEngine } from '../../../components/utils/EngineContext'
import toCSV from '../../../components/utils/toCSV'
import FriendlyObjectViewer from './FriendlyObjectViewer'

export default () => {
	const rules = useSelector((state) => state.rules)
	const engine = useEngine()
	const questionRules = Object.entries(rules)
		.map(([dottedName, v]) => ({ ...v, dottedName }))
		.filter((el) => el && el.question)

	const jsonList = questionRules.map((rule) => {
		const { type, mosaic } = getQuestionType(engine, rules, rule)

		return {
			dottedName: rule.dottedName,
			question: rule.question,
			type,
			catégorie: questionCategoryName(rule.dottedName),
			'dans mosaïque': mosaic != null,
		}
	})
	const header = [
		'dottedName',
		'question',
		'type',
		'catégorie',
		'dans mosaïque',
	]
	const csv = toCSV(header, jsonList)
	return (
		<div>
			<h1>Les questions du modèle Nos Gestes Climat</h1>
			<p>
				Voici une liste des questions qui sont posées à l'utilisateur au cours
				du test, et dans une moindre mesure au cours du parcours action. Le
				format des questions est présenté, et l'intégralité des propriétés{' '}
				<a href="https://publi.codes">publicodes</a> ainsi que les extensions
				spécifiques à Nos Gestes Climat (comme la mosaïque) sont spécifiées{' '}
				<strong>au clic</strong>. L'identifiant de la quesion est la propriété
				"dottedName".
			</p>
			<p>
				Le questionnaire est dynamique : chaque question est susceptible d'être
				conditionnée à la réponse à une autre question. Les dépendances d'une
				question sont listées avec l'icône 🗜️. Dans le cas des questions
				mosaïques, l'icône liste les questions qui constituent la mosaïque.
			</p>
			<textarea
				value={csv}
				css={`
					width: 90%;
				`}
			/>
			<button
				className="ui__ button small"
				onClick={() => {
					navigator.clipboard.writeText(csv)
				}}
			>
				Copier le CSV
			</button>
			<ul>
				{questionRules.map((rule) => (
					<QuestionDescription
						engine={engine}
						rules={rules}
						rule={rule}
						key={rule.dottedName}
					/>
				))}
			</ul>
		</div>
	)
}

const getQuestionType = (engine, rules, rule) => {
	const ruleMosaicInfos = getRelatedMosaicInfosIfExists(
		engine,
		rules,
		rule.dottedName
	)
	console.log(ruleMosaicInfos)
	const mosaicType = ruleMosaicInfos && ruleMosaicInfos[1].type

	const type = rule.mosaique
		? `🪟 Mosaïque de type ${rule.mosaique.type}`
		: rule.unité ||
		  typeof rule['par défaut'] === 'number' ||
		  mosaicType === 'nombre'
		? '🔢 Numérique'
		: rule.formule && rule.formule['une possibilité']
		? '🔠 plusieurs possibilités'
		: '☑️ Oui/Non'
	return { type, mosaic: ruleMosaicInfos }
}
const QuestionDescription = ({ engine, rule, rules }) => {
	const { type, mosaic } = getQuestionType(engine, rules, rule)
	const category = rules[parentName(rule.dottedName, undefined, 0, -1)],
		categoryLetter = category.titre[0]

	const { missingVariables } = engine.evaluate(rule.dottedName)
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
							<span title="Type de question">{type}</span>
							{!rule.mosaique && mosaic && <span>Dans mosaïque</span>}
							{rule.mosaique && (
								<details>
									<summary className="ui__ dashed-button">C'est quoi ?</summary>
									Une mosaïque ne sert qu'à regrouper plusieurs questions, soit
									toutes numériques, soit toutes à cocher. Sa valeur n'est pas
									saisie par l'utilisateur, c'est souvent une somme. Ses
									questions sont chacunes dans cette liste.
								</details>
							)}
						</div>
						<MissingVariables
							data={missingVariables}
							dottedName={rule.dottedName}
						/>
					</div>
				</summary>
				<FriendlyObjectViewer data={rule} options={{ capitalise0: false }} />
			</details>
		</li>
	)
}

const MissingVariables = ({ data, dottedName }) => {
	const entries = Object.entries(data).filter(([k]) => k !== dottedName)
	if (!entries.length) return null
	return (
		<div css="margin-left: .4rem">
			🗜️&nbsp;
			<details css="display: inline-block">
				<summary>{entries.length} dépendances</summary>

				<ul>
					{entries.map(([k, v]) => (
						<li key={k}>
							{k} : {v}
						</li>
					))}
				</ul>
			</details>
		</div>
	)
}
