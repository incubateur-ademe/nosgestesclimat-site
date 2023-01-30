import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import IllustratedMessage from '../ui/IllustratedMessage'
import { usePersistingState } from '../utils/persistState'
import useLocalisation, {
	getSupportedFlag,
	isSupportedRegion,
} from './useLocalisation'

export default () => {
	const [messagesRead, setRead] = usePersistingState(
		'localisationMessagesRead',
		[]
	)
	const localisation = useLocalisation()
	if (!localisation?.country) return null
	const supported = isSupportedRegion(localisation?.country?.code)
	if (!supported) return null
	const { code, gentilé, nom } = supported
	if (code === 'FR') return null
	if (messagesRead.includes(code)) return null
	const flag = getSupportedFlag(localisation?.country.code)

	const versionName = gentilé ?? nom

	return (
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
