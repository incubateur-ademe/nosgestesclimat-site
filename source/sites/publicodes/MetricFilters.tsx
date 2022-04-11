import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import emoji from '../../components/emoji'
import { useSearchParams } from '../../components/utils/useSearchParams'
export default ({ selected }) => {
	const location = useLocation()
	const [searchParams, setSearchParams] = useSearchParams()
	const { métrique, ...otherSearchParams } = searchParams
	return (
		<div
			css={`
				margin-bottom: 0.2rem;
				margin: 0 auto;
				width: 14rem;
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
				${!selected &&
				`


				background: white;
				border: 1px solid var(--darkerColor);

				button {color: var(--darkerColor);}
				


				`}
			`}
		>
			<button
				onClick={() =>
					setSearchParams({
						otherSearchParams,
						...(selected ? {} : { métrique: 'pétrole' }),
					})
				}
			>
				{emoji('🎯')} Réduire ma conso de pétrole
			</button>
		</div>
	)
}
