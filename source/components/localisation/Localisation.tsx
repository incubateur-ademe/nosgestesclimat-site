import useLocalisation from 'Components/localisation/useLocalisation'
import {
	getCountryNameInCurrentLang,
	getFlag,
	getSupportedRegion,
} from 'Components/localisation/utils'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { resetLocalisation } from '../../actions/actions'
import { usePersistingState } from '../../components/utils/persistState'
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
	const regionParams: Region | undefined = getSupportedRegion(
		localisation?.country?.code
	)
	const flag = getFlag(localisation?.country?.code)
	const authors: RegionAuthor[] = regionParams?.[currentLang]?.authors ?? [
		DEFAULT_REGION_MODEL_AUTHOR,
	]
	const countryName = getCountryNameInCurrentLang(localisation)

	return (
		<div>
			<h2>📍 {t(title)}</h2>
			{localisation != null ? (
				regionParams ? (
					<>
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
