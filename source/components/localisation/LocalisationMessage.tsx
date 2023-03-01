import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import IllustratedMessage from '../ui/IllustratedMessage'
import useLocalisation from './useLocalisation'
import {
	defaultModel,
	getCountryNameInFrench,
	getFlag,
	getFlagImgSrc,
	supportedRegion,
} from './utils'
export default () => {
	const messagesRead = useSelector(
		(state) => state.sessionLocalisationBannersRead
	)
	const dispatch = useDispatch()
	const localisation = useLocalisation()
	const currentLang = useSelector((state) => state.currentLang)
	const regionParams = supportedRegion(localisation?.country?.code)
	const flag = getFlag(localisation?.country?.code)

	if (!localisation?.country) return
	if (messagesRead.includes(localisation?.country?.code)) return

	if (localisation?.country?.code === defaultModel) return

	const countryName =
		currentLang == 'Fr'
			? getCountryNameInFrench(localisation?.country?.code)
			: localisation?.country?.name

	const versionName =
		currentLang == 'Fr'
			? regionParams?.gentilé ?? regionParams?.nom
			: localisation?.country?.name

	return !regionParams ? (
		<IllustratedMessage
			width="32rem"
			direction="row"
			backgroundcolor="#fff8d3"
			message={
				<div>
					<p>
						<Trans>
							Nous avons détecté que vous faites cette simulation depuis
						</Trans>{' '}
						{countryName}
						<img
							src={flag ?? getFlagImgSrc(localisation?.country?.code)}
							aria-hidden="true"
							css={`
								height: 1rem;
								margin: 0 0.3rem;
								vertical-align: sub;
							`}
						/>
						.
						<p css="margin-top: 0.5rem">
							<b>
								<Trans i18nKey="components.localisation.LocalisationMessage.warnMessage">
									Votre région n'est pas encore supportée, le modèle Français
									vous est proposé par défaut.
								</Trans>
							</b>
						</p>
					</p>
					<p>
						<small>
							<Link to="/profil">
								<Trans>Choisissez une région parmi celles disponibles !</Trans>
							</Link>
						</small>
					</p>
					<button
						className="ui__ button plain small "
						css={`
							margin-left: auto;
							margin-right: 0rem;
							display: block !important;
						`}
						onClick={() =>
							dispatch({
								type: 'SET_LOCALISATION_BANNERS_READ',
								regions: [...messagesRead, localisation?.country?.code],
							})
						}
					>
						<Trans>J'ai compris</Trans>
					</button>
				</div>
			}
		/>
	) : (
		<IllustratedMessage
			width="32rem"
			direction="row"
			backgroundcolor="#fff8d3"
			image={flag}
			message={
				<div>
					<p>
						<Trans
							i18nKey={'components.localisation.LocalisationMessage.version'}
						>
							Vous utilisez la version <strong>{{ versionName }}</strong> du
							test.
						</Trans>
						{regionParams?.code !== defaultModel && (
							<span>
								{' '}
								<Trans i18nKey="components.localisation.LocalisationMessage.betaMsg">
									Elle est actuellement en version <strong>bêta</strong>.
								</Trans>
							</span>
						)}{' '}
					</p>
					<p>
						<small>
							<Trans>Pas votre région ?</Trans>{' '}
							<Link to="/profil">
								<Trans>Choisissez la vôtre</Trans>
							</Link>
							.
						</small>
					</p>
					<button
						className="ui__ button plain small "
						css={`
							margin-left: auto;
							margin-right: 0rem;
							display: block !important;
						`}
						onClick={() =>
							dispatch({
								type: 'SET_LOCALISATION_BANNERS_READ',
								regions: [...messagesRead, regionParams?.code],
							})
						}
					>
						<Trans>J'ai compris</Trans>
					</button>
				</div>
			}
		/>
	)
}
