import { resetSimulation } from 'Actions/actions'
import { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { setDifferentSituation } from '../../actions/actions'
import IllustratedMessage from '../../components/ui/IllustratedMessage'
import useBranchData from '../../components/useBranchData'
import { useEngine } from '../../components/utils/EngineContext'
import { ScrollToTop } from '../../components/utils/Scroll'
import { situationSelector } from '../../selectors/simulationSelectors'
import RavijenChart from './chart/RavijenChart'
import ActionSlide from './fin/ActionSlide'
import Budget from './fin/Budget'
import FinShareButton from './fin/FinShareButton'
import { CardGrid } from './ListeActionPlus'

const Nothing = () => null
const visualisationChoices = {
	budget: Budget,
	'sous-catégories': RavijenChart,
	emojis: () => <FinShareButton showResult />,

	action: ActionSlide,

	aucun: Nothing,
}

export default ({}) => {
	const persona = useSelector((state) => state.simulation?.persona)
	const [searchParams, setSearchParams] = useSearchParams({
		visualisation: 'aucun',
	})

	const Visualisation = visualisationChoices[searchParams.get('visualisation')]
	const engine = useEngine()

	const slideProps = {
		score: engine.evaluate('bilan').nodeValue,
		headlessMode: true,
	}

	return (
		<div>
			<ScrollToTop />
			<h1>Personas</h1>
			<p>
				<em>
					Sélectionnez un persona et éventuellement un graphique à afficher.
				</em>
			</p>
			<form>
				{Object.keys(visualisationChoices).map((name) => (
					<label>
						<input
							onClick={() => setSearchParams({ visualisation: name })}
							type="radio"
							value={name}
							checked={searchParams.get('visualisation') === name}
						/>
						{name}
					</label>
				))}
			</form>
			{persona && (
				<div css="max-width: 35rem; margin: 0 auto">
					<Visualisation {...slideProps} />
				</div>
			)}
			<PersonaGrid />
			<p>
				Les personas nous permettront de prendre le parti d'une diversité
				d'utilisateurs quand ils voient notamment notre écran "passer à
				l'action".
			</p>
			<h2>Comment créer un persona ?</h2>
			<p>
				C'est dans le fichier{' '}
				<a href="https://github.com/datagir/nosgestesclimat-site/blob/master/source/sites/publicodes/personas.yaml">
					personas.yaml
				</a>{' '}
				que ça se passe. On peut soit copier coller les données d'un autre
				persona et les modifier, soit en créer un de zéro depuis la simulation.
				Une fois la simulation satisfaisante, cliquer sur "Modifier mes
				réponses" puis taper Ctrl-C, ouvrir la console du navigateur (F12),
				vérifiez bien que vous êtes dans l'onglet "Console", allez tout en bas
				de la console (elle est un peu chargée...), puis copier le JSON affiché,
				le coller dans <a href="https://www.json2yaml.com">cet outil</a> pour
				générer un YAML, puis l'insérer dans personas.yaml.
			</p>
			<p>
				Pour les prénoms, on peut utiliser{' '}
				<a href="https://lorraine-hipseau.me">ce générateur</a>.
			</p>
		</div>
	)
}

export const PersonaGrid = ({
	additionnalOnClick,
	warningIfSituationExists,
}) => {
	const dispatch = useDispatch(),
		objectif = 'bilan'
	const selectedPersona = useSelector((state) => state.simulation?.persona)

	const situation = useSelector(situationSelector)
	const [data, setData] = useState()
	const [warning, setWarning] = useState(false)
	const engine = useEngine()

	const branchData = useBranchData()

	useEffect(() => {
		if (!branchData.loaded) return
		if (NODE_ENV === 'development' && branchData.shouldUseLocalFiles) {
			const personas = require('../../../nosgestesclimat/personas.yaml').default

			setData(personas)
		} else {
			fetch(branchData.deployURL + '/personas.json', {
				mode: 'cors',
			})
				.then((response) => response.json())
				.then((json) => {
					setData(json)
				})
		}
	}, [branchData.deployURL, branchData.loaded, branchData.shouldUseLocalFiles])

	if (!data) return null

	const personasRules = Object.values(data)

	const setPersona = (persona) => {
		engine.setSituation({}) // Engine should be updated on simulation reset but not working here, useEngine to be investigated
		const { nom, icônes, data, description } = persona
		const missingVariables = engine.evaluate(objectif).missingVariables ?? {}
		const defaultMissingVariables = Object.entries(missingVariables).map(
			(arr) => {
				return arr[0]
			}
		)
		dispatch(
			setDifferentSituation({
				config: { objectifs: [objectif] },
				url: '/simulateur/bilan',
				// the schema of peronas is not fixed yet
				situation: data.situation || data,
				persona: nom,
				foldedSteps: defaultMissingVariables, // If not specified, act as if all questions were answered : all that is not in the situation object is a validated default value
			})
		)
	}
	const hasSituation = Object.keys(situation).length
	if (warning)
		return (
			<IllustratedMessage
				emoji="⚠️"
				message={
					<div>
						<p>
							Attention, vous avez une simulation en cours : sélectionner un
							persona écrasera votre simulation.{' '}
						</p>{' '}
						<button
							className="ui__ button simple"
							onClick={() => {
								dispatch(resetSimulation())
								setPersona(warning)
								setWarning(false)
							}}
						>
							Continuer
						</button>
						<button
							className="ui__ button simple"
							onClick={() => setWarning(false)}
						>
							Annuler
						</button>
					</div>
				}
			/>
		)

	return (
		<CardGrid css="padding: 0; justify-content: center">
			{personasRules.map((persona) => {
				const { nom, icônes, data, description, résumé } = persona
				return (
					<li key={nom}>
						<button
							className={`ui__ card box interactive light-border ${
								selectedPersona === persona.nom ? 'selected' : ''
							}`}
							css={`
								width: 11rem !important;
								height: 15rem !important;
								padding: 1rem 0.75rem 1rem 0.75rem !important;
								${nom === persona
									? `border: 2px solid var(--color) !important`
									: ``};
							`}
							onClick={() =>
								warningIfSituationExists && hasSituation
									? setWarning(persona)
									: setPersona(persona)
							}
						>
							<div
								css={`
									text-transform: uppercase;
									color: var(--color);
									font-size: 90%;
								`}
							>
								<div>{emoji(icônes || '👥')}</div>
								<div>{nom}</div>
							</div>
							<p>
								<small>{résumé || description}</small>
							</p>
						</button>
					</li>
				)
			})}
		</CardGrid>
	)
}
