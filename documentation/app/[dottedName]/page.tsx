'use client'
import Link from 'next/link'
import Engine from 'publicodes'
import { RulePage } from 'publicodes-react'
import { DocumentationStyle } from './DocumentationStyles'

const engine = new Engine({ a: 2, b: 'a + 10', 'b . c': 'a * b' })

export default function Page({ params: { dottedName } }) {
	return (
		<div>
			<h1>Ma page de doc pour {dottedName} </h1>
			<DocPage dottedName={dottedName} />
		</div>
	)
}

const DocPage = ({ dottedName }) => {
	console.log('engineParsedRules:', engine.context.parsedRules)

	return (
		<DocumentationStyle>
			<RulePage
				language={'fr'}
				rulePath={dottedName}
				engine={engine}
				documentationPath={'/documentation'}
				renderers={{
					Head: () => <title>Le titre de {dottedName}</title>,
					Link: ({ to }) => <Link href={to} />,
					Text: ({ children }) => <>Le corps de {dottedName}</>,
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
