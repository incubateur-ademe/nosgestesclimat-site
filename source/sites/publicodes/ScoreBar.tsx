import { useEngine } from 'Components/utils/EngineContext'
import { utils } from 'publicodes'
import { useState } from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { correctValue, splitName } from '../../components/publicodesUtils'
import ScoreExplanation from '../../components/ScoreExplanation'
import { buildEndURL } from '../../components/SessionBar'
import { lightenColor } from '../../components/utils/colors'
import {
	objectifsSelector,
	situationSelector,
} from '../../selectors/simulationSelectors'
import HumanWeight, { DiffHumanWeight } from './HumanWeight'
import PetrolScore from './PetrolScore'

const openmojis = {
	questionCircle: '2754',
}

const openmojiURL = (name) => `/images/${openmojis[name]}.svg`

export default ({ actionMode = false, demoMode = false }) => {
	const objectif =
			actionMode || demoMode ? 'bilan' : useSelector(objectifsSelector)[0],
		// needed for this component to refresh on situation change :
		situation = useSelector(situationSelector),
		engine = useEngine(),
		rules = useSelector((state) => state.rules),
		evaluation = engine.evaluate(objectif),
		{ nodeValue: rawNodeValue, dottedName, unit, rawNode } = evaluation
	const actionChoices = useSelector((state) => state.actionChoices)

	const nodeValue = correctValue({ nodeValue: rawNodeValue, unit })

	const category = rules[splitName(dottedName)[0]],
		color = category && category.couleur

	const [openExplanation, setOpenExplanation] = useState(false)

	return (
		<div>
			<div
				css={`
					${!demoMode &&
					`
				margin-bottom: 1.2rem;
				@media (max-width: 800px) {
					margin: 0;
					
					position: fixed;
					bottom: 4rem;
					left: 0;
					z-index: 10;
					width: 100%;
				}`}

					color: var(--textColor);
					a {
						color: inherit;
						height: 100%;
						text-decoration: none;
						padding: 0.4rem;
					}
					text-align: center;
					box-shadow: 2px 2px 10px #bbb;
				`}
			>
				<div
					css={`
						display: flex;
						justify-content: space-evenly;
						align-items: center;
					`}
				>
					<div
						css={`
							display: flex;
							align-items: center;
							justify-content: center;
							flex-grow: 1;
							background: rgba(0, 0, 0, 0)
								linear-gradient(
									60deg,
									${color ? lightenColor(color, -20) : 'var(--lightColor)'} 0%,
									${color ? color : 'var(--color)'} 100%
								)
								repeat scroll 0% 0%;
						`}
					>
						<Link
							css={`
								display: flex;
								align-items: center;
								justify-content: center;
								color: white !important;
							`}
							to={demoMode ? '#' : buildEndURL(rules, engine)}
							title="Page de fin de simulation principale"
						>
							<img
								src={'/images/climate-change-small.svg'}
								css="width:3rem;margin-right: .8rem;"
								alt="Planète représentant le changement climatique"
							/>
							{!actionMode ? (
								<div css="width: 8rem">
									<HumanWeight
										nodeValue={nodeValue}
										overrideValue={
											actionMode && actionTotal !== 0 && actionTotal
										}
									/>
								</div>
							) : (
								<DiffHumanWeight
									{...{ nodeValue, engine, rules, actionChoices }}
								/>
							)}
						</Link>
						<button
							title="Afficher l'explication du score"
							onClick={() => setOpenExplanation(!openExplanation)}
							css={`
								position: relative;
								right: 0.5rem;
							`}
						>
							<img
								src={openmojiURL('questionCircle')}
								css="width:1.5rem;"
								alt="Point d'interrogation"
							/>
						</button>
					</div>
					<PetrolScore
						endURL={demoMode ? '#' : buildEndURL(rules, engine, 'petrogaz')}
					/>
					{/* TODO désactivation de l'explication dans le contexte de l'ajout du pétrole : mieux vaut sûrement 
				mettre le lien d'explication sur l'écran vers lequel les deux métriques pointent. Probablement deux diapo 
				de la page fin.

				{!demoMode && !actionMode && (
					<DocumentationLink dottedName={dottedName} />
				)}
				*/}
				</div>
			</div>
			<ScoreExplanation
				openExplanation={openExplanation}
				setOpenExplanation={setOpenExplanation}
			/>
		</div>
	)
}

const DocumentationLink = ({ dottedName }) => (
	<div>
		<Link to={'/documentation/' + utils.encodeRuleName(dottedName)}>
			<span css="font-size: 140%" alt="Comprendre le calcul">
				{emoji('❔ ')}
			</span>
			<small
				css={`
					color: var(--textColor);
					@media (max-width: 800px) {
						display: none;
					}
				`}
			>
				Comprendre le calcul
			</small>
		</Link>
	</div>
)
