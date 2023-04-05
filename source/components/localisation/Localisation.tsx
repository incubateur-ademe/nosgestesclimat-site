import useLocalisation from 'Components/localisation/useLocalisation'
import {
	getCountryNameInCurrentLang,
	getFlag,
	supportedRegion,
} from 'Components/localisation/utils'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { resetLocalisation, setLocalisation } from '../../actions/actions'
import { usePersistingState } from '../../components/utils/persistState'
import { capitalise0 } from '../../utils'
import IllustratedMessage from '../ui/IllustratedMessage'
import NewTabSvg from '../utils/NewTabSvg'

export default ({ title = 'Ma région de simulation' }) => {
	const [chosenIp, chooseIp] = usePersistingState('IP', undefined)
	const localisation = useLocalisation(chosenIp)
	const dispatch = useDispatch()
	const currentLang = useSelector((state) => state.currentLang).toLowerCase()

	const supportedRegions = useSelector((state) => state.supportedRegions)
	const isSupported = supportedRegion(localisation?.country?.code)
	const flag = getFlag(localisation?.country?.code)

	const countryName = getCountryNameInCurrentLang(localisation)
	const { t } = useTranslation()

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
		<div>
			<h2>📍 {t(title)}</h2>
			{localisation != null ? (
				isSupported ? (
					<p>
						{localisation?.userChosen ? (
							<span>
								<Trans>Vous avez choisi</Trans>{' '}
							</span>
						) : (
							<span>
								<Trans>
									Nous avons détecté que vous faites cette simulation depuis
								</Trans>{' '}
							</span>
						)}
						{countryName}
						<img
							src={flag}
							aria-hidden="true"
							css={`
								height: 1rem;
								margin: 0 0.3rem;
								vertical-align: sub;
							`}
						/>
						.{' '}
						{localisation?.userChosen && (
							<button
								className="ui__ dashed-button"
								onClick={() => {
									dispatch(resetLocalisation())
								}}
							>
								<Trans>Revenir chez moi 🔙</Trans>
							</button>
						)}
					</p>
				) : (
					localisation?.country && (
						<p>
							<Trans>
								Nous avons détecté que vous faites cette simulation depuis
							</Trans>{' '}
							{countryName}
							<img
								src={flag}
								aria-hidden="true"
								css={`
									height: 1rem;
									margin: 0 0.3rem;
									vertical-align: sub;
								`}
							/>
							.
							<Trans i18nKey="components.localisation.Localisation.warnMessage">
								Pour le moment, il n'existe pas de modèle de calcul pour{' '}
								{{ countryName }}, le modèle Français vous est proposé par
								défaut.
							</Trans>
						</p>
					)
				)
			) : (
				<p>
					<Trans i18nKey="components.localisation.Localisation.warnMessage2">
						Nous n'avons pas pu détecter votre pays de simulation, le modèle
						Français vous est proposé par défaut.
					</Trans>{' '}
				</p>
			)}
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
		</div>
	)
}
