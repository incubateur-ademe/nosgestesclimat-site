import Route404 from 'Components/Route404'
import { sessionBarMargin } from 'Components/SessionBar'
import 'Components/ui/index.css'
import News from 'Pages/News'
import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, useLocation } from 'react-router'
import { Route, Routes } from 'react-router-dom'
import Provider from '../../Provider'
import {
	persistSimulation,
	retrievePersistedSimulation,
} from '../../storage/persistSimulation'
import Tracker, { devTracker } from '../../Tracker'
import About from './About'
import Actions from './Actions'
import Diffuser from './Diffuser'
import Fin from './fin'
import Landing from './Landing'
import Logo from './Logo'
import Navigation from './Navigation'
const Documentation = React.lazy(() => import('./pages/Documentation'))
import Personas from './Personas.tsx'
import Profil from './Profil.tsx'
import Tutorial from './Tutorial.tsx'
import Simulateur from './Simulateur'
import sitePaths from './sitePaths'
import GroupSwitch from './conference/GroupSwitch'

const ContributionLazy = React.lazy(() => import('./Contribution'))
const ConferenceLazy = React.lazy(() => import('./conference/Conference'))
const StatsLazy = React.lazy(() => import('./pages/Stats'))

const SurveyLazy = React.lazy(() => import('./conference/Survey'))

const CGULazy = React.lazy(() => import('./CGU'))
const PrivacyLazy = React.lazy(() => import('./Privacy.js'))

const GuideGroupeLazy = React.lazy(() => import('./pages/GuideGroupe'))

const DocumentationContexteLazy = React.lazy(
	() => import('./pages/DocumentationContexte')
)

let tracker = devTracker
if (NODE_ENV === 'production') {
	tracker = new Tracker()
}

export default function Root({}) {
	const { language } = useTranslation().i18n
	const paths = sitePaths()

	const urlParams = new URLSearchParams(window.location.search)
	/* This enables loading the rules of a branch,
	 * to showcase the app as it would be once this branch of -data  has been merged*/
	const branch = urlParams.get('branch')
	const pullRequestNumber = urlParams.get('PR')

	const iframeShareData = new URLSearchParams(
		document?.location.search.substring(1)
	).get('shareData')

	const persistedSimulation = retrievePersistedSimulation()
	return (
		<Provider
			tracker={tracker}
			sitePaths={paths}
			reduxMiddlewares={[]}
			onStoreCreated={(store) => {
				//persistEverything({ except: ['simulation'] })(store)
				persistSimulation(store)
			}}
			initialStore={{
				//...retrievePersistedState(),
				previousSimulation: persistedSimulation,
				iframeOptions: { iframeShareData },
				actionChoices: persistedSimulation?.actionChoices || {},
				tutorials: persistedSimulation?.tutorials || {},
				storedTrajets: persistedSimulation?.storedTrajets || {},
			}}
			rulesURL={`https://${
				branch
					? `${branch}--`
					: pullRequestNumber
					? `deploy-preview-${pullRequestNumber}--`
					: ''
			}ecolab-data.netlify.app/co2.json`}
			dataBranch={branch || pullRequestNumber}
		>
			<Main />
		</Provider>
	)
}
const Main = ({}) => {
	const location = useLocation()
	const isHomePage = location.pathname === '/',
		isTuto = location.pathname.indexOf('/tutoriel') === 0

	return (
		<div
			className="ui__ container"
			css={`
				@media (min-width: 800px) {
					display: flex;
					min-height: 100vh;
				}

				@media (min-width: 1200px) {
					${!isHomePage &&
					`
						transform: translateX(-4vw);
						`}
				}
				${!isHomePage && !isTuto && sessionBarMargin}
			`}
		>
			<Navigation isHomePage={isHomePage} />
			<main
				tabIndex="0"
				id="mainContent"
				css={`
					outline: none !important;
					@media (min-width: 800px) {
						flex-grow: 1;
						padding: 1rem;
					}
				`}
			>
				{isHomePage && (
					<nav
						css={`
							display: flex;
							align-items: center;
							justify-content: center;
							text-decoration: none;
							font-size: 170%;
							margin: 1rem auto;
						`}
					>
						<Logo />
					</nav>
				)}
				<Router />
			</main>
		</div>
	)
}

export const Loading = () => <div>Chargement</div>

const Router = ({}) => {
	return (
		<Routes>
			<Route path="/" element={<Landing />} />
			<Route
				path="documentation/*"
				element={
					<Suspense fallback={<div>Chargement</div>}>
						<Documentation />
					</Suspense>
				}
			/>
			<Route path="simulateur/*" element={<Simulateur />} />
			<Route path="/stats">
				<Suspense fallback="Chargement">
					<StatsLazy />
				</Suspense>
			</Route>
			{/* Lien de compatibilité, à retirer par exemple mi-juillet 2020*/}
			<Route path="/fin/*" element={<Fin />} />
			<Route path="/personas" element={<Personas />} />
			<Route path="/actions" element={<Actions />} />
			<Route path="/contribuer/*">
				<Suspense fallback={<Loading />}>
					<ContributionLazy />
				</Suspense>
			</Route>
			<Route path="/à-propos" element={<About />} />
			<Route path="/cgu">
				<Suspense fallback={<div>Chargement</div>}>
					<CGULazy />
				</Suspense>
			</Route>
			<Route path="/partenaires" element={<Diffuser />} />
			<Route path="/diffuser" element={<Diffuser />} />
			<Route path={encodeURIComponent('/vie-privée')}>
				<Suspense fallback={<div>Chargement</div>}>
					<PrivacyLazy />
				</Suspense>
			</Route>
			<Route path={encodeURIComponent('/nouveautés')} element={<News />} />
			<Route path="/profil" element={<Profil />} />
			{/* Here we define this specific route for the context documentation before generic groupe routes */}
			<Route path="/groupe/documentation-contexte">
				<Suspense fallback={<div>Chargement</div>}>
					<DocumentationContexteLazy />
				</Suspense>
			</Route>
			<Route path="/guide/*">
				<Suspense fallback={<Loading />}>
					<GuideGroupeLazy />
				</Suspense>
			</Route>
			<Route path="/conférence/:room">
				<Suspense fallback={<Loading />}>
					<ConferenceLazy />
				</Suspense>
			</Route>
			<Route path="/groupe/:room">
				<GroupSwitch />
			</Route>
			<Route path="/sondage/:room">
				<Suspense fallback={<Loading />}>
					<SurveyLazy />
				</Suspense>
			</Route>
			<Route path="/tutoriel" element={<Tutorial />} />
			<Route element={Route404} />
		</Routes>
	)
}
