import SearchBar from 'Components/SearchBar'
import SearchButton from 'Components/SearchButton'
import { EngineContext } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import { getDocumentationSiteMap, RulePage } from 'publicodes-react'
import { useContext, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
	Link,
	Navigate,
	Route,
	Routes,
	useLocation,
	useNavigate,
	useParams,
} from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import styled from 'styled-components'
import Meta from '../../../components/utils/Meta'
import { currentSimulationSelector } from '../../../selectors/storageSelectors'
import BandeauContribuer from '../BandeauContribuer'
import References from '../DocumentationReferences'
import Méthode from './Méthode'

export default function () {
	const currentSimulation = useSelector(
		(state: RootState) => !!state.simulation?.url
	)
	const engine = useContext(EngineContext)
	const documentationPath = '/documentation'
	const { pathname: pathnameRaw } = useLocation(),
		pathname = decodeURIComponent(pathnameRaw)
	const documentationSitePaths = useMemo(
		() => getDocumentationSiteMap({ engine, documentationPath }),
		[engine, documentationPath]
	)
	const { i18n } = useTranslation()

	if (pathname === '/documentation') {
		return <DocumentationLanding />
	}
	if (!documentationSitePaths[pathname]) {
		return <Navigate to="/404" replace />
	}
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
			<Routes>
				<Route
					path="*"
					element={<DocPage {...{ documentationPath, engine }} />}
				/>
			</Routes>

			<BandeauContribuer />
		</div>
	)
}

const DocPage = ({ documentationPath, engine }) => {
	const url = useParams()['*']
	const { i18n } = useTranslation()
	return (
		<DocumentationStyle>
			<RulePage
				language={i18n.language as 'fr' | 'en'}
				rulePath={url}
				engine={engine}
				documentationPath={documentationPath}
				renderers={{
					Head: Helmet,
					Link: Link,
					Text: Markdown,
					References: References,
				}}
			/>
		</DocumentationStyle>
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
			← <Trans i18nKey="back">Reprendre la simulation</Trans>
		</button>
	)
}

function DocumentationLanding() {
	return (
		<div className="ui__ container">
			<Meta
				title="Comprendre nos calculs"
				description="Notre modèle de calcul est entièrement transparent. Chacun peut l'explorer, donner son avis, l'améliorer."
			/>
			<Méthode />
			<h2>Explorer notre documentation</h2>
			<SearchBar showListByDefault={true} />
		</div>
	)
}

export const DocumentationStyle = styled.div`
	padding: 0 0.6rem;
	#documentationRuleRoot > p:first-of-type {
		display: inline-block;
		background: var(--lighterColor);
		padding: 0.4rem 0.6rem 0.2rem;
	}
	header {
		color: var(--textColor);
		a {
			color: var(--textColor);
		}
		a:hover {
			background: var(--darkerColor) !important;
			color: white !important;
		}
		h1 {
			margin-top: 0.6rem;
			margin-bottom: 0.6rem;
			a {
				text-decoration: none;
			}
		}
		background: linear-gradient(60deg, var(--darkColor) 0%, var(--color) 100%);
		padding: 0.6rem 1rem;
		box-shadow: 0 1px 3px rgba(var(--rgbColor), 0.12),
			0 1px 2px rgba(var(--rgbColor), 0.24);
		border-radius: 0.4rem;
	}
	button {
		color: inherit;
	}
	span {
		background: inherit;
	}
	small {
		background: none !important;
	}
`
