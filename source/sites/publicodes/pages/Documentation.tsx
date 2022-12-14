import SearchButton from 'Components/SearchButton'
import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import { utils } from 'publicodes'
import { RulePage } from 'publicodes-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
	Link,
	Navigate,
	useLocation,
	useNavigate,
	useParams,
} from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import styled from 'styled-components'
import { splitName } from '../../../components/publicodesUtils'
import { useEngine } from '../../../components/utils/EngineContext'
import Meta from '../../../components/utils/Meta'
import { WithEngine } from '../../../RulesProvider'
import { currentSimulationSelector } from '../../../selectors/storageSelectors'
import { capitalise0 } from '../../../utils'
import BandeauContribuer from '../BandeauContribuer'
import RavijenChart from '../chart/RavijenChart'
import References from '../DocumentationReferences'
import DocumentationLanding from './DocumentationLanding'
import DocumentationStyle from './DocumentationStyle'

export default function () {
	console.log('Rendering Documentation')
	const currentSimulation = useSelector(
			(state: RootState) => !!state.simulation?.url
		),
		rules = useSelector((state) => state.rules)

	const { pathname: pathnameRaw } = useLocation(),
		pathname = decodeURIComponent(pathnameRaw)

	const url = useParams()['*']

	const [loadEngine, setLoadEngine] = useState(false)
	if (!rules)
		return (
			<div css="height: 10vh; background: purple">
				Chargement des règles page doc
			</div>
		)

	if (pathname === '/documentation') {
		return <DocumentationLanding />
	}
	const encodedDottedName = pathname.split('/documentation/')[1],
		dottedName = utils.decodeRuleName(encodedDottedName)

	if (!dottedName || !rules[dottedName]) {
		return <Navigate to="/404" replace />
	}

	const rule = rules[dottedName]

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
					justify-content: space-between;
				`}
			>
				{currentSimulation ? <BackToSimulation /> : <span />}
				<SearchButton key={pathname} />
			</div>

			{!loadEngine && (
				<div>
					<QuickDocPage
						rule={rule}
						dottedName={dottedName}
						setLoadEngine={setLoadEngine}
					/>
				</div>
			)}
			{loadEngine && (
				<WithEngine>
					<DocPage dottedName={dottedName} />
				</WithEngine>
			)}

			<BandeauContribuer />
		</div>
	)
}
const QuickDocPage = ({ rule, dottedName, setLoadEngine }) => {
	const split = splitName(dottedName),
		title = rule.titre || capitalise0(split[splitName.length - 1]),
		parents = split.slice(0, -1).join(' > ')

	console.log(split, title)
	return (
		<div
			css={`
				width: 700px;
				margin: 0 auto;
			`}
		>
			<DocumentationStyle>
				<Meta description={rule.description} title={title} />
				<header>
					<small>{parents}</small>
					<h1>{title}</h1>
				</header>
				<section>
					{rule.description && <Markdown>{rule.description}</Markdown>}
				</section>
				<button
					onClick={() => setLoadEngine(true)}
					className="ui__ button cta plain"
				>
					🧮 Lancer le calcul
				</button>
				{rule.formule && (
					<div>
						<h2>Comment cette donnée est-elle calculée ?</h2>

						<blockquote>{JSON.stringify(rule.formule, null, 3)}</blockquote>
					</div>
				)}
			</DocumentationStyle>
		</div>
	)
}

const DocPage = ({ engine: givenEngine }) => {
	const url = useParams()['*']
	const { i18n } = useTranslation()

	const engine = givenEngine || useEngine()
	console.log('engineParsedRules:', engine.context.parsedRules)
	console.log('url:', url)
	const documentationPath = '/documentation'

	return (
		<DocumentationStyle>
			<RulePage
				language={i18n.language}
				rulePath={url}
				engine={engine}
				documentationPath={documentationPath}
				renderers={{
					Head: Helmet,
					Link: Link,
					Text: ({ children }) => (
						<>
							{/* This isn't clean, created as many Helmets as there are text nodes. Should be integrated in publicodes as an option */}
							<Helmet>
								<meta
									property="og:image"
									content={`https://ogimager.osc-fr1.scalingo.io/capture/${encodeURIComponent(
										window.location.href
									)}/${encodeURIComponent('documentationRuleRoot header')}`}
								/>
							</Helmet>
							<Markdown children={children} />
							{children.includes('<RavijenChart/>') && (
								<GraphContainer>
									<RavijenChart />
								</GraphContainer>
							)}
							{children.includes('<RavijenChartSocietaux/>') && (
								<GraphContainer>
									<RavijenChart target="services sociétaux" numberBottomRight />
								</GraphContainer>
							)}
						</>
					),
					References: References,
				}}
			/>
		</DocumentationStyle>
	)
}

// Not integratable yet, see https://github.com/betagouv/publicodes/issues/336
const GithubContributionLink = ({ dottedName }) => (
	<a
		href={`https://github.com/search?q=${encodeURIComponent(
			`repo:datagir/nosgestesclimat "${dottedName}:"`
		)} path:data&type=code`}
	>
		✏️ Contribuer
	</a>
)

const GraphContainer = styled.div`
	height: 45rem;
	width: 90%;
	margin: 2rem 1rem;
	overflow: scroll;
`

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
