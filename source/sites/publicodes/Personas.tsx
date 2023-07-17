import AnswerList from '@/components/conversation/AnswerList'
import Title from '@/components/groupe/Title'
import { AppState, Simulation, Situation } from '@/reducers/rootReducer'
import { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { setDifferentSituation } from '../../actions/actions'
import useBranchData from '../../components/useBranchData'
import { useEngine } from '../../components/utils/EngineContext'
import { ScrollToTop } from '../../components/utils/Scroll'
import GridChart from './chart/GridChart'
import RavijenChart from './chart/RavijenChart'
import ActionSlide from './fin/ActionSlide'
import Budget from './fin/Budget'
import FinShareButton from './fin/FinShareButton'
import { CardGrid } from './ListeActionPlus'
import RawActionsList from './personas/RawActionsList'
import Summary from './personas/Summary'

export type Persona = {
	nom: string
	icônes: string
	data: Situation
	description: string
	résumé: string
}

export type Personas = Array<Persona>

const Nothing = () => null

const visualisationChoices = {
	aucun: { titre: 'Aucun', composant: Nothing },
	summary: { titre: 'Description', composant: Summary },
	actionList: { titre: 'Actions associées', composant: RawActionsList },
	profil: { titre: 'Détail Réponses', composant: AnswerList },
	ravijen: { titre: 'Graphe Bilan', composant: RavijenChart },
	budget: { titre: 'Page de fin - Budget', composant: Budget },
	'sous-catégories': { titre: 'Page de fin - Grille', composant: GridChart },
	action: { titre: 'Page de fin - Top 3 actions', composant: ActionSlide },
	emojis: {
		titre: 'Partage RS',
		composant: () => <FinShareButton showResult />,
	},
}

export default () => {
	const selectedPersona = useSelector(
		(state: AppState) => state.simulation?.persona
	)

	const [searchParams, setSearchParams] = useSearchParams({
		visualisation: 'aucun',
	})

	const visualisationParam = searchParams.get('visualisation')

	const VisualisationComponent =
		visualisationChoices[`${visualisationParam}`]?.composant

	const engine = useEngine()

	const visualisationComponentProps = {
		score: engine.evaluate('bilan').nodeValue,
		headlessMode: true,
		engine: engine,
		persona: selectedPersona,
	}

	return (
		<div>
			<ScrollToTop />
			<Title data-cypress-id="personas-title" title={<Trans>Personas</Trans>} />
			<div
				css={`
					display: flex;
					flex-direction: row;
					align-items: center;
					margin-bottom: 1rem;
				`}
			>
				<div>
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
								Sélectionnez un persona et éventuellement un graphique à
								afficher.
							</Trans>
						</em>
					</p>
				</div>
				<div
					className="ui__ card box"
					css={`
						min-width: 16rem;
						align-items: flex-start !important;
						text-align: left !important;
					`}
				>
					{Object.entries(visualisationChoices).map(([id, elt]) => (
						<label key={id}>
							<input
								onChange={() => setSearchParams({ visualisation: id })}
								type="radio"
								value={id}
								checked={searchParams.get('visualisation') === id}
							/>
							{elt.titre}
						</label>
					))}
				</div>
			</div>
			{selectedPersona && (
				<div
					css={`
						max-width: 35rem;
						margin: 0 auto;
						display: flex;
						justify-content: center;
						${visualisationParam === 'ravijen' &&
						`
						height: 45rem;
						`};
					`}
				>
					<VisualisationComponent {...visualisationComponentProps} />
				</div>
			)}
			<PersonaGrid selectedPersona={selectedPersona} />
			<p>
				<Trans i18nKey={'publicodes.Personas.description'}>
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
				<Trans i18nKey={'publicodes.Personas.tuto'}>
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
				<Trans i18nKey={'publicodes.Personas.lienGenerateur'}>
					Pour les prénoms, on peut utiliser{' '}
					<a href="https://lorraine-hipseau.me">ce générateur</a>
				</Trans>
				.
			</p>
		</div>
	)
}

export const PersonaGrid = ({
	selectedPersona,
}: {
	selectedPersona: Persona | undefined
}) => {
	const { i18n } = useTranslation()
	const dispatch = useDispatch(),
		objectif = 'bilan'

	const [personasList, setPersonasList] = useState<Personas>()
	const engine = useEngine()

	const branchData = useBranchData()
	const lang = i18n.language === 'en' ? 'en-us' : i18n.language

	const navigate = useNavigate()
	const [params] = useSearchParams()
	const redirect = params.get('redirect')

	useEffect(() => {
		if (!branchData.loaded) return
		const fileName = `/personas-${lang}.json`

		if (process.env.NODE_ENV === 'development') {
			const json = require('../../../nosgestesclimat/public' + fileName)
			const jsonValues: Personas = Object.values(json)
			setPersonasList(jsonValues)
		} else {
			fetch(branchData.deployURL + fileName, {
				mode: 'cors',
			})
				.then((response) => response.json())
				.then((json) => {
					const jsonValues: Personas = Object.values(json)
					setPersonasList(jsonValues)
				})
				.catch((err) => {
					console.log('url:', branchData.deployURL + `/personas-${lang}.json`)
					console.log('err:', err)
				})
		}
	}, [branchData.deployURL, branchData.loaded, lang])

	if (!personasList) return null

	const setPersona = (persona: Persona) => {
		engine.setSituation({}) // Engine should be updated on simulation reset but not working here, useEngine to be investigated
		const missingVariables = engine.evaluate(objectif).missingVariables ?? {}
		const defaultMissingVariables = Object.keys(missingVariables)

		const newSimulation: Simulation = {
			config: { objectifs: [objectif] },
			url: '/simulateur/bilan',
			// the schema of personas is not fixed yet
			situation: persona.data.situation || persona.data,
			persona: persona,
			// If not specified, act as if all questions were answered : all that is not in
			// the situation object is a validated default value
			foldedSteps: defaultMissingVariables,
		}

		dispatch(setDifferentSituation(newSimulation))

		if (redirect) navigate(redirect)
	}

	return (
		<CardGrid css="padding: 0; justify-content: center">
			{personasList.map((persona) => {
				const { nom, icônes, description, résumé } = persona
				return (
					<li key={nom}>
						<button
							className={`ui__ card box interactive light-border ${
								selectedPersona?.nom === nom ? 'selected' : ''
							}`}
							css={`
								width: 13rem !important;
								height: 15rem !important;
								padding: 0.75rem 0.5rem 0.75rem 0.5rem !important;
								img {
									margin-bottom: 0.5rem;
								}
							`}
							onClick={() => setPersona(persona)}
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
