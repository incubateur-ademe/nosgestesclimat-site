import { useDispatch, useSelector } from 'react-redux'
import { setLocalisation } from '../../actions/actions'
import { capitalise0 } from '../../utils'
import CountryFlag from './CountryFlag'
import useOrderedSupportedRegions from './useOrderedSupportedRegions'

export default ({ open = false }) => {
	const dispatch = useDispatch()
	const currentLang = useSelector((state) => state.currentLang).toLowerCase()

	const orderedSupportedRegions = useOrderedSupportedRegions()
	return (
		<ul
			css={`
				margin-top: 1rem;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-evenly;
				li {
					margin: 0.4rem 0.6rem;
					list-style-type: none;
				}
			`}
		>
			{Object.entries(orderedSupportedRegions).map(([code, params]) => (
				<li
					key={code}
					onClick={() => {
						const newLocalisation = {
							country: { name: params[currentLang]?.nom, code },
							userChosen: true,
						}
						dispatch(setLocalisation(newLocalisation))
						dispatch({ type: 'SET_LOCALISATION_BANNERS_READ', regions: [] })
					}}
				>
					<button
						className="ui__ card"
						css={`
							display: flex;
							width: 9rem !important;
							height: 3rem;
							justify-content: start;
							align-items: center;
							padding: 0 0.4rem !important;
							font-size: 0.75rem;
							color: var(--darkColor);
							text-align: left;
							img {
								margin-right: 0.6rem;
							}
						`}
					>
						<CountryFlag code={code} />
						{capitalise0(params[currentLang]?.nom)}
					</button>
				</li>
			))}
		</ul>
	)
}
