import { useLocation } from 'react-router'
import { useSearchParams } from '../../components/utils/useSearchParams'
export default ({ categories, metric, selected, countByCategory }) => {
	const location = useLocation()
	const [searchParams, setSearchParams] = useSearchParams()

	return (
		<ul
			css={`
				display: flex;
				flex-wrap: wrap;
				list-style-type: none;
				justify-content: center;
				padding-left: 0;
				@media (max-width: 800px) {
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
						tabindex="-1"
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
						{category.dottedName}{' '}
						<span
							css={`
								background: white;
								color: var(--color);
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
