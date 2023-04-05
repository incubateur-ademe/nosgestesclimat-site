import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { setLocalisation } from '../../actions/actions'
import { capitalise0 } from '../../utils'
import IllustratedMessage from '../ui/IllustratedMessage'
import NewTabSvg from '../utils/NewTabSvg'

export default () => {
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
	return (
		<>
			<details>
				<summary>
					<Trans>Choisir une autre région</Trans>
				</summary>
				<ul
					css={`
						columns: 3;
						-webkit-columns: 3;
						-moz-columns: 3;
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
								css={`
									padding: 0;
									font-size: 0.75rem;
									color: var(--darkColor);
								`}
							>
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
				/>
			</details>
		</>
	)
}
