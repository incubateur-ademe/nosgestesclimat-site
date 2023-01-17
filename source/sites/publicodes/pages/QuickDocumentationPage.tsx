import { Markdown } from 'Components/utils/markdown'
import { splitName } from '../../../components/publicodesUtils'
import Meta from '../../../components/utils/Meta'
import { capitalise0, omit } from '../../../utils'
import References from '../DocumentationReferences'
import DocumentationStyle from './DocumentationStyle'
import FriendlyObjectViewer from './FriendlyObjectViewer'

export default ({ rule, dottedName, setLoadEngine, rules }) => {
	const split = splitName(dottedName),
		title = rule.titre || capitalise0(split[splitName.length - 1]),
		parents = split.slice(0, -1).join(' > ')

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
				{rule.question && (
					<section
						css={`
							display: flex;
							justify-content: center;
							align-items: center;
						`}
					>
						<small css="margin-right:1rem">Question utilisateur</small>
						<q
							css={`
								font-size: 120%;
								quotes: '«' '»' '‹' '›';
							`}
						>
							{rule.question}
						</q>
					</section>
				)}
				<section>
					{rule.description && <Markdown>{rule.description}</Markdown>}
				</section>
				<button
					onClick={() => setLoadEngine(true)}
					className="ui__ button cta plain attention"
				>
					🧮 Lancer le calcul
				</button>
				{
					<div>
						<h2>Comment cette donnée est-elle calculée ?</h2>

						<FriendlyObjectViewer
							data={omit(
								[
									'résumé',
									'exposé',
									'question',
									'description',
									'note',
									'titre',
									'références',
								],
								rule
							)}
							context={{ dottedName, rules }}
						/>
					</div>
				}
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
