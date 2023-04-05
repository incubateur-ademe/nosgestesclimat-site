import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { setLocalisation } from '../../actions/actions'
import { capitalise0 } from '../../utils'
import IllustratedMessage from '../ui/IllustratedMessage'
import NewTabSvg from '../utils/NewTabSvg'
import CountryFlag from './CountryFlag'

export default ({ open = false }) => {
	const dispatch = useDispatch()
	const currentLang = useSelector((state) => state.currentLang).toLowerCase()

	const supportedRegions = useSelector((state) => state.supportedRegions)
	// Regions displayed sorted alphabetically
	const orderedSupportedRegions = Object.fromEntries(
		Object.entries(supportedRegions)
			// sort function from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
			.sort((a, b) => {
				const nameA = a[1][currentLang].nom.toUpperCase() // ignore upper and lowercase
				const nameB = b[1][currentLang].nom.toUpperCase() // ignore upper and lowercase
				if (nameA < nameB) {
					return -1
				}
				if (nameA > nameB) {
					return 1
				}
				// names must be equal
				return 0
			})
	)
	const numberOfRegions = Object.entries(orderedSupportedRegions).length
	return (
		<>
			<details
				open={open}
				css={`
					summary {
						text-align: center;
						border-radius: 0.8rem;
						padding: 0.1rem 0.8rem;
						background: var(--lightestColor);
						width: auto;
					}
				`}
			>
				<summary>
					🗺️ <Trans>Choisir une autre région</Trans>
					&nbsp;
					<small title={`${numberOfRegions} régions`}>{numberOfRegions}</small>
				</summary>
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
									width: 8rem !important;
									height: 3rem;
									justify-content: start;
									align-items: center;
									padding: 0;
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
				<IllustratedMessage
					emoji="🌐"
					message={
						<div>
							<p>
								<Trans>
									Envie de contribuer à une version pour votre région ?
								</Trans>{' '}
								<a
									target="_blank"
									href="https://github.com/datagir/nosgestesclimat/blob/master/INTERNATIONAL.md"
								>
									<Trans>Suivez le guide !</Trans>
									<NewTabSvg />
								</a>
							</p>
						</div>
					}
					inline={undefined}
					image={undefined}
					width={undefined}
					direction={undefined}
					backgroundcolor={undefined}
				/>
			</details>
		</>
	)
}
