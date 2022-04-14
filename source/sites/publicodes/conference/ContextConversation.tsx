import Engine from 'publicodes'
import { createContext, useState, useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import RuleInput from 'Components/conversation/RuleInput'
import { setSimulationConfig } from 'Actions/actions'
import { useNextQuestions } from '../../../components/utils/useNextQuestion'
import emoji from 'react-easy-emoji'

export default ({ rules, surveyRule }) => {
	const engine = new Engine(rules)
	const SituationContext = createContext({})
	const [situation, setSituation] = useState({})

	const nextQuestions = useNextQuestions([surveyRule], engine)

	return (
		<div className="ui__ container" css={``}>
			<SituationContext.Provider value={[situation, setSituation]}>
				<Main
					nextQuestions={nextQuestions}
					engine={engine}
					SituationContext={SituationContext}
				/>
			</SituationContext.Provider>
			{/* <TopBar />
			<SituationContext.Provider value={[situation, setSituation]}>
				<Meta
					title="Comprendre le prix à la pompe"
					description="Comprendre comment le prix de l'essence et du gazole à la pompe est calculé."
				/>
				<Main />

				<div css=" text-align: center; margin-top: 3rem">
					Comprendre le calcul <Emoji e="⬇️" />
				</div>
				<h2>Explications</h2>
				<Documentation
					documentationPath="/carburants"
					engine={engine}
					embedded
				/>
			</SituationContext.Provider> */}
		</div>
	)
}

const Main = ({ nextQuestions, engine, SituationContext }) => (
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

		<Questions
			nextQuestions={nextQuestions}
			engine={engine}
			SituationContext={SituationContext}
		/>
	</main>
)

const Questions = ({ nextQuestions, engine, SituationContext }) => {
	const questions = nextQuestions
	const [situation, setSituation] = useContext(SituationContext)
	engine.setSituation(situation) // I don't understand why putting this in a useeffect produces a loop when the input components, due to Input's debounce function I guess.
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
					console.log(engine.evaluate(dottedName))
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
