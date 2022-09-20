import IllustratedMessage from '../ui/IllustratedMessage'
import useLocalisation, {
	getFlagImgSrc,
	getSupportedFlag,
} from './useLocalisation'
import supportedCountries from './supportedCountries.yaml'
import { Link } from 'react-router-dom'
import { usePersistingState } from '../utils/persistState'

export default () => {
	const [messagesRead, setRead] = usePersistingState(
		'localisationMessagesRead',
		[]
	)
	const localisation = useLocalisation()
	if (!localisation) return null
	const supported = supportedCountries.find(
		(c) => c.code === localisation.country.code
	)
	if (!supported) return null
	const { code, gentilé, nom } = supported
	if (code === 'FR') return null
	if (messagesRead.includes(code)) return null
	const flag = getSupportedFlag(localisation)

	return (
		<IllustratedMessage
			width="32rem"
			direction="row"
			backgroundcolor="#fff8d3"
			image={flag}
			message={
				<div>
					<p>
						Vous utilisez la version <strong>{gentilé || nom}</strong> du test.
						{code !== 'FR' && (
							<span>
								{' '}
								Elle est actuellement en version <strong>bêta</strong>.
							</span>
						)}{' '}
					</p>
					<p>
						<small>
							Pas votre région ? <Link to="/profil">Choisissez la votre</Link>.
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
						J'ai compris
					</button>
				</div>
			}
		/>
	)
}
