import { useEngine } from 'Components/utils/EngineContext'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { correctValue, splitName } from '../../components/publicodesUtils'
import { buildEndURL } from '../../components/SessionBar'
import { lightenColor } from '../../components/utils/colors'
import { objectifsSelector } from '../../selectors/simulationSelectors'
import HumanWeight, { DiffHumanWeight } from './HumanWeight'
import PetrolScore from './PetrolScore'

export default ({ actionMode = false, demoMode = false }) => {
	const objectif =
		actionMode || demoMode ? 'bilan' : useSelector(objectifsSelector)[0]
	// needed for this component to refresh on situation change :
	const engine = useEngine()
	console.log('engine:', engine)
	const rules = useSelector((state) => state.rules),
		evaluation = engine.evaluate(objectif),
		{ nodeValue: rawNodeValue, dottedName, unit } = evaluation
	const actionChoices = useSelector((state) => state.actionChoices)

	const nodeValue = correctValue({ nodeValue: rawNodeValue, unit })

	const category = rules[splitName(dottedName)[0]],
		color = category && category.couleur

	const { t } = useTranslation()

	return (
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
					height: 4rem;
					> a {
						height: 100%;
						text-decoration: none;
						padding: 0.4rem;
					}
				`}
			>
				<Link
					css={`
						flex-grow: 1;
						background: rgba(0, 0, 0, 0)
							linear-gradient(
								60deg,
								${color ? lightenColor(color, -20) : 'var(--lightColor)'} 0%,
								${color ? color : 'var(--color)'} 100%
							)
							repeat scroll 0% 0%;
						color: white !important;
					`}
					to={demoMode ? '#' : buildEndURL(rules, engine)}
					title={t('Page de fin de simulation principale')}
				>
					<div css="display:flex; align-items:center; justify-content: center">
						<img
							src={'/images/climate-change-small.svg'}
							css="width:3rem;margin-right: .8rem;"
							alt={t('Planète représentant le changement climatique')}
						/>
						{!actionMode ? (
							<div css="width: 8rem">
								<HumanWeight
									nodeValue={nodeValue}
									overrideValue={actionMode && actionTotal !== 0 && actionTotal}
								/>
							</div>
						) : (
							<DiffHumanWeight
								{...{ nodeValue, engine, rules, actionChoices }}
							/>
						)}
					</div>
				</Link>
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
	)
}
