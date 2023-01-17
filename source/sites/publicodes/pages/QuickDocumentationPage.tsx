import { Markdown } from 'Components/utils/markdown'
import { splitName } from '../../../components/publicodesUtils'
import Meta from '../../../components/utils/Meta'
import { capitalise0 } from '../../../utils'
import References from '../DocumentationReferences'
import DocumentationStyle from './DocumentationStyle'

export default ({ rule, dottedName, setLoadEngine }) => {
	const split = splitName(dottedName),
		title = rule.titre || capitalise0(split[splitName.length - 1]),
		parents = split.slice(0, -1).join(' > ')

	console.log(split, title)
	return (
		<div
			css={`
				max-width: calc(800px + 1.2rem);
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
					className="ui__ button cta plain attention"
				>
					🧮 Lancer le calcul
				</button>
				{rule.formule && (
					<div>
						<h2>Comment cette donnée est-elle calculée ?</h2>

						<blockquote>{JSON.stringify(rule.formule, null, 3)}</blockquote>
					</div>
				)}
				{rule.note && (
					<div>
						<h2>Notes</h2>
						<Markdown>{rule.note}</Markdown>
					</div>
				)}
				{rule.références && (
					<div>
						<h2>Références</h2>
						<References references={rule.références} />
					</div>
				)}
			</DocumentationStyle>
		</div>
	)
}
