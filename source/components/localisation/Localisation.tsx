import useLocalisation from 'Components/localisation/useLocalisation'
import {
	getCountryNameInFrench,
	getFlag,
	supportedRegion,
} from 'Components/localisation/utils'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { resetLocalisation, setLocalisation } from '../../actions/actions'
import { usePersistingState } from '../../components/utils/persistState'
import { capitalise0 } from '../../utils'
import IllustratedMessage from '../ui/IllustratedMessage'
import NewTabSvg from '../utils/NewTabSvg'

export default () => {
	const [chosenIp, chooseIp] = usePersistingState('IP', undefined)
	const localisation = useLocalisation(chosenIp)
	const dispatch = useDispatch()

	const supportedRegions = useSelector((state) => state.supportedRegions)
	const isSupported = supportedRegion(localisation?.country?.code)
	const flag = getFlag(localisation?.country?.code)
	const currentLang = useSelector((state) => state.currentLang)
	const countryName =
		currentLang == 'Fr'
			? getCountryNameInFrench(localisation?.country?.code)
			: localisation?.country?.name

	return (
		<div>
			<h2>
				<Trans>📍 Région de simulation</Trans>
			</h2>
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
									dispatch(setLocalisation(resetLocalisation))
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
				<ul>
					{Object.values(supportedRegions).map(({ nom, code }) => (
						<li
							key={code}
							onClick={() => {
								const newLocalisation = {
									country: { name: nom, code },
									userChosen: true,
								}
								dispatch(setLocalisation(newLocalisation))
								dispatch({ type: 'SET_LOCALISATION_BANNERS_READ', regions: [] })
							}}
						>
							<button>{capitalise0(nom)}</button>
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
