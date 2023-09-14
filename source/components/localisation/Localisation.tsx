import useLocalisation from 'Components/localisation/useLocalisation'
import {
	useCountryNameInCurrentLang,
	useFlag,
	useSupportedRegion,
} from 'Components/localisation/utils'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { resetLocalisation } from '../../actions/actions'
import { usePersistingState } from '../../hooks/usePersistState'
import { AppState } from '../../reducers/rootReducer'
import RegionModelAuthors, {
	DEFAULT_REGION_MODEL_AUTHOR,
	RegionAuthor,
} from './RegionModelAuthors'
import RegionSelector from './RegionSelector'
import { Localisation, Region } from './utils'

export default ({ title = 'Ma région de simulation' }) => {
	const { t } = useTranslation()
	const currentLang = useSelector(
		(state: AppState) => state.currentLang
	).toLowerCase()
	const [chosenIp, _] = usePersistingState('IP', undefined)
	const localisation: Localisation | undefined = useLocalisation(chosenIp)
	const dispatch = useDispatch()
	const iframeLocalisationOption = useSelector(
		(state: AppState) => state?.iframeOptions?.iframeLocalisation
	)
	const regionParams: Region | undefined = useSupportedRegion(
		localisation?.country?.code
	)
	const flag = useFlag(localisation?.country?.code)
	const authors: RegionAuthor[] = regionParams?.[currentLang]?.authors ?? [
		DEFAULT_REGION_MODEL_AUTHOR,
	]
	const countryName = useCountryNameInCurrentLang(localisation)

	const versionName = regionParams
		? regionParams[currentLang]['gentilé'] ?? regionParams[currentLang]['nom']
		: localisation?.country?.name

	return (
		<div>
			<h2>📍 {t(title)}</h2>
			{localisation != null ? (
				regionParams ? (
					<>
						<p>
							{localisation?.userChosen ? (
								<span>
									<Trans>Vous avez choisi </Trans>
									{countryName}
								</span>
							) : iframeLocalisationOption ? (
								<span>
									<Trans> Vous utilisez la version {versionName} du test</Trans>
								</span>
							) : (
								<span>
									<Trans>
										Nous avons détecté que vous faites cette simulation depuis{' '}
									</Trans>
									{countryName}
								</span>
							)}
							<img
								src={flag}
								aria-hidden="true"
								alt="Country Flag"
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
						<RegionModelAuthors authors={authors} />
					</>
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
			{}
			<RegionSelector />
		</div>
	)
}
