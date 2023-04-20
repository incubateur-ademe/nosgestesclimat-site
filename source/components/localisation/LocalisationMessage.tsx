import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { TrackerContext } from '../../contexts/TrackerContext'
import IllustratedMessage from '../ui/IllustratedMessage'
import CountryFlag from './CountryFlag'
import useLocalisation from './useLocalisation'
import {
	defaultModel,
	getCountryNameInCurrentLang,
	supportedRegion,
} from './utils'
export default () => {
	const tracker = useContext(TrackerContext)
	const messagesRead = useSelector(
		(state) => state.sessionLocalisationBannersRead
	)
	const dispatch = useDispatch()
	const localisation = useLocalisation()
	const currentLang = useSelector((state) => state.currentLang).toLowerCase()
	const code = localisation?.country?.code
	const regionParams = supportedRegion(code)
	const countryName = getCountryNameInCurrentLang(localisation)

	const versionName = regionParams
		? regionParams[currentLang]['gentilé'] ?? regionParams[currentLang]['nom']
		: localisation?.country?.name

	if (messagesRead.includes(code)) return

	if (code === defaultModel) return

	return (
		<IllustratedMessage
			emoji="📍"
			width="32rem"
			direction="row"
			backgroundcolor="#fff8d3"
			message={
				<div>
					{regionParams ? (
						<p>
							<Trans
								i18nKey={'components.localisation.LocalisationMessage.version'}
							>
								Vous utilisez la version <strong>{{ versionName }}</strong> du
								test
							</Trans>
							<CountryFlag code={code} />.
							{code !== defaultModel && (
								<span>
									{' '}
									<Trans i18nKey="components.localisation.LocalisationMessage.betaMsg">
										Elle est actuellement en version <strong>bêta</strong>.
									</Trans>
								</span>
							)}{' '}
						</p>
					) : localisation ? (
						<p>
							<Trans>
								Nous avons détecté que vous faites cette simulation depuis
							</Trans>{' '}
							{countryName}
							<CountryFlag code={code} />.
							<p css="margin-top: 0.5rem">
								<b>
									<Trans i18nKey="components.localisation.LocalisationMessage.warnMessage">
										Votre région n'est pas encore supportée, le modèle Français
										vous est proposé par défaut
									</Trans>
								</b>
								<CountryFlag code={defaultModel} />
								<b>.</b>
							</p>
						</p>
					) : (
						<p>
							<Trans i18nKey="components.localisation.LocalisationMessage.warnMessage2">
								Nous n'avons pas pu détecter votre pays de simulation, le modèle
								Français vous est proposé par défaut
							</Trans>
							<CountryFlag code={defaultModel} />.
						</p>
					)}
					<p>
						{localisation && regionParams ? (
							<small>
								<Trans>Pas votre région ?</Trans>{' '}
								<Link to="/profil">
									<Trans>Choisissez la vôtre</Trans>
								</Link>
								.
							</small>
						) : (
							<small>
								<Link to="/profil">
									<Trans>
										Choisissez une région parmi celles disponibles !
									</Trans>
								</Link>
							</small>
						)}
					</p>
					<button
						className="ui__ button plain small "
						css={`
							margin-left: auto;
							margin-right: 0rem;
							display: block !important;
						`}
						onClick={() => {
							dispatch({
								type: 'SET_LOCALISATION_BANNERS_READ',
								regions: [...messagesRead, code],
							})
							tracker.push([
								'trackEvent',
								'I18N',
								'Clic bannière localisation',
								code,
							])
						}}
					>
						<Trans>J'ai compris</Trans>
					</button>
				</div>
			}
			inline={undefined}
			image={undefined}
		/>
	)
}
