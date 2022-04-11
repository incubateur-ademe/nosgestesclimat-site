import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import emoji from '../../components/emoji'
import { useSearchParams } from '../../components/utils/useSearchParams'
export default ({ selected }) => {
	const location = useLocation()
	const [searchParams, setSearchParams] = useSearchParams()
	const { métrique, ...otherSearchParams } = searchParams
	return (
		<button
			css={`
				margin: 0 auto;
				margin-bottom: 0.4rem;
				width: 15rem;
				text-align: center;
				padding: 0.1rem 0rem;
				border-radius: 0.2rem;
				line-height: 1.6rem;
				height: 1.8rem;
				background: var(--darkerColor);
				button {
					color: white;
					font-weight: 500;
				}

				background: linear-gradient(
					180deg,
					var(--darkColor) 0%,
					var(--darkerColor) 50%
				);
				border: 1px solid var(--darkerColor);

				color: white;

				display: flex;
				align-items: center;
				justify-content: space-evenly;

				img {
					font-size: 160%;
					vertical-align: middle;
				}

				${selected && `border: 2px solid var(--lightColor)`}
			`}
			onClick={() =>
				setSearchParams({
					otherSearchParams,
					...(selected ? {} : { métrique: 'pétrole' }),
				})
			}
		>
			{emoji('🇺🇦')} <span>Réduire ma conso de pétrole</span>
		</button>
	)
}
