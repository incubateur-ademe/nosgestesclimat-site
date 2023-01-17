import { utils } from 'publicodes'
import { Link } from 'react-router-dom'
import { capitalise0 } from '../../../utils'

const FriendlyObjectViewer = ({ data, level = 0, context }) => {
	if (typeof data === 'string') {
		try {
			const isRule = utils.disambiguateReference(
				context.rules,
				context.dottedName,
				data
			)

			console.log(data, isRule)
			return (
				<Link to={`/documentation/${utils.encodeRuleName(isRule)}`}>
					{capitalise0(data)}
				</Link>
			)
		} catch (e) {
			console.log(e)
			return <span>{capitalise0(data)}</span>
		}
	}
	if (typeof data === 'number') return <span>{data}</span>

	const isArray = Object.keys(data).every((key) => Number.isInteger(+key))
	const Level = isArray ? (
		<ol
			css={`
				padding-left: 2rem;
				list-style-type: circle;
			`}
		>
			{Object.entries(data).map(([key, value]) => (
				<li>
					<FriendlyObjectViewer
						data={value}
						level={level + 1}
						context={context}
					/>
				</li>
			))}
		</ol>
	) : (
		<ul
			css={`
				list-style-type: none;
			`}
		>
			{Object.entries(data).map(([key, value]) =>
				typeof value === 'string' || typeof value === 'number' ? (
					<li>
						<span>{capitalise0(key)}:</span>
						<span
							css={`
								margin-left: 1rem;
							`}
						>
							<FriendlyObjectViewer
								data={value}
								level={level + 1}
								context={context}
							/>
						</span>
					</li>
				) : (
					<li>
						<div>{capitalise0(key)}:</div>
						<div
							css={`
								margin-left: 1rem;
							`}
						>
							<FriendlyObjectViewer
								data={value}
								level={level + 1}
								context={context}
							/>
						</div>
					</li>
				)
			)}
		</ul>
	)

	if (level === 0)
		return (
			<div
				css={`
					border: 1px solid var(--darkColor);
					padding: 0.2rem 1rem;
					border-radius: 0.2rem;
				`}
			>
				{Level}
			</div>
		)
	return Level
}

export default FriendlyObjectViewer
