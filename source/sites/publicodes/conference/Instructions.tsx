import QRCode from 'qrcode.react'
import { useContext, useState } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import emoji from '../../../components/emoji'
import ShareButton from '../../../components/ShareButton'
import { ThemeColorsContext } from '../../../components/utils/colors'
import { useQuery } from '../../../utils'
import LoadingButton from './LoadingButton'
import NamingBlock from './NamingBlock'

/* The conference mode can be used with two type of communication between users : P2P or database. The P2P mode was implemented first, then we decided that we needed a survey mode, with permanent data. But YJS is not yet designed plug and play for persistence, hence our survey mode will be implemented using Supabase/Postgre.
 *
 * However, the database mode for Conference could still be usefull for restricted networks (e.g. entreprise) where P2P is forbidden. We could then have a server handling the yjs-websocket server. It could crash without any persistence garantee : some users would have the backup anyway (rehydratation in case of server crash to be tested).
 *
 * */

export default ({
	room,
	newRoom,
	setNewRoom,
	mode: defaultMode = 'conférence',
	started = false,
}) => {
	const URLMode = useQuery().get('mode')
	const history = useHistory()
	const [mode, setModeState] = useState(URLMode || defaultMode)
	const setMode = (mode) => {
		setModeState(mode)

		history.push({ pathname: '/groupe', search: '?mode=' + mode })
	}
	const { color } = useContext(ThemeColorsContext)
	const URLbase = `https://${window.location.hostname}`
	const URLPath = `/${mode}/${room || newRoom}`,
		shareURL = URLbase + URLPath
	const URLGuide = `/groupe/guide`

	return (
		<div>
			{!room && (
				<>
					<p>
						Le test d'empreinte climat est individuel, mais nous vous proposons
						ici de le faire à plusieurs. Chacun sera derrière son écran, mais
						visualisera en temps-réel les résultats des autres.
					</p>
					<p>
						C'est l'occasion de se confronter aux autres et de réfléchir
						ensemble aux enjeux de notre propre impact.
					</p>
				</>
			)}
			<h2>{emoji('📘')} Comment ça marche ?</h2>
			{!started && (
				<InstructionBlock
					index="1"
					title={<span>{emoji('💡 ')} Choisissez un nom de salle</span>}
				>
					{!room && <NamingBlock {...{ newRoom, setNewRoom }} />}
					{room && <p>{emoji('✅')} C'est fait</p>}
				</InstructionBlock>
			)}
			{!started && newRoom !== '' && !room && (
				<InstructionBlock
					index="2"
					title={
						<span>{emoji('⏲️')} Choississez votre mode de simulation</span>
					}
				>
					<div
						css={`
							display: flex;
							flex-wrap: wrap;
							label {
								flex: auto !important;
								max-width: 16rem !important;
								cursor: pointer;
							}
						`}
					>
						<label
							className={`ui__ card box interactive ${
								mode === 'conférence' ? 'selected' : ''
							}`}
						>
							<input
								type="radio"
								name="mode"
								value="conférence"
								checked={mode === 'conférence'}
								onChange={(e) => setMode(e.target.value)}
							/>
							<h3>Conférence</h3>
							<p>
								Mode éphémère : parfait pour l'animation d'un atelier, une
								présentation interactive ou entre amis. Les données restent
								entre les participants (pair-à-pair), sans serveur,{' '}
								<strong>juste le temps de la conférence</strong>.
							</p>
						</label>
						<label
							className={`ui__ card box interactive ${
								mode === 'sondage' ? 'selected' : ''
							}`}
						>
							<input
								type="radio"
								name="mode"
								value="sondage"
								checked={mode === 'sondage'}
								onChange={(e) => setMode(e.target.value)}
							/>
							<h3>Sondage</h3>
							<p>
								Mode persistant : l'interface est presque la même, mais les
								données sont stockées sur notre serveur et ainsi restent
								accessibles <strong>pendant deux mois</strong>.
							</p>
						</label>
					</div>
					{mode == 'conférence' && (
						<p>
							{emoji('🔒️')} Votre organisation peut bloquer l'utilisation du
							mode conférence. Faites le test au préalable en duo : en cas de
							problème, vous pouvez utiliser le mode sondage.
						</p>
					)}
					{mode == 'sondage' && (
						<p>
							{emoji('💡')} Vous souhaitez ajouter des questions pour obtenir
							des informations supplémentaires sur les répondants ? Découvrez la
							fonctionnalité "contextualisation de sondage" grâce à notre{' '}
							<Link to={'/groupe/documentation-contexte'}>
								notre page guide{' '}
							</Link>
							.
						</p>
					)}
				</InstructionBlock>
			)}
			{!started && (
				<InstructionBlock
					index="3"
					title={
						<span>
							{emoji('🔗 ')} Partagez le lien à vos amis, collègues, etc.
						</span>
					}
				>
					{!newRoom && !room ? (
						<p>Choississez d'abord un nom</p>
					) : (
						<div
							css={`
								display: flex;
								flex-wrap: wrap;
								justify-content: center;
								align-items: center;
							`}
						>
							<QRCode
								value={shareURL}
								size={200}
								bgColor={'#ffffff'}
								fgColor={color}
								level={'L'}
								includeMargin={false}
								renderAs={'canvas'}
							/>
							<ShareButton
								text="Faites un test d'empreinte climat avec moi"
								url={shareURL}
								title={'Nos Gestes Climat Conférence'}
							/>
						</div>
					)}
				</InstructionBlock>
			)}
			<InstructionBlock
				index="4"
				noIndex={started}
				title={
					<span>{emoji('🎰 ')} Faites toutes et tous votre simulation</span>
				}
			>
				{room ? (
					<Link to={'/simulateur/bilan'}>
						<button className="ui__ button plain">Faites votre test </button>
					</Link>
				) : mode === 'conférence' ? (
					<p>
						Au moment convenu, ouvrez ce lien tous en même temps et faites
						chacun de votre côté votre simulation.
					</p>
				) : (
					<p>
						Pendant 2 semaines, les participants doivent venir faire leur
						simulation sur ce lien.
					</p>
				)}
			</InstructionBlock>
			<InstructionBlock
				index="5"
				noIndex={started}
				title={
					<span>
						{emoji('🧮 ')} Visualisez à tout moment les résultats de votre
						groupe
					</span>
				}
			>
				Les résultats pour chaque catégorie (alimentation, transport, logement
				...) s'affichent progressivement et en temps réel pour l'ensemble du
				groupe sur{' '}
				{!started ? (
					"la page à partager à l'étape 3"
				) : (
					<span>
						cette page <Link to={URLPath}>{URLPath}</Link>
					</span>
				)}
				.
			</InstructionBlock>
			{newRoom !== '' && !room && (
				<InstructionBlock index="6" title="Prêt à démarrer ?">
					<LoadingButton {...{ mode, URLPath, room: room || newRoom }} />
				</InstructionBlock>
			)}
			{room && (
				<InstructionBlock
					noIndex={started}
					title={
						<span>
							{emoji('📊')} Analysez les résultats et animez les discussions !
						</span>
					}
				>
					Les résultats sont là, que faire ? Notre guide vous accompagne dans
					vos réflexions et vos discussions sur cette page &nbsp;
					<Link to={URLGuide}>{URLGuide}</Link> !
				</InstructionBlock>
			)}
		</div>
	)
}

const InstructionBlock = ({ title, index, children, noIndex }) => (
	<div
		className="ui__ card"
		css={`
			display: flex;
			justify-content: start;
			align-items: center;
			margin: 1rem;
			padding-bottom: 0.6rem;
			@media (max-width: 800px) {
				flex-direction: column;
			}
		`}
	>
		{!noIndex && (
			<div
				css={`
					font-size: 300%;
					padding: 1rem;
					background: var(--lightercolor);
					border-radius: 5rem;
					margin: 0 1rem;
				`}
			>
				{index}
			</div>
		)}
		<div>
			<h3>{title}</h3>
			{children}
		</div>
	</div>
)
