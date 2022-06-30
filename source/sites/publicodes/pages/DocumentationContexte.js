import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import Meta from 'Components/utils/Meta'
import { useState, useEffect } from 'react'
import { contextURL } from '../conference/useDatabase'

export default () => {
	const [documentationContent, setDocumentationContent] = useState('')

	const contextFileURL = `${contextURL}/documentation.md`

	useEffect(() => {
		fetch(contextFileURL)
			.then((response) => response.text())
			.then((text) => setDocumentationContent(text))
			.catch((error) => console.log('error:', error))
	}, [])

	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 1rem auto;">
			<Meta title="Documentation Contexte Sondage" />
			<ScrollToTop />
			<div>
				<Link to={'/groupe'}>
					<button className="ui__ button simple small ">
						{emoji('◀')} Retour
					</button>
				</Link>
			</div>
			<div css="margin: 1.6rem 0">
				<Markdown
					source={documentationContent || 'En cours de chargement'}
					transformImageUri={(uri) =>
						uri.startsWith('http') ? uri : `${contextURL}${uri}`
					}
				/>
			</div>
		</div>
	)
}
