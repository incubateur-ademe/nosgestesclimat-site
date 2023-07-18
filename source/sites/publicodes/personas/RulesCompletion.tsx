import { NGCRules } from '@/components/publicodesUtils'
import Engine from 'publicodes'
import { Trans } from 'react-i18next'
import { getQuestionList } from '../pages/QuestionList'
import { Persona } from '../Personas'

export default ({
	engine,
	rules,
	persona,
}: {
	engine: Engine
	rules: NGCRules
	persona: Persona
}) => {
	const rawQuestionList = getQuestionList(engine, rules)
	const completeQuestionList = rawQuestionList.reduce((arr, rule) => {
		if (!rule.type.includes('Mosaïque')) {
			arr.push(rule.dottedName)
		}
		return arr
	}, [])

	const intersectListToExclude = Object.keys(persona?.data).filter(
		(dottedName) => !completeQuestionList.includes(dottedName)
	)
	const intersectListToInclude = completeQuestionList.filter(
		(dottedName) => !Object.keys(persona?.data).includes(dottedName)
	)

	return (
		<div>
			<h2>
				<Trans>Complétude des règles du personas:</Trans>
			</h2>
			{Object.keys(persona?.data).length === 0 ? (
				<p>
					<Trans>C'est le persona par défaut.</Trans>
				</p>
			) : (
				<div>
					{intersectListToInclude.length === 0 ? (
						<p>
							<Trans>✅ Aucune règle du modèle est absente du persona.</Trans>
						</p>
					) : (
						<details>
							<summary>
								{intersectListToInclude.length}{' '}
								{intersectListToInclude.length === 1 ? (
									<Trans>règle est absente du persona</Trans>
								) : (
									<Trans>règles sont absentes du persona</Trans>
								)}
							</summary>
							<ul>
								{intersectListToInclude.map((dottedName) => (
									<li key={dottedName}>{dottedName}</li>
								))}
							</ul>
						</details>
					)}
					{intersectListToExclude.length === 0 ? (
						<p>
							<Trans>✅ Aucune règle du persona n'est absente du modèle.</Trans>
						</p>
					) : (
						<details>
							<summary>
								{intersectListToExclude.length}{' '}
								{intersectListToExclude.length === 1 ? (
									<Trans>
										règle a été définie dans le persona mais est absente du
										modèle
									</Trans>
								) : (
									<Trans>
										règles ont été définies dans le persona mais sont absentes
										du modèle
									</Trans>
								)}
							</summary>
							<ul>
								{intersectListToExclude.map((dottedName) => (
									<li key={dottedName}>{dottedName}</li>
								))}
							</ul>
						</details>
					)}
				</div>
			)}
		</div>
	)
}
