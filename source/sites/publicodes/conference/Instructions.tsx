import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import emoji from '../../../components/emoji'
import { ThemeColorsContext } from '../../../components/utils/colors'
import NamingBlock from './NamingBlock'
import QRCode from 'qrcode.react'
import ShareButton from '../../../components/ShareButton'
import { Redirect, useHistory } from 'react-router'
import { motion } from 'framer-motion'
import LoadingButton from './LoadingButton'

/* The conference mode can be used with two type of communication between users : P2P or database. The P2P mode was implemented first, then we decided that we needed a survey mode, with permanent data. But YJS is not yet designed plug and play for persistence, hence our survey mode will be implemented using Supabase/Postgre.
 *
 * However, the database mode for Conference could still be usefull for restricted networks (e.g. entreprise) where P2P is forbidden. We could then have a server handling the yjs-websocket server. It could crash without any persistence garantee : some users would have the backup anyway (rehydratation in case of server crash to be tested).
 *
 * */

export default ({ room, newRoom, setNewRoom }) => {
	const [mode, setMode] = useState('conférence')
	const { color } = useContext(ThemeColorsContext)
	const URLbase = `https://${window.location.hostname}`
	const URLPath = `/${mode}/${room || newRoom}`,
		shareURL = URLbase + URLPath
	return (
		<div>
			{!room && (
				<p>
					Le test d'empreinte climat est individuel, mais nous vous proposons
					ici de le faire à plusieurs.
				</p>
			)}
			<h2>{emoji('📘')} Comment ça marche ?</h2>
			<InstructionBlock
				index="1"
				title={<span>{emoji('💡 ')} Choisissez un nom de salle</span>}
			>
				{!room && <NamingBlock {...{ newRoom, setNewRoom }} />}
				{room && <p>{emoji('✅')} C'est fait</p>}
			</InstructionBlock>
			{newRoom !== '' && !room && (
				<InstructionBlock
					index="2"
					title={
						<span>{emoji('⏲️')} Choississez votre mode de simulation</span>
					}
				>
					<div
						css={`
							display: flex;
							label {
								flex: auto !important;
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
								Mode éphémère : parfait entre amis, ou pour une présentation
								intéractive lors d'une conférence. Les données restent entre les
								participants (pair-à-pair), sans serveur, juste le temps de la
								conférence.
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
								Mode persistant : les données sont stockées sur notre serveur,
								restent accessibles dans le temps.{' '}
							</p>
							<p>
								Si votre entreprise bride votre réseau interne, utilisez ce
								mode.
							</p>
						</label>
					</div>
				</InstructionBlock>
			)}
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
			<InstructionBlock
				index="4"
				title={
					<span>{emoji('👆 ')} Faites toutes et tous votre simulation</span>
				}
			>
				{room ? (
					<Link to={'/simulateur/bilan'}>
						<button className="ui__ button plain">Faites votre test </button>
					</Link>
				) : (
					<p>
						Au moment convenu, ouvrez ce lien tous en même temps et
						commencez&nbsp; votre simulation.
					</p>
				)}
			</InstructionBlock>
			<InstructionBlock
				index="5"
				title={
					<span>
						{emoji('🧮 ')} Visualisez ensemble les résultats de votre groupe
					</span>
				}
			>
				Les résultats pour chaque catégorie (alimentation, transport, logement
				...) s'affichent progressivement et en temps réel pour l'ensemble du
				groupe.
			</InstructionBlock>
			{newRoom !== '' && !room && (
				<InstructionBlock index="6" title="Prêt à démarrer ?">
					<p>
						<LoadingButton {...{ mode, URLPath, room: room || newRoom }} />
					</p>
				</InstructionBlock>
			)}
		</div>
	)
}

const InstructionBlock = ({ title, index, children }) => (
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
		<div>
			<h3>{title}</h3>
			{children}
		</div>
	</div>
)
