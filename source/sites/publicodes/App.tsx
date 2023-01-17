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
import LangSwitcher from '../../components/LangSwitcher'
import LocalisationMessage from '../../components/localisation/LocalisationMessage'
import TranslationAlertBanner from '../../components/TranslationAlertBanner'
import useMediaQuery from '../../components/utils/useMediaQuery'
import { TrackerContext } from '../../components/utils/withTracker'
import Provider from '../../Provider'
import { WithEngine } from '../../RulesProvider'
import {
	persistSimulation,
	retrievePersistedSimulation,
} from '../../storage/persistSimulation'
import Tracker, { devTracker } from '../../Tracker'
import {
	changeLangTo,
	getLangFromAbreviation,
	getLangInfos,
	Lang,
} from './../../locales/translation'
import Actions from './Actions'
import Fin from './fin'
import Landing from './Landing'
import Navigation from './Navigation'
import About from './pages/About'
import Diffuser from './pages/Diffuser'
import Profil from './Profil.tsx'
import Simulateur from './Simulateur'
import sitePaths from './sitePaths'
import TranslationContribution from './TranslationContribution'

const PetrogazLanding = React.lazy(() => import('./pages/PetrogazLanding'))
const Model = React.lazy(() => import('./Model'))
const Personas = React.lazy(() => import('./Personas.tsx'))
const Documentation = React.lazy(() => import('./pages/Documentation'))
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

	const persistedSimulation = retrievePersistedSimulation()

	const currentLang =
		persistedSimulation?.currentLang ??
		getLangFromAbreviation(
			window.FORCE_LANGUAGE || window.navigator.language.toLowerCase()
		)

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
				actionChoices: persistedSimulation?.actionChoices ?? {},
				tutorials: persistedSimulation?.tutorials,
				storedTrajets: persistedSimulation?.storedTrajets ?? {},
				currentLang,
				localisation: persistedSimulation?.localisation,
			}}
		>
			<Main />
		</Provider>
	)
}

const isFluidLayout = (encodedPathname) => {
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
					@media (min-width: 800px) {
						flex-grow: 1;
						${!isHomePage ? 'padding-left: 0.6rem;' : ''}
					}
				`}
			>
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
					<Suspense fallback={<Loading />}>
						<Documentation />
					</Suspense>
				}
			/>
			<Route
				path={encodeURIComponent('modèle')}
				element={
					<Suspense fallback={<Loading />}>
						<WithEngine>
							<Model />
						</WithEngine>
					</Suspense>
				}
			/>
			<Route
				path="simulateur/*"
				element={
					<WithEngine>
						<Simulateur />
					</WithEngine>
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
					<WithEngine>
						<Fin />
					</WithEngine>
				}
			/>
			<Route
				path="/personas"
				element={
					<WithEngine>
						<Personas />
					</WithEngine>
				}
			/>
			<Route
				path="/actions/*"
				element={
					<WithEngine>
						<Actions />
					</WithEngine>
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
				element={<PetrogazLanding />}
			/>
			<Route path="*" element={<Route404 />} />
		</Routes>
	)
}
