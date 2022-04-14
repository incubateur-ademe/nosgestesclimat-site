import Engine from 'publicodes'
import { createContext, useState, useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import RuleInput from 'Components/conversation/RuleInput'
import { setSimulationConfig } from 'Actions/actions'
import { useNextQuestions } from '../../../components/utils/useNextQuestion'
import { situationSelector } from 'Selectors/simulationSelectors'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { updateSituation } from 'Actions/actions'

const SituationContext = createContext({})

export default ({ survey, rules, surveyRule }) => {
	const engine = new Engine(rules)
	const [situation, setSituation] = useState({})
	const nextQuestions = useNextQuestions([surveyRule], engine)
	const situationParent = useSelector(situationSelector)
	console.log(situationParent)
	const dispatch = useDispatch()
	console.log(survey)
	return (
		<div className="ui__ container" css={``}>
			<SituationContext.Provider value={[situation, setSituation]}>
				<Main nextQuestions={nextQuestions} engine={engine} />
				<button
					className="ui__ plain small button"
					disabled={!nextQuestions.every((names) => situation[names])}
					onClick={() =>
						Object.entries(situation).map((e) => {
							dispatch({
								type: 'ADD_SURVEY_CONTEXT',
								answers: survey.answers,
								room: survey.room,
								context: situation,
							})
							dispatch(updateSituation(e[0], e[1]))
						})
					}
				>
					<span className="text">
						<Trans>Suivant</Trans> →
					</span>
				</button>
			</SituationContext.Provider>
		</div>
	)
}

const Main = ({ nextQuestions, engine }) => (
	<main>
		<p
			css={`
				display: flex;
				align-items: center;
				justify-content: space-evenly;
				img {
					font-size: 400%;
				}
				h1 {
					margin-top: 1rem;
					max-width: 80%;
				}
			`}
		>
			{emoji('📝')}
			<h1 css="">Contexte Sondage</h1>
		</p>

		<Questions nextQuestions={nextQuestions} engine={engine} />
	</main>
)

const Questions = ({ nextQuestions, engine }) => {
	const questions = nextQuestions
	const [situation, setSituation] = useContext(SituationContext)
	engine.setSituation(situation)

	const onChange = (dottedName) => (value) => {
			console.log(value, situation, dottedName)
			const newSituation = (situation) => ({
				...situation,
				[dottedName]: value,
			})
			setSituation((situation) => newSituation(situation))
		},
		onSubmit = () => null

	return (
		<div
			css={`
				display: flex;
				flex-direction: column;
				align-items: center;
				flex-wrap: wrap;
				> div {
					margin-top: 1rem;
				}
			`}
		>
			<div
				css={`
					margin: 1rem 0;
					.step.input {
						max-width: 12rem;
					}
					.step label {
						padding: 0.2rem 0.6rem 0.2rem 0.4rem;
					}
				`}
			>
				{questions.map((dottedName) => {
					const { question, icônes } = engine.getRule(dottedName).rawNode
					return (
						<div
							css={`
								display: flex;
								justify-content: start;
								align-items: center;
								img {
									font-size: 300%;
									margin-right: 1rem;
								}
								@media (max-width: 800px) {
									img {
										font-size: 200%;
										margin-right: 0.4rem;
									}
								}
								p {
									max-width: 20rem;
								}
							`}
						>
							<label>
								<p>{question}</p>
								<RuleInput
									{...{
										engine,
										dottedName,
										onChange: onChange(dottedName),
										onSubmit,
										noSuggestions: false,
									}}
								/>
							</label>
						</div>
					)
				})}
			</div>
		</div>
	)
}
