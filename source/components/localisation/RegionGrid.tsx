import { useDispatch, useSelector } from 'react-redux'
import { setLocalisation } from '../../actions/actions'
import { capitalise0 } from '../../utils'
import CountryFlag from './CountryFlag'
import useOrderedSupportedRegions from './useOrderedSupportedRegions'

export default ({ noButton }) => {
	const dispatch = useDispatch()
	const currentLang = useSelector((state) => state.currentLang).toLowerCase()

	const orderedSupportedRegions = useOrderedSupportedRegions()

	return (
		<ul
			css={`
				padding: 0;
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
						if (noButton) return
						const newLocalisation = {
							country: { name: params[currentLang]?.nom, code },
							userChosen: true,
						}
						dispatch(setLocalisation(newLocalisation))
						dispatch({ type: 'SET_LOCALISATION_BANNERS_READ', regions: [] })
					}}
				>
					<ListItemComponent
						{...{
							code,
							noButton,
							label: capitalise0(params[currentLang]?.nom),
						}}
					/>
				</li>
			))}
		</ul>
	)
}

const listItemStyle = `
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
	@media (max-width: 400px) {
		width: 6rem !important;
		flex-direction: column;
		padding: 0.4rem 0 !important;
		text-align: center;
		justify-content: center;
		height: 4rem;
	}
`
const ListItemComponent = ({ code, noButton, label }) =>
	noButton ? (
		<span className="ui__ card" css={listItemStyle}>
			<ListItemComponentContent code={code} label={label} />
		</span>
	) : (
		<button className="ui__ card" css={listItemStyle}>
			<ListItemComponentContent code={code} label={label} />
		</button>
	)

const ListItemComponentContent = ({ code, label }) => (
	<>
		<CountryFlag code={code} />
		{label}
	</>
)
