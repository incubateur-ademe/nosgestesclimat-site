import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import emoji from '../../components/emoji'
export default ({ selected }) => {
	const location = useLocation()
	return (
		<div
			css={`
				margin-bottom: 0.2rem;
				> div {
					margin: 0 auto;
					width: 7rem;
					text-align: center;
					padding: 0.1rem 0rem;
					border-radius: 0.2rem;
					line-height: 1.6rem;
					height: 1.8rem;
					background: var(--darkerColor);
				}
				button {
					color: white;
					font-weight: 500;
				}
				${!selected &&
				`

> div {
				background: white;
				border: 1px solid var(--darkerColor);

				button {color: var(--darkerColor);}
				}


				`}
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
					<button>{emoji('🎯')} Pétrole</button>
				</Link>
			</div>
		</div>
	)
}
