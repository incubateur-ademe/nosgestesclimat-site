import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import IllustratedMessage from '../ui/IllustratedMessage'
import { usePersistingState } from '../utils/persistState'
import useLocalisation, {
	getCountryNameInFrench,
	getFlagImgSrc,
	getSupportedFlag,
	isSupportedRegion,
} from './useLocalisation'

export default () => {
	const [messagesRead, setRead] = usePersistingState(
		'localisationMessagesRead',
		[]
	)
	const localisation = useLocalisation()
	const currentLang = useSelector((state) => state.currentLang)

	if (!localisation?.country) return
	if (messagesRead.includes(localisation?.country.code)) return

	const supported = isSupportedRegion(localisation?.country?.code)

	if (supported && localisation?.country?.code === 'FR') return

	const { code, gentilé, nom } = supported || isSupportedRegion('FR')

	const flag = getSupportedFlag(localisation?.country.code)
	const countryName =
		currentLang == 'Fr'
			? getCountryNameInFrench(localisation?.country?.code)
			: localisation?.country?.name

	const versionName = gentilé ?? nom

	return !supported ? (
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
							src={
								getSupportedFlag(localisation?.country?.code) ||
								getFlagImgSrc(localisation?.country?.code)
							}
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
									Votre région n'est pas encore supportée, vous utilisez donc le
									modèle Français par défault.
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
							setRead([...messagesRead, localisation?.country?.code])
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
						{code !== 'FR' && (
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
								<Trans>Choisissez la votre</Trans>
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
						onClick={() => setRead([...messagesRead, code])}
					>
						<Trans>J'ai compris</Trans>
					</button>
				</div>
			}
		/>
	)
}
