import { Markdown } from 'Components/utils/markdown'
import { RulePage } from 'publicodes-react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useEngine } from '../../../components/utils/EngineContext'
import RavijenChart from '../chart/RavijenChart'
import References from '../DocumentationReferences'
import DocumentationStyle from './DocumentationStyle'
export default ({ engine: givenEngine }) => {
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
									)}/${encodeURIComponent('documentation-rule-root header')}`}
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
const GraphContainer = styled.div`
	height: 45rem;
	width: 90%;
	margin: 2rem 1rem;
	overflow: scroll;
`
