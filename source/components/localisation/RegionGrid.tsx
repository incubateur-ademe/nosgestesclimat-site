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
				max-width: 760px;
				margin: 0 auto;
				padding: 0;
				margin-top: 1rem;
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
				gap: 1rem;
				li {
					margin: 0.4rem 0;
					display: flex;
					justify-content: center;
					list-style-type: none;
				}
				@media (max-width: 400px) {
					grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr));
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
	line-height: 1;
	
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

		img {
			margin-bottom: 0.5rem;
		}
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
