import { Trans } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

export default ({ selected }) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const { métrique, ...otherSearchParams } = searchParams

	return (
		<button
			css={`
				margin: 0 auto;
				margin-bottom: 0.4rem;
				width: 16rem;
				text-align: center;
				padding: 0.1rem 0rem;
				border-radius: 0.2rem;
				line-height: 1.6rem;
				height: 2.2rem;
				background: var(--darkerColor);
				button {
					color: white;
					font-weight: 500;
				}

				background: linear-gradient(
					100deg,
					var(--darkerColor) 0%,
					var(--color) 100%
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

				${selected && 'border: 4px solid gold'}
			`}
			onClick={() =>
				setSearchParams({
					otherSearchParams,
					...(selected ? {} : { métrique: 'pétrole' }),
				})
			}
		>
			<span>
				<Trans>Réduire ma conso de pétrole</Trans>
			</span>
		</button>
	)
}
