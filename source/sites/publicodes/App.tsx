import Logo from 'Components/Logo'
import Route404 from 'Components/Route404'
import { sessionBarMargin } from 'Components/SessionBar'
import 'Components/ui/index.css'
import React, { Suspense, useContext, useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { Route, Routes, useSearchParams } from 'react-router-dom'
import LocalisationMessage from '../../components/localisation/LocalisationMessage'
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
	defaultLang,
	getLangFromAbreviation,
} from './../../locales/translation'
import Actions from './Actions'
import Fin from './fin'
import Landing from './Landing'
import Navigation from './Navigation'
import About from './pages/About'
import Diffuser from './pages/Diffuser'
import Personas from './Personas.tsx'
import Profil from './Profil.tsx'
import Simulateur from './Simulateur'
import sitePaths from './sitePaths'

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

export default function Root({}) {
	const paths = sitePaths()

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
				currentLang: persistedSimulation?.currentLang || defaultLang,
				localisation: persistedSimulation?.localisation,
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
	const location = useLocation()
	const isHomePage = location.pathname === '/',
		isTuto = location.pathname.indexOf('/tutoriel') === 0

	const tracker = useContext(TrackerContext)
	const { i18n } = useTranslation()
	const currentLangState = useSelector((state) => state.currentLang)

	const [searchParams] = useSearchParams()

	const largeScreen = useMediaQuery('(min-width: 800px)')

	useEffect(() => {
		tracker.track(location)
	}, [location])

	useEffect(() => {
		const lang = searchParams.get('lang')
		changeLangTo(
			i18n,
			lang ? getLangFromAbreviation(lang) : currentLangState.currentLang
		)
	}, [currentLangState, searchParams])

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
						padding-left: 0.6rem;
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
						<WithEngine>
							<Documentation />
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
			<Route path="*" element={<Route404 />} />
		</Routes>
	)
}
