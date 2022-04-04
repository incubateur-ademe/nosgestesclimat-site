import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
export default ({ selected }) => {
	const location = useLocation()
	return (
		<div
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
				div {
					padding: 0.1rem 0rem;
					margin: 0.15rem 0.2rem;
					border-radius: 0.2rem;
					line-height: 1.6rem;
					height: 1.8rem;
					background: var(--darkestColor);
				}
				button {
					color: white;
					font-weight: 500;
				}
			`}
		>
			<div>
				<Link
					to={
						selected
							? location.pathname
							: location.pathname + '?métrique=pétrole'
					}
				>
					<button>Pétrole</button>
				</Link>
			</div>
		</div>
	)
}
