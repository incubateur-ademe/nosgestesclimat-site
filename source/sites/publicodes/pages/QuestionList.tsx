import { useSelector } from 'react-redux'
import { parentName } from '../../../components/publicodesUtils'

export default () => {
	const rules = useSelector((state) => state.rules)
	const questionRules = Object.entries(rules)
		.map(([dottedName, v]) => ({ ...v, dottedName }))
		.filter((el) => el && el.question)

	return (
		<div>
			<h1>Les questions du modèle Nos Gestes Climat</h1>
			<ul
				css={`
					li {
						display: flex;
					}

					h2 {
						font-size: 110%;
						margin: 0;
						margin-left: 0.6rem;
					}
				`}
			>
				{questionRules.map((rule) => (
					<li>
						<span
							css={`
								text-transform: uppercase;
								background: var(--color);
								color: white;
								font-weight: bold;
								width: 1.4rem;
								height: 1.4rem;
							`}
						>
							{parentName(rule.dottedName, undefined, 0, -1)[0]}
						</span>
						<h2>{rule.question}</h2>
					</li>
				))}
			</ul>
		</div>
	)
}
