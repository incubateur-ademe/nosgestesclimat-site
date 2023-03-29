import { resetSimulation } from 'Actions/actions'
import { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'
import { setDifferentSituation } from '../../actions/actions'
import IllustratedMessage from '../../components/ui/IllustratedMessage'
import useBranchData from '../../components/useBranchData'
import { useEngine } from '../../components/utils/EngineContext'
import { ScrollToTop } from '../../components/utils/Scroll'
import { situationSelector } from '../../selectors/simulationSelectors'
import GridChart from './chart/GridChart'
import RavijenChart from './chart/RavijenChart'
import ActionSlide from './fin/ActionSlide'
import Budget from './fin/Budget'
import FinShareButton from './fin/FinShareButton'
import { CardGrid } from './ListeActionPlus'

const Nothing = () => null
const visualisationChoices = {
	ravijen: RavijenChart,
	budget: Budget,
	'sous-catégories': GridChart,
	emojis: () => <FinShareButton showResult />,

	action: ActionSlide,

	aucun: Nothing,
}

export default ({}) => {
	const persona = useSelector((state) => state.simulation?.persona)
	const [searchParams, setSearchParams] = useSearchParams({
		visualisation: 'aucun',
	})

	const visualisationParam = searchParams.get('visualisation')
	const Visualisation = visualisationChoices[`${visualisationParam}`]

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
				<Trans>
					Cette page vous permet de naviguer les parcours Nos Gestes Climat
					comme si vous étiez l'un des profils types que nous avons listés.
				</Trans>
			</p>
			<p>
				➡️{' '}
				<em>
					<Trans>
						Sélectionnez un persona et éventuellement un graphique à afficher.
					</Trans>
				</em>
			</p>
			<form>
				🧮
				{Object.keys(visualisationChoices).map((name) => (
					<label key={name}>
						<input
							onChange={() => setSearchParams({ visualisation: name })}
							type="radio"
							value={name}
							checked={searchParams.get('visualisation') === name}
						/>
						{name}
					</label>
				))}
			</form>
			{persona && (
				<div
					css={`
						max-width: 35rem;
						margin: 0 auto;
						${visualisationParam === 'ravijen' &&
						`
						height: 45rem; 
						max-width: none;
						`}
					`}
				>
					<Visualisation {...slideProps} />
				</div>
			)}
			<PersonaGrid />
			<p>
				<Trans i18nKey={`publicodes.Personas.description`}>
					Les personas nous permettront de prendre le parti d'une diversité
					d'utilisateurs quand ils voient notamment notre écran "passer à
					l'action".
				</Trans>
			</p>
			<h2>
				<Trans>Comment créer un persona ?</Trans>
			</h2>
			<p>
				<Trans>C'est dans le fichier</Trans>{' '}
				<a href="https://github.com/datagir/nosgestesclimat-site/blob/master/source/sites/publicodes/personas.yaml">
					personas.yaml
				</a>{' '}
				<Trans i18nKey={`publicodes.Personas.tuto`}>
					que ça se passe. On peut soit copier coller les données d'un autre
					persona et les modifier, soit en créer un de zéro depuis la
					simulation. Une fois la simulation satisfaisante, cliquer sur
					"Modifier mes réponses" puis taper Ctrl-C, ouvrir la console du
					navigateur (F12), vérifiez bien que vous êtes dans l'onglet "Console",
					allez tout en bas de la console (elle est un peu chargée...), puis
					copier le JSON affiché, le coller dans{' '}
					<a href="https://www.json2yaml.com">cet outil</a> pour générer un
					YAML, puis l'insérer dans personas.yaml.
				</Trans>
			</p>
			<p>
				<Trans i18nKey={`publicodes.Personas.lienGenerateur`}>
					Pour les prénoms, on peut utiliser{' '}
					<a href="https://lorraine-hipseau.me">ce générateur</a>
				</Trans>
				.
			</p>
		</div>
	)
}

export const PersonaGrid = ({
	additionnalOnClick,
	warningIfSituationExists,
}) => {
	const { i18n } = useTranslation()
	const dispatch = useDispatch(),
		objectif = 'bilan'
	const selectedPersona = useSelector((state) => state.simulation?.persona)

	const situation = useSelector(situationSelector)
	const [data, setData] = useState()
	const [warning, setWarning] = useState(false)
	const engine = useEngine()

	const branchData = useBranchData()
	const lang = i18n.language === 'en' ? 'en-us' : i18n.language

	useEffect(() => {
		if (!branchData.loaded) return

		fetch(branchData.deployURL + `/personas-${lang}.json`, {
			mode: 'cors',
		})
			.then((response) => response.json())
			.then((json) => {
				setData(json)
			})
			.catch((err) => {
				console.log('url:', branchData.deployURL + `/personas-${lang}.json`)
				console.log('err:', err)
			})
	}, [branchData.deployURL, branchData.loaded, lang])

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
				emoji="ℹ️"
				message={
					<div>
						<p>
							<Trans i18nKey={'publicodes.Personas.warningMsg'}>
								Sélectionner un persona releguera votre simulation en cours dans
								votre historique de simulations, accessible en bas de votre{' '}
								<Link to="/profil">page profil</Link>.
							</Trans>
						</p>
						<button
							className="ui__ button simple"
							onClick={() => {
								dispatch(resetSimulation())
								setPersona(warning)
								setWarning(false)
							}}
						>
							<Trans>J'ai compris</Trans>
						</button>
						<button
							className="ui__ button simple"
							onClick={() => setWarning(false)}
						>
							<Trans>Annuler</Trans>
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
