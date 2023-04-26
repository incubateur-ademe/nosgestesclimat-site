import { useEngine } from 'Components/utils/EngineContext'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { correctValue, splitName } from '../../components/publicodesUtils'
import ScoreExplanation from '../../components/ScoreExplanation'
import { buildEndURL } from '../../components/SessionBar'
import { lightenColor } from '../../components/utils/colors'
import { TrackingContext } from '../../contexts/TrackingContext'
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
		actionMode || demoMode ? 'bilan' : useSelector(objectifsSelector)[0]
	// needed for this component to refresh on situation change :
	const situation = useSelector(situationSelector)
	const engine = useEngine()
	const rules = useSelector((state) => state.rules),
		evaluation = engine.evaluate(objectif),
		{ nodeValue: rawNodeValue, dottedName, unit } = evaluation
	const actionChoices = useSelector((state) => state.actionChoices)

	const nodeValue = correctValue({ nodeValue: rawNodeValue, unit })

	const category = rules[splitName(dottedName)[0]],
		color = category && category.couleur

	const { t } = useTranslation()
	const [openExplanation, setOpenExplanation] = useState(false)

	const { trackEvent } = useContext(TrackingContext)
	const tutorials = useSelector((state) => state.tutorials)

	const situationLength = Object.keys(situation).length

	useEffect(() => {
		if (objectif === 'bilan' && !tutorials['scoreExplanation']) {
			setTimeout(() => setOpenExplanation(true), 1200)
		}
	}, [tutorials])

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
				}

			@media (max-height: 600px) and (max-width: 800px) {

			bottom: 2rem

			}

				`}

					color: var(--textColor);
					a {
						color: inherit;
						height: 100%;
						text-decoration: none;
						padding: 0.4rem;
					}
					text-align: center;
				`}
			>
				<div
					css={`
						display: flex;
						justify-content: space-evenly;
						align-items: center;
						box-shadow: 2px 2px 10px #bbb;
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
							title={t('Page de fin de simulation principale')}
						>
							<img
								src={'/images/climate-change-small.svg'}
								css="width:3rem;margin-right: .8rem;"
								alt={t('Planète représentant le changement climatique')}
							/>
							{!actionMode ? (
								<HumanWeight
									nodeValue={nodeValue}
									overrideValue={actionMode && actionTotal !== 0 && actionTotal}
								/>
							) : (
								<DiffHumanWeight
									{...{ nodeValue, engine, rules, actionChoices }}
								/>
							)}
						</Link>
						{!demoMode && (
							<button
								title={t("Afficher l'explication du score")}
								onClick={() => {
									setOpenExplanation(!openExplanation)
									trackEvent(['trackEvent', 'NGC', 'Clic explication score'])
								}}
								css={`
									position: relative;
									right: 0.5rem;
								`}
							>
								<img
									src={openmojiURL('questionCircle')}
									css="width:1.5rem;"
									alt={t("Point d'interrogation")}
								/>
							</button>
						)}
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
				<ScoreExplanation
					openExplanation={openExplanation}
					setOpenExplanation={setOpenExplanation}
					situationLength={situationLength}
				/>
			</div>
		</div>
	)
}
