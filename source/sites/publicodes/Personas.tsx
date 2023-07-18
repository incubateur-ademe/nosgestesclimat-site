import AnswerList from '@/components/conversation/AnswerList'
import Title from '@/components/groupe/Title'
import { AppState, Simulation, Situation } from '@/reducers/rootReducer'
import { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import yaml from 'yaml'
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
import { getQuestionList } from './pages/QuestionList'
import RawActionsList from './personas/RawActionsList'
import RulesCompletion from './personas/RulesCompletion'
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
	exhaustivite: {
		titre: 'Exhaustivité des règles',
		composant: RulesCompletion,
	},
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
	const rules = useSelector((state: AppState) => state.rules)
	const rawQuestionList = getQuestionList(engine, rules)
	const personasQuestionList = rawQuestionList.reduce((obj, rule) => {
		if (!rule.type.includes('Mosaïque')) {
			obj[rule.dottedName] = ''
		}
		return obj
	}, {})

	const visualisationComponentProps = {
		score: engine.evaluate('bilan').nodeValue,
		headlessMode: true,
		engine: engine,
		rules: rules,
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
					@media (max-width: 800px) {
						flex-direction: column;
					}
				`}
			>
				<div>
					<p>
						<Trans>
							Les personas nous servent à tester le simulateur sous toutes ses
							coutures, et à vérifier qu’il s’adapte bien à toutes les
							situations de vie des citoyens métropolitains. De par leur
							présence, ils nous forcent à penser à tous les cas d’usage, pour
							nous projeter dans différentes réalités, et inclure ces réalités
							dans nos refontes du parcours de test et des actions proposées à
							la fin de ce dernier.{' '}
						</Trans>
					</p>
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
			<PersonaExplanations personasQuestionList={personasQuestionList} />
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
		<CardGrid
			css={`
				padding: 0;
				justify-content: center;
				li {
					margin: 0.4rem;
				}
			`}
		>
			{personasList.map((persona) => {
				const { nom, icônes, description, résumé } = persona
				return (
					<li key={nom}>
						<button
							className={`ui__ card box interactive light-border ${
								selectedPersona?.nom === nom ? 'selected' : ''
							}`}
							css={`
								width: 11rem !important;
								height: 13rem !important;
								padding: 0.5rem 0.25rem 0.5rem 0.25rem !important;
								margin: 0 !important;
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
									font-size: 80%;
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

export const PersonaExplanations = (personasQuestionList) => {
	return (
		<div
			css={`
				h2 {
					display: inline;
				}
				details {
					padding-bottom: 1rem;
				}
			`}
		>
			<details>
				<summary>
					<h2>
						<Trans>Qui sont-ils ?</Trans>
					</h2>
				</summary>
				<div>
					<Trans i18nKey={'publicodes.Personas.description'}>
						Nous les avons définis pour qu’ils représentent la diversité des cas
						d’usage du simulateur.{' '}
						<i>
							Toute ressemblance avec une personne existant ou ayant existé
							serait purement fortuite !
						</i>{' '}
						En aucune mesure, on ne peut dire qu’ils sont représentatifs de la
						distribution de la population française : il ne s’agit pas de coller
						aux statistiques de la population, mais de retrouver parmi nos dix
						personas au moins un qui représente chaque usage majeur et
						différenciant pour le simulateur. Ainsi, nous avons fait varier pour
						chacun d’entre eux :
						<ul>
							<li>
								Leur genre : même s’il n’influe pas sur l’empreinte, il serait
								étonnant de n’avoir que des personas “femmes”.
							</li>{' '}
							<li>
								Leur âge et situation personnelle / professionnelle : au moins
								un étudiant, un retraité, un adulte au foyer
							</li>{' '}
							<li>
								La taille de leur foyer : de 1 personne à famille nombreuse
							</li>{' '}
							<li>
								Leur lieu de vie : de l’urbain, du rural et du péri-urbain, dans
								le nord, dans le sud, les plaines, la montagne et sur une île
							</li>{' '}
							<li>
								Leur logement : de l’appartement à la maison, du neuf à l’ancien
							</li>
							<li>
								Leurs modes de transport : de la marche à la voiture en passant
								par le ferry et l’avion
							</li>{' '}
							<li>
								Leur régime alimentaire : au moins un végétalien, un végétarien,
								une personne ne mangeant que du poisson, et un amateur de viande
								rouge
							</li>{' '}
							<li>
								Leur tendance à l’achat : du tout occasion au tout neuf, de
								l’acheteur compulsif à celui ou celle qui n’achète presque rien
							</li>{' '}
							<li>
								Leur façon de partir en vacances : mode de transport,
								hébergement, on trouve de tout
							</li>{' '}
							<li>Leurs loisirs : de la culture, du sport, du bien-être…</li>
						</ul>
					</Trans>
				</div>
			</details>
			<details>
				<summary>
					<h2>
						<Trans>Comment créer un persona ?</Trans>
					</h2>
				</summary>
				<div>
					<Trans>C'est dans le fichier</Trans>{' '}
					<a href="https://github.com/datagir/nosgestesclimat-site/blob/master/source/sites/publicodes/personas.yaml">
						personas.yaml
					</a>{' '}
					<Trans i18nKey={'publicodes.Personas.tuto'}>
						que ça se passe. On peut soit copier coller les données d'un autre
						persona et les modifier, soit en créer un de zéro depuis la
						simulation. Une fois la simulation satisfaisante, cliquer sur
						"Modifier mes réponses" puis taper Ctrl-C, ouvrir la console du
						navigateur (F12), vérifiez bien que vous êtes dans l'onglet
						"Console", allez tout en bas de la console (elle est un peu
						chargée...), puis copier le JSON affiché, le coller dans{' '}
						<a href="https://www.json2yaml.com">cet outil</a> pour générer un
						YAML, puis l'insérer dans personas.yaml.
					</Trans>
				</div>
				<p>
					<Trans i18nKey={'publicodes.Personas.lienGenerateur'}>
						Pour les prénoms, on peut utiliser{' '}
						<a href="https://lorraine-hipseau.me">ce générateur</a>
					</Trans>
					.
				</p>
			</details>
			<details>
				<summary>
					<h2>
						<Trans>Quelle est la liste des questions du modèle ?</Trans>
					</h2>
				</summary>
				<div>
					<Trans i18nKey={'publicodes.Personas.listeQuestions'}>
						La liste des questions du modèle est accessible sur la page{' '}
						<a href="/questions">/questions</a>
					</Trans>
					. La liste exhaustive de toutes les règles pour définir un persona est
					:
				</div>
				<pre
					className="ui__ code"
					css={`
						font-size: 90%;
						height: 10rem;
					`}
				>
					<code>{yaml.stringify(personasQuestionList)}</code>
				</pre>
				<button
					className="ui__ button small"
					onClick={() => {
						navigator.clipboard.writeText(JSON.stringify(personasQuestionList))
					}}
				>
					<Trans>Copier le YAML</Trans>
				</button>
			</details>
			<details>
				<summary>
					<h2>
						<Trans>Comment les mettons-nous à jour ?</Trans>
					</h2>
				</summary>
				<div>
					<Trans i18nKey={'publicodes.Personas.maj'}>
						Pour qu’ils ou elles continuent de représenter la diversité des cas
						d’usage du simulateur d’empreinte carbone, nous les éditons à chaque
						ajout ou modification de ce dernier, en respectant les règles
						suivantes :
						<ul>
							<li>
								Chaque réponse possible est attribuée à au moins un persona
							</li>{' '}
							<li>
								Au moins un persona ne répond rien à la question (il lui est
								donc attribué la valeur par défaut donnée dans le simulateur).
							</li>
						</ul>
					</Trans>
				</div>
			</details>
		</div>
	)
}
