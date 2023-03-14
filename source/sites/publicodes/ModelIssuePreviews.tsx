import { useEffect, useState } from 'react'
import { Markdown } from '../../components/utils/markdown'

const labelString = ['exposé'].join(',')
export default () => {
	const [issues, setIssues] = useState([])

	useEffect(() => {
		fetch(
			`https://api.github.com/repos/datagir/nosgestesclimat/issues?labels=${labelString}`
		)
			.then((res) => res.json())
			.then(setIssues)
			.catch((e) => console.log(e))
	}, [])

	if (!issues.length) return <div>Chargement en cours...</div>
	return (
		<ul
			css={`
				list-style-type: none;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-evenly;
				li {
					margin: 0.6rem 0;
					max-width: 20rem;
				}
			`}
		>
			{issues.map(({ body, id, html_url: url, title }) => (
				<li key={id} className="ui__ card content">
					<h3>{title}</h3>
					<div
						css={`
							height: 12rem;

							overflow: hidden;
							-webkit-mask-image: linear-gradient(
								180deg,
								#000 60%,
								transparent
							);
						`}
					>
						<Markdown>{body}</Markdown>
					</div>
					<a href={url}>En savoir plus</a>
				</li>
			))}
		</ul>
	)
}
