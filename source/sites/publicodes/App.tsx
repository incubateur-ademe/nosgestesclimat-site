import Logo from 'Components/Logo'
import Route404 from 'Components/Route404'
import { sessionBarMargin } from 'Components/SessionBar'
import 'Components/ui/index.css'
import React, { Suspense, useContext, useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { Route, Routes, useSearchParams } from 'react-router-dom'
import AnimatedLoader from '../../AnimatedLoader'
import Footer from '../../components/Footer'
import LangSwitcher from '../../components/LangSwitcher'
import LocalisationMessage from '../../components/localisation/LocalisationMessage'
import TranslationAlertBanner from '../../components/TranslationAlertBanner'
import useMediaQuery from '../../components/utils/useMediaQuery'
import { TrackerContext } from '../../components/utils/withTracker'
import Provider from '../../Provider'
import { WithEngine } from '../../RulesProvider'
import {
	persistUser,
	fetchUser,
} from '../../storage/persistSimulation'
import Tracker, { devTracker } from '../../Tracker'
import {
	changeLangTo,
	getLangFromAbreviation,
	getLangInfos,
	Lang,
} from './../../locales/translation'
import GroupModeSessionVignette from './conference/GroupModeSessionVignette'
import Landing from './Landing'
import Navigation from './Navigation'
import About from './pages/About'
import Diffuser from './pages/Diffuser'
import Profil from './Profil.tsx'
import sitePaths from './sitePaths'
import TranslationContribution from './TranslationContribution'

// All those lazy components, could be probably be handled another more consise way
// Also, see this issue about migrating to SSR https://github.com/datagir/nosgestesclimat-site/issues/801

const ActionsLazy = React.lazy(() => import('./Actions'))
const FinLazy = React.lazy(() => import('./fin'))
const SimulateurLazy = React.lazy(() => import('./Simulateur'))
const PetrogazLandingLazy = React.lazy(() => import('./pages/PetrogazLanding'))
const ModelLazy = React.lazy(() => import('./Model'))
const PersonasLazy = React.lazy(() => import('./Personas'))
const DocumentationLazy = React.lazy(() => import('./pages/Documentation'))
const TutorialLazy = React.lazy(() => import('./Tutorial'))
const GroupSwitchLazy = React.lazy(() => import('./conference/GroupSwitch'))
const ContributionLazy = React.lazy(() => import('./Contribution'))
const ConferenceLazy = React.lazy(() => import('./conference/Conference'))
const StatsLazy = React.lazy(() => import('./pages/Stats'))
const SurveyLazy = React.lazy(() => import('./conference/Survey'))
const CGULazy = React.lazy(() => import('./pages/CGU'))
const PrivacyLazy = React.lazy(() => import('./pages/Privacy'))
const AccessibilityLazy = React.lazy(() => import('./pages/Accessibility'))
const GuideGroupeLazy = React.lazy(() => import('./pages/GuideGroupe'))
const DocumentationContexteLazy = React.lazy(
	() => import('./pages/DocumentationContexte')
)
const News = React.lazy(() => import('Pages/News'))

let tracker = devTracker

if (NODE_ENV === 'production') {
	tracker = new Tracker()
}

// Do not export anything else than React components here. Exporting isFulidLayout breaks the hot reloading

export default function Root({}) {
	const paths = sitePaths()

	const iframeShareData = new URLSearchParams(
		document?.location.search.substring(1)
	).get('shareData')

	const persistedUser = fetchUser();
	const persistedSimulation = persistedUser.simulations.filter(
		(simulation) => simulation.id === persistedUser.currentSimulationId
	)[0]

	const currentLang =
	persistedUser?.currentLang ??
		getLangFromAbreviation(
			window.FORCE_LANGUAGE || window.navigator.language.toLowerCase()
		)

	return (
		<Provider
			tracker={tracker}
			sitePaths={paths}
			reduxMiddlewares={[]}
			onStoreCreated={(store) => {
				persistUser(store)
			}}
			initialStore={{
				simulation: persistedSimulation,
				simulations: persistedUser.simulations,
				currentSimulationId: persistedUser.currentSimulationId,
				tutorials: persistedUser.tutorials,
				localisation: persistedUser.localisation,
				currentLang,
				iframeOptions: { iframeShareData },
				actionChoices: persistedSimulation?.actionChoices ?? {},
				storedTrajets: persistedSimulation?.storedTrajets ?? {},
				conference: persistedSimulation?.conference,
				survey: persistedSimulation?.survey,
			}}
		>
			<Main />
		</Provider>
	)
}

export const isFluidLayout = (encodedPathname) => {
	const pathname = decodeURIComponent(encodedPathname)

	return (
		pathname === '/' ||
		pathname.startsWith('/nouveautés') ||
		pathname.startsWith('/documentation')
	)
}

const Main = ({}) => {
	const dispatch = useDispatch()
	const { i18n } = useTranslation()
	const location = useLocation()
	const [searchParams, _] = useSearchParams()
	const isHomePage = location.pathname === '/',
		isTuto = location.pathname.indexOf('/tutoriel') === 0

	const tracker = useContext(TrackerContext)
	const largeScreen = useMediaQuery('(min-width: 800px)')

	useEffect(() => {
		tracker.track(location)
	}, [location])

	const currentLangState = useSelector((state) => state.currentLang)
	const currentLangParam = searchParams.get('lang')

	if (i18n.language !== getLangInfos(currentLangState).abrv) {
		// sync up the [i18n.language] with the current lang stored in the persisiting state.
		changeLangTo(i18n, currentLangState)
	}

	useEffect(() => {
		if (currentLangParam && currentLangParam !== i18n.language) {
			// The 'lang' search param has been modified.
			const currentLang = getLangFromAbreviation(currentLangParam)
			changeLangTo(i18n, currentLang)
			dispatch({
				type: 'SET_LANGUAGE',
				currentLang,
			})
		}
	}, [currentLangParam])

	const fluidLayout = isFluidLayout(location.pathname)

	return (
		<>
			<div
				css={`
					@media (min-width: 800px) {
						display: flex;
						min-height: 100vh;
						padding-top: 1rem;
					}

					@media (min-width: 1200px) {
						${!fluidLayout &&
						`
						transform: translateX(-4vw);
						`}
					}
					${!fluidLayout && !isTuto && sessionBarMargin}
				`}
				className={fluidLayout ? '' : 'ui__ container'}
			>
				<Navigation fluidLayout={fluidLayout} />
				<main
					tabIndex="0"
					id="mainContent"
					css={`
						outline: none !important;
						padding-left: 0rem;
						overflow: auto;
						@media (min-width: 800px) {
							flex-grow: 1;
							${!isHomePage ? 'padding-left: 0.6rem;' : ''}
						}
					`}
				>
					<GroupModeSessionVignette />
					{!isHomePage && !isTuto && <LocalisationMessage />}

					{fluidLayout && (
						<div
							css={`
								margin: 0 auto;
								@media (max-width: 800px) {
									margin-top: 0.6rem;
								}
								@media (min-width: 1200px) {
								}
							`}
						>
							<Logo showText size={largeScreen ? 'large' : 'medium'} />
						</div>
					)}
					{isHomePage && <LangSwitcher from="landing" />}
					{Lang.Default !== currentLangState && (
						<TranslationAlertBanner isBelow={isHomePage} />
					)}
					<Router />
				</main>
			</div>
			<Footer />
		</>
	)
}

export const Loading = AnimatedLoader

const Router = ({}) => {
	return (
		<Routes>
			<Route path="/" element={<Landing />} />
			<Route
				path="documentation/*"
				element={
					<WithEngine options={{ parsed: false, optimized: false }}>
						<Suspense fallback={<Loading />}>
							<DocumentationLazy />
						</Suspense>
					</WithEngine>
				}
			/>
			<Route
				path={encodeURIComponent('modèle')}
				element={
					<Suspense fallback={<Loading />}>
						<ModelLazy />
					</Suspense>
				}
			/>
			<Route
				path="simulateur/*"
				element={
					<Suspense fallback={<Loading />}>
						<WithEngine>
							<SimulateurLazy />
						</WithEngine>
					</Suspense>
				}
			/>
			<Route
				path="/stats"
				element={
					<Suspense fallback={<Loading />}>
						<StatsLazy />
					</Suspense>
				}
			/>
			<Route
				path="/fin/*"
				element={
					<Suspense fallback={<Loading />}>
						<WithEngine>
							<FinLazy />
						</WithEngine>
					</Suspense>
				}
			/>
			<Route
				path="/personas"
				element={
					<Suspense fallback={<Loading />}>
						<WithEngine>
							<PersonasLazy />
						</WithEngine>
					</Suspense>
				}
			/>
			<Route
				path="/actions/*"
				element={
					<Suspense fallback={<Loading />}>
						<WithEngine>
							<ActionsLazy />
						</WithEngine>
					</Suspense>
				}
			/>
			<Route
				path="/profil"
				element={
					<WithEngine>
						<Profil />
					</WithEngine>
				}
			/>
			<Route
				path="/contribuer/*"
				element={
					<Suspense fallback={<Loading />}>
						<ContributionLazy />
					</Suspense>
				}
			/>
			<Route
				path="/contribuer-traduction"
				element={
					<Suspense fallback={<Loading />}>
						<TranslationContribution />
					</Suspense>
				}
			/>
			<Route path={encodeURIComponent('à-propos')} element={<About />} />
			<Route
				path="/cgu"
				element={
					<Suspense
						fallback={
							<div>
								<Trans>Chargement</Trans>
							</div>
						}
					>
						<CGULazy />
					</Suspense>
				}
			/>
			<Route path="/partenaires" element={<Diffuser />} />
			<Route path="/diffuser" element={<Diffuser />} />
			<Route
				path={encodeURIComponent('vie-privée')}
				element={
					<Suspense
						fallback={
							<div>
								<Trans>Chargement</Trans>
							</div>
						}
					>
						<PrivacyLazy />
					</Suspense>
				}
			/>
			<Route
				path={`${encodeURIComponent('nouveautés')}/*`}
				element={
					<Suspense fallback={<Loading />}>
						<News />
					</Suspense>
				}
			/>
			<Route
				path="/guide"
				element={
					<Suspense fallback={<Loading />}>
						<GuideGroupeLazy />
					</Suspense>
				}
			/>
			<Route
				path="/guide/:encodedName"
				element={
					<Suspense fallback={<Loading />}>
						<GuideGroupeLazy />
					</Suspense>
				}
			/>
			<Route
				path={`${encodeURIComponent('conférence')}/:room`}
				element={
					<Suspense fallback={<Loading />}>
						<ConferenceLazy />
					</Suspense>
				}
			/>
			<Route
				path="/groupe"
				element={
					<Suspense fallback={<Loading />}>
						<GroupSwitchLazy />
					</Suspense>
				}
			/>
			<Route
				path="/groupe/documentation-contexte"
				element={
					<Suspense fallback={<div>Chargement</div>}>
						<DocumentationContexteLazy />
					</Suspense>
				}
			/>
			<Route
				path="/sondage/:room"
				element={
					<Suspense fallback={<Loading />}>
						<SurveyLazy />
					</Suspense>
				}
			/>
			<Route
				path="/accessibilite"
				element={
					<Suspense fallback={<Loading />}>
						<AccessibilityLazy />
					</Suspense>
				}
			/>
			<Route
				path="/tutoriel"
				element={
					<Suspense fallback={<Loading />}>
						<TutorialLazy />
					</Suspense>
				}
			/>
			<Route
				path={`/${encodeURIComponent('pétrole-et-gaz')}`}
				element={
					<Suspense fallback={<Loading />}>
						<PetrogazLandingLazy />
					</Suspense>
				}
			/>
			<Route path="*" element={<Route404 />} />
		</Routes>
	)
}
