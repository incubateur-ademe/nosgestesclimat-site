import { useSearchParams } from 'react-router-dom'
export default ({ categories, metric, selected, countByCategory }) => {
	const [_, setSearchParams] = useSearchParams()

	return (
		<ul
			css={`
				display: flex;
				flex-wrap: wrap;
				list-style-type: none;
				justify-content: center;
				padding-left: 0;
				// Here is a trick to detect device and apply css only on mobile devices.
				// It allows to avoid scrollbar for categories on computer screens when zooming.
				@media only screen and (hover: none) and (pointer: coarse) and (max-width: 800px) {
					flex-wrap: nowrap;
					overflow-x: auto;
					white-space: nowrap;
					justify-content: normal;
					height: 3rem;
					scrollbar-width: none;
				}
				li {
					padding: 0.1rem 0rem;
					margin: 0.15rem 0.2rem;
					border-radius: 0.2rem;
					line-height: 1.6rem;
					height: 1.8rem;
				}
				li button {
					color: white;
					font-weight: 500;
				}
			`}
		>
			{categories.map((category) => (
				<li
					key={category.dottedName}
					css={`
						background: ${category.color};
						${selected && 'background: #aaa;'}
						${selected === category.dottedName
							? `background: ${category.color}`
							: ''}
						${!countByCategory[category.dottedName] ? 'background: #ccc' : ''}
					`}
				>
					<button
						tabIndex="-1"
						css="text-transform: capitalize"
						onClick={() =>
							setSearchParams(
								new URLSearchParams({
									...(metric ? { métrique: metric } : {}),
									...(selected === category.dottedName
										? {}
										: { catégorie: category.dottedName }),
								})
							)
						}
					>
						{category.title}{' '}
						<span
							css={`
								background: white;
								color: var(--darkColor);
								border-radius: 1rem;
								width: 1rem;
								margin-left: 0.2rem;
								display: inline-block;
							`}
						>
							{countByCategory[category.dottedName] || 0}
						</span>
					</button>
				</li>
			))}
		</ul>
	)
}
