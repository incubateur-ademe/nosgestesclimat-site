import { setDifferentSituation } from '@/actions/actions'
import { matomoEventInteractionIframe } from '@/analytics/matomo-events'
import AnimatedLoader from '@/AnimatedLoader'
import { ErrorFallback } from '@/components/ErrorFallback'
import Footer from '@/components/Footer'
import LangSwitcher from '@/components/LangSwitcher'
import LocalisationMessage from '@/components/localisation/LocalisationMessage'
import Logo from '@/components/Logo'
import Route404 from '@/components/Route404'
import { sessionBarMargin } from '@/components/SessionBar'
import '@/components/ui/index.css'
import { MatomoContext } from '@/contexts/MatomoContext'
import '@/global.css'
import { useLoadSimulationFromURL } from '@/hooks/useLoadSimulationFromURL'
import useMediaQuery from '@/hooks/useMediaQuery'
import {
	changeLangTo,
	getLangFromAbreviation,
	getLangInfos,
	Lang,
} from '@/locales/translation'
import Provider from '@/Provider'
import { AppState } from '@/reducers/rootReducer'
import { WithEngine } from '@/RulesProvider'
import { fetchUser, persistUser } from '@/storage/persistSimulation'
import { getIsIframe } from '@/utils'
import * as Sentry from '@sentry/react'
import React, { Suspense, useContext, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { Route, Routes, useSearchParams } from 'react-router-dom'
import { Store } from 'redux'
import GroupModeSessionVignette from './conference/GroupModeSessionVignette'
import EnquêteBanner from './enquête/BannerWrapper'
import Landing from './Landing'
import Navigation from './Navigation'
import About from './pages/About'
import Diffuser from './pages/Diffuser'
import PlanDuSite from './pages/Plan'
import Profil from './Profil'
import sitePaths from './sitePaths'
import TranslationContribution from './TranslationContribution'
import { isFluidLayout } from './utils'

// All those lazy components, could be probably be handled another more consise way
// Also, see this issue about migrating to SSR https://github.com/datagir/nosgestesclimat-site/issues/801

const ActionsLazy = React.lazy(
	() => import(/* webpackChunkName: 'Actions' */ './Actions')
)

const BlogArticleLazy = React.lazy(
	() => import(/* webpackChunkName: 'BlogArticle' */ './pages/BlogArticle')
)

const BlogLazy = React.lazy(
	() => import(/* webpackChunkName: 'Blog' */ './pages/Blog')
)

const QuestionList = React.lazy(
	() => import(/* webpackChunkName: 'QuestionList' */ './pages/QuestionList')
)
const FinLazy = React.lazy(() => import(/* webpackChunkName: 'Fin' */ './fin'))
const SimulateurLazy = React.lazy(
	() => import(/* webpackChunkName: 'Simulateur' */ './Simulateur')
)
const PetrogazLandingLazy = React.lazy(
	() =>
		import(/* webpackChunkName: 'PetrogazLanding' */ './pages/PetrogazLanding')
)
const ModelLazy = React.lazy(
	() => import(/* webpackChunkName: 'Model' */ './Model')
)
const PersonasLazy = React.lazy(
	() => import(/* webpackChunkName: 'Personas' */ './Personas')
)
const DocumentationLazy = React.lazy(
	() => import(/* webpackChunkName: 'Documentation' */ './pages/Documentation')
)
const TutorialLazy = React.lazy(
	() => import(/* webpackChunkName: 'Tutorial' */ './tutorial/Tutorial')
)
const GroupSwitchLazy = React.lazy(
	() => import(/* webpackChunkName: 'GroupSwitch' */ './conference/GroupSwitch')
)
const FAQLazy = React.lazy(() => import(/* webpackChunkName: 'FAQ' */ './FAQ'))
const ContactLazy = React.lazy(
	() => import(/* webpackChunkName: 'Contact' */ './Contact')
)
const ConferenceLazy = React.lazy(
	() => import(/* webpackChunkName: 'Conference' */ './conference/Conference')
)
const StatsLazy = React.lazy(
	() => import(/* webpackChunkName: 'Stats' */ './pages/Stats')
)
const SurveyLazy = React.lazy(
	() => import(/* webpackChunkName: 'Survey' */ './conference/Survey')
)
const EnquêteLazy = React.lazy(
	() => import(/* webpackChunkName: 'Enquête' */ './enquête/Enquête')
)
const CGULazy = React.lazy(
	() => import(/* webpackChunkName: 'CGU' */ './pages/CGU')
)
const PrivacyLazy = React.lazy(
	() => import(/* webpackChunkName: 'Privacy' */ './pages/Privacy')
)
const AccessibilityLazy = React.lazy(
	() => import(/* webpackChunkName: 'Accessibility' */ './pages/Accessibility')
)
const GuideGroupeLazy = React.lazy(
	() => import(/* webpackChunkName: 'GuideGroupe' */ './pages/GuideGroupe')
)
const International = React.lazy(
	() => import(/* webpackChunkName: 'International' */ './pages/International')
)
const DocumentationContexteLazy = React.lazy(
	() =>
		import(
			/* webpackChunkName: 'DocumentationContexte' */ './pages/DocumentationContexte'
		)
)
const News = React.lazy(
	() => import(/* webpackChunkName: 'News' */ './pages/news/News')
)

const NorthstarStatsLazy = React.lazy(
	() =>
		import(/* webpackChunkName: 'NorthstarStats' */ './pages/NorthstarStats')
)

const GroupeAmisLazy = React.lazy(
	() => import(/* webpackChunkName: 'GroupeAmis' */ '@/pages/groupe-amis')
)

const RejoindreGroupeLazy = React.lazy(
	() =>
		import(/* webpackChunkName: 'RejoindreGroupe' */ '@/pages/rejoindre-groupe')
)

// Do not export anything else than React components here. Exporting isFulidLayout breaks the hot reloading

declare global {
	interface Window {
		FORCE_LANGUAGE?: string
	}
}

export default function Root() {
	const paths = sitePaths()

	const { trackEvent } = useContext(MatomoContext)

	const iframeShareData = new URLSearchParams(
		document?.location.search.substring(1)
	).get('shareData')

	// We retrieve the User object from local storage to initialize the store.
	const persistedUser = fetchUser()

	// We use the 'currentSimulationId' pointer to retrieve the latest simulation in the list.
	const persistedSimulation = persistedUser.simulations.filter(
		(simulation) => simulation.id === persistedUser.currentSimulationId
	)[0]

	const currentLang =
		persistedUser?.currentLang ??
		getLangFromAbreviation(
			window.FORCE_LANGUAGE || window.navigator.language.toLowerCase()
		)

	const isIframe = getIsIframe()

	const handleClickIframe = () => {
		// Envoi un évènement pour permettre de discriminer les iframes "fantômes"
		// des iframes avec lesquelles il y a eu interaction
		trackEvent(matomoEventInteractionIframe)
		document.body.removeEventListener('click', handleClickIframe)
	}

	useEffect(() => {
		if (!isIframe) {
			document.body.addEventListener('click', handleClickIframe)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<Provider
			sitePaths={paths}
			reduxMiddlewares={[]}
			onStoreCreated={(store: Store<AppState>) => {
				persistUser(store)
			}}
			initialStore={{
				// If a simulation is loaded via URL, we use it as the current simulation
				simulation: persistedSimulation,
				simulations: [...persistedUser.simulations],
				currentSimulationId: persistedUser.currentSimulationId,
				tutorials: persistedUser.tutorials,
				localisation: persistedUser.localisation,
				currentLang,
				iframeOptions: { iframeShareData },
				actionChoices: persistedSimulation?.actionChoices ?? {},
				storedTrajets: persistedSimulation?.storedTrajets ?? {},
				storedAmortissementAvion:
					persistedSimulation?.storedAmortissementAvion ?? {},
				conference: persistedSimulation?.conference,
				survey: persistedSimulation?.survey,
				enquête: persistedSimulation?.enquête,
				ratings: persistedSimulation?.ratings,
				hasSubscribedToNewsletter:
					persistedUser.hasSubscribedToNewsletter ?? false,
				groups: persistedUser.groups,
			}}
		>
			<Main />
		</Provider>
	)
}

const Main = () => {
	const dispatch = useDispatch()
	const location = useLocation()
	const { i18n } = useTranslation()
	const [searchParams] = useSearchParams()
	const isHomePage = location.pathname === '/'
	const isTuto = location.pathname.startsWith('/tutoriel')
	const isGroup = location.pathname.startsWith('/groupe')
	const isStats =
		location.pathname.startsWith('/stats') ||
		location.pathname.startsWith('/northstar')
	const [simulationFromUrlHasBeenSet, setSimulationFromUrlHasBeenSet] =
		useState(false)

	const { trackPageView } = useContext(MatomoContext)
	const largeScreen = useMediaQuery('(min-width: 800px)')

	// Or we retrive the simulation from the URL
	const simulationFromURL = useLoadSimulationFromURL()

	useEffect(() => {
		if (simulationFromURL && !simulationFromUrlHasBeenSet) {
			setSimulationFromUrlHasBeenSet(true)
			dispatch(setDifferentSituation(simulationFromURL))
		}
	}, [dispatch, simulationFromURL, simulationFromUrlHasBeenSet])

	if (simulationFromURL && !simulationFromURL?.situation) {
		simulationFromURL.situation = {}
	}

	useEffect(() => {
		trackPageView(location)
	}, [location, trackPageView])

	// Manage the language change from the URL search param
	const currentLangState: Lang = useSelector(
		(state: AppState) => state.currentLang
	)
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
		<Sentry.ErrorBoundary
			showDialog
			fallback={({ error }) => (
				<ErrorFallback error={error} largeScreen={largeScreen} />
			)}
		>
			<>
				<EnquêteBanner />
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
						tabIndex={0}
						id="mainContent"
						css={`
							outline: none !important;
							padding-left: 0rem;
							overflow: auto;
							@media (min-width: 800px) {
								flex-grow: 1;
								${!fluidLayout ? 'padding-left: 0.6rem;' : ''}
							}
						`}
					>
						<GroupModeSessionVignette />
						{!isHomePage &&
							!isTuto &&
							!isStats &&
							!isGroup &&
							!location.pathname.startsWith('/international') && (
								<LocalisationMessage />
							)}

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
						{fluidLayout && <LangSwitcher from="landing" />}
						<Router />
					</main>
				</div>
				<Footer />
			</>
		</Sentry.ErrorBoundary>
	)
}

const Router = () => {
	return (
		<Routes>
			<Route path="/" element={<Landing />} />
			<Route
				path="/documentation/*"
				element={
					<WithEngine options={{ parsed: false, optimized: false }}>
						<Suspense fallback={<AnimatedLoader />}>
							<DocumentationLazy />
						</Suspense>
					</WithEngine>
				}
			/>
			<Route
				path="/questions"
				element={
					<WithEngine options={{ parsed: true, optimized: false }}>
						<Suspense fallback={<AnimatedLoader />}>
							<QuestionList />
						</Suspense>
					</WithEngine>
				}
			/>
			<Route
				path="/modèle"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<ModelLazy />
					</Suspense>
				}
			/>
			<Route
				path="/simulateur/*"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<WithEngine>
							<SimulateurLazy />
						</WithEngine>
					</Suspense>
				}
			/>
			<Route
				path="/stats"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<StatsLazy />
					</Suspense>
				}
			/>
			<Route
				path="/fin/*"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<WithEngine>
							<FinLazy />
						</WithEngine>
					</Suspense>
				}
			/>
			<Route
				path="/mon-empreinte-carbone/*"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<WithEngine>
							<FinLazy />
						</WithEngine>
					</Suspense>
				}
			/>
			<Route
				path="/personas"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<WithEngine>
							<PersonasLazy />
						</WithEngine>
					</Suspense>
				}
			/>
			<Route
				path="/actions/*"
				element={
					<Suspense fallback={<AnimatedLoader />}>
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
				path="/contact"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<ContactLazy />
					</Suspense>
				}
			/>
			<Route
				path="/questions-frequentes"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<FAQLazy />
					</Suspense>
				}
			/>
			<Route
				path="/contribuer-traduction"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<TranslationContribution />
					</Suspense>
				}
			/>
			<Route path={'à-propos'} element={<About />} />
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
				path={'vie-privée'}
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
				path="/nouveautés/*"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<News />
					</Suspense>
				}
			/>
			<Route
				path="/blog"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<BlogLazy />
					</Suspense>
				}
			/>
			<Route
				path="blog/:slug"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<BlogArticleLazy />
					</Suspense>
				}
			/>
			<Route
				path="/guide"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<GuideGroupeLazy />
					</Suspense>
				}
			/>
			<Route
				path="/guide/:encodedName"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<GuideGroupeLazy />
					</Suspense>
				}
			/>
			<Route
				path="/conférence/:room"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<ConferenceLazy />
					</Suspense>
				}
			/>
			<Route
				path="/groupe"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<GroupSwitchLazy />
					</Suspense>
				}
			/>
			<Route
				path="/groupe/documentation-contexte"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<DocumentationContexteLazy />
					</Suspense>
				}
			/>
			<Route
				path="/sondage/:room"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<SurveyLazy />
					</Suspense>
				}
			/>
			<Route
				path="/creer-groupe/*"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<GroupeAmisLazy />
					</Suspense>
				}
			/>
			<Route
				path="/rejoindre-groupe/:groupId"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<RejoindreGroupeLazy />
					</Suspense>
				}
			/>
			<Route
				path="/enquête/:userID?"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<EnquêteLazy />
					</Suspense>
				}
			/>
			<Route
				path="/accessibilite"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<AccessibilityLazy />
					</Suspense>
				}
			/>
			<Route
				path="/tutoriel"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<TutorialLazy />
					</Suspense>
				}
			/>
			<Route
				path={'/pétrole-et-gaz'}
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<PetrogazLandingLazy />
					</Suspense>
				}
			/>
			<Route
				path={'/international'}
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<International />
					</Suspense>
				}
			/>
			<Route
				path={'/plan'}
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<WithEngine>
							<PlanDuSite />
						</WithEngine>
					</Suspense>
				}
			/>
			<Route
				path="/northstar"
				element={
					<Suspense fallback={<AnimatedLoader />}>
						<NorthstarStatsLazy />
					</Suspense>
				}
			/>
			<Route path="*" element={<Route404 />} />
		</Routes>
	)
}
