import SearchButton from '@/components/SearchButton'
import { ScrollToTop } from '@/components/utils/Scroll'
import { AppState } from '@/reducers/rootReducer'
import { utils } from 'publicodes'
import React, { Suspense, useState } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import AnimatedLoader from '../../../AnimatedLoader'
import { WithEngine } from '../../../RulesProvider'
import { currentSimulationSelector } from '../../../selectors/storageSelectors'
import BandeauContribuer from '../BandeauContribuer'
import DocumentationLanding from './DocumentationLanding'
import QuickDocumentationPage from './QuickDocumentationPage'

const DocumentationPageLazy = React.lazy(
	() =>
		import(/* webpackChunkName: 'DocumentationPage' */ './DocumentationPage')
)

export default function () {
	const currentSimulation = useSelector(
			(state: AppState) => !!state.simulation?.url
		),
		rules = useSelector((state: AppState) => state.rules),
		//This ensures the disambiguateReference function, which awaits RuleNodes, not RawNodes, doesn't judge some rules private for
		//our parseless documentation page
		allPublicRules = Object.fromEntries(
			Object.entries(rules).map(([key, value]) => [
				key,
				{ ...value, private: false },
			])
		)

	const { pathname: pathnameRaw } = useLocation(),
		pathname = decodeURIComponent(pathnameRaw)

	const url = useParams()['*']

	const [loadEngine, setLoadEngine] = useState(false)

	const engineState = useSelector((state) => state.engineState),
		parsedEngineReady =
			engineState.state === 'ready' && engineState.options.parsed

	if (pathname === '/documentation') {
		return <DocumentationLanding />
	}
	const encodedDottedName = pathname.split('/documentation/')[1]
	const dottedName = utils.decodeRuleName(encodedDottedName)

	if (!dottedName) {
		return <Navigate to="/404" replace />
	}

	const rule = rules[dottedName] ?? {}

	return (
		<div
			css={`
				@media (min-width: 800px) {
					max-width: 80%;
				}

				margin: 0 auto;
			`}
		>
			<ScrollToTop key={pathname} />
			<div
				css={`
					display: flex;
					justify-content: center;
					> * {
						margin-right: 2rem;
					}
				`}
			>
				{currentSimulation ? <BackToSimulation /> : <span />}
				<SearchButton key={pathname} />
			</div>

			{!parsedEngineReady && !loadEngine && (
				<div>
					<QuickDocumentationPage
						rule={rule}
						dottedName={dottedName}
						setLoadEngine={setLoadEngine}
						rules={allPublicRules}
					/>
				</div>
			)}
			{(parsedEngineReady || loadEngine) && (
				<WithEngine options={{ optimized: false, parsed: true }}>
					<Suspense fallback={<AnimatedLoader />}>
						<DocumentationPageLazy dottedName={dottedName} />
					</Suspense>
				</WithEngine>
			)}

			<BandeauContribuer />
		</div>
	)
}

function BackToSimulation() {
	const url = useSelector(currentSimulationSelector)?.url
	const navigate = useNavigate()

	console.log('url', url)

	return (
		<button
			className="ui__ simple small push-left button"
			onClick={() => {
				navigate(url)
			}}
		>
			<Trans>Reprendre la simulation</Trans>
		</button>
	)
}
