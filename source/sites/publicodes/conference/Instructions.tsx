import QRCode from 'qrcode.react'
import { useContext, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
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
	mode: defaultMode = 'sondage',
	started = false,
}) => {
	const URLMode = useQuery().get('mode')
	const navigate = useNavigate()
	const [mode, setModeState] = useState(URLMode || defaultMode)
	const setMode = (mode) => {
		setModeState(mode)

		navigate(`/groupe?mode=${mode}`, { replace: true })
	}
	const { color } = useContext(ThemeColorsContext)
	const URLbase = `https://${window.location.hostname}`
	const URLPath = `/${mode}/${room || newRoom}`,
		shareURL = URLbase + URLPath
	const URLGuide = `/guide`

	const { t } = useTranslation()

	return (
		<div>
			{!room && (
				<Trans i18nKey={'publicodes.conference.Instructions.intro'}>
					<p>
						Le test d'empreinte climat est individuel, mais nous vous proposons
						ici de le faire à plusieurs. Chacun sera derrière son écran, mais
						visualisera en temps-réel les résultats des autres.
					</p>
					<p>
						C'est l'occasion de se confronter aux autres et de réfléchir
						ensemble aux enjeux de notre propre impact.
					</p>
				</Trans>
			)}
			<h2>{t('📘 Comment ça marche ?')}</h2>
			{!started && (
				<InstructionBlock
					index="1"
					title={<span>{t('💡 Choisissez un nom de salle')}</span>}
				>
					{!room && <NamingBlock {...{ newRoom, setNewRoom }} />}
					{room && <p>{t(`✅ C'est fait`)}</p>}
				</InstructionBlock>
			)}
			{!started && newRoom !== '' && !room && (
				<InstructionBlock
					index="2"
					title={<span>{t(`⏲️  Choisissez votre mode de simulation`)}</span>}
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
							<h3>
								<Trans>Sondage</Trans>
							</h3>
							<p>
								<Trans
									i18nKey={
										'publicodes.conference.Instructions.descriptionModeSondage'
									}
								>
									Mode persistant : l'interface est presque la même, mais les
									données sont stockées sur notre serveur et ainsi restent
									accessibles <strong>pendant deux mois</strong>.
								</Trans>
							</p>
						</label>
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
							<h3>
								<Trans>Conférence</Trans>
							</h3>
							<p>
								<Trans
									i18nKey={
										'publicodes.conference.Instructions.descriptionModeConference'
									}
								>
									Mode éphémère : parfait pour l'animation d'un atelier, une
									présentation interactive ou entre amis. Les données restent
									entre les participants (pair-à-pair), sans serveur,{' '}
									<strong>juste le temps de la conférence</strong>.
								</Trans>
							</p>
						</label>
					</div>
					{mode == 'conférence' && (
						<p>
							<Trans
								i18nKey={`publicodes.conference.Instructions.avertissementModeConference`}
							>
								🔒️ Votre organisation peut bloquer l'utilisation du mode
								conférence. Faites le test au préalable en duo : en cas de
								problème, vous pouvez utiliser le mode sondage.
							</Trans>
						</p>
					)}
					{mode == 'sondage' && (
						<p>
							<Trans
								i18nKey={`publicodes.conference.Instructions.contextualisationLink`}
							>
								💡 Vous souhaitez ajouter des questions pour obtenir des
								informations supplémentaires sur les répondants ?{' '}
								<Link to={'/groupe/documentation-contexte'}>
									Découvrez la fonctionnalité "contextualisation de sondage !"{' '}
								</Link>
							</Trans>
						</p>
					)}
				</InstructionBlock>
			)}
			{newRoom !== '' && !room && (
				<InstructionBlock index="3" title={t('Prêt à démarrer ?')}>
					<LoadingButton {...{ mode, URLPath, room: room || newRoom }} />
				</InstructionBlock>
			)}
			<InstructionBlock
				index="4"
				noIndex={started}
				title={
					<span>{t(`🔗 Partagez le lien à vos amis, collègues, etc.`)}</span>
				}
			>
				{!newRoom && !room ? (
					<p>
						<Trans>Choisissez d'abord un nom</Trans>
					</p>
				) : newRoom && !room ? null : (
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
							renderAs={'svg'}
							role={'img'}
							aria-label={'QR code'}
						/>
						<ShareButton
							text={t("Faites un test d'empreinte climat avec moi")}
							url={shareURL}
							title={t('Nos Gestes Climat Conférence')}
						/>
					</div>
				)}
			</InstructionBlock>
			<InstructionBlock
				index="5"
				noIndex={started}
				title={<span>{t(`🎰 Faites toutes et tous votre simulation`)}</span>}
			>
				{!room ? null : mode === 'conférence' ? (
					<>
						<p>
							<Trans
								i18nKey={`publicodes.conference.Instructions.liensSimulationConference`}
							>
								Au moment convenu, ouvrez ce lien tous en même temps et faites
								chacun de votre côté votre simulation.
							</Trans>
						</p>
						<Link to={'/simulateur/bilan'}>
							<button className="ui__ button plain">
								{t(`Faites votre test`)}
							</button>
						</Link>
					</>
				) : (
					<>
						<p>
							<Trans
								i18nKey={`publicodes.conference.Instructions.liensSimulationSondage`}
							>
								Les participants doivent venir faire leur simulation sur ce
								lien.
							</Trans>
						</p>
						<Link to={'/simulateur/bilan'}>
							<button className="ui__ button plain">
								{t(`Faites votre test`)}
							</button>
						</Link>
					</>
				)}
			</InstructionBlock>
			<InstructionBlock
				index="6"
				noIndex={started}
				title={
					<span>
						{t(`🧮 Visualisez à tout moment les résultats de votre groupe`)}
					</span>
				}
			>
				<Trans i18nKey={`publicodes.conference.Instructions.resultatInfos`}>
					Les résultats pour chaque catégorie (alimentation, transport, logement
					...) s'affichent progressivement et en temps réel pour l'ensemble du
					groupe sur{' '}
				</Trans>
				{!started ? (
					t(`la page à partager à l'étape 3`)
				) : (
					<span>
						{t(`cette page`)} <Link to={URLPath}>{URLPath}</Link>
					</span>
				)}
				.
			</InstructionBlock>
			{room && (
				<InstructionBlock
					noIndex={started}
					title={
						<span>
							<Trans>
								📊 Analysez les résultats et animez les discussions !
							</Trans>
						</span>
					}
				>
					<Trans i18nKey={`publicodes.conference.Instructions.guideLien`}>
						Les résultats sont là, que faire ? Notre guide vous accompagne dans
						vos réflexions et vos discussions sur cette page
					</Trans>
					&nbsp;
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
					width: 4rem;
					background: var(--lightercolor);
					border-radius: 5rem;
					margin: 0 1rem;
				`}
			>
				{index}
			</div>
		)}
		<div
			css={`
				width: calc(100% - 3rem);
				@media (max-width: 800px) {
					width: 100%;
				}
			`}
		>
			<h3>{title}</h3>
			{children}
		</div>
	</div>
)
