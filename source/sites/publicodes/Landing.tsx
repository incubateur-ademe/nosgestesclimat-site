import Illustration from 'Components/AnimatedIllustration'
import LangSwitcher from 'Components/LangSwitcher'
import animate from 'Components/ui/animate'
import LogoADEME from 'Images/logoADEME.svg'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import NewsBanner from '../../components/NewsBanner'
import { CircleSVG } from '../../components/ProgressCircle'
import { openmojiURL } from '../../components/SessionBar'
import { IframeOptionsContext } from '../../components/utils/IframeOptionsProvider'
import Meta from '../../components/utils/Meta'
import useMediaQuery from '../../components/utils/useMediaQuery'
import { TrackerContext } from '../../components/utils/withTracker'
import DocumentationButton from './DocumentationButton'
import LandingContent from './LandingContent'
import LandingExplanations from './LandingExplanations'
import { useProfileData } from './Profil'

const fluidLayoutMinWidth = '1200px'

export default () => {
	const tracker = useContext(TrackerContext)
	const { t } = useTranslation()
	const mobile = useMediaQuery(`(max-width: ${fluidLayoutMinWidth})`)
	const { isIframe } = useContext(IframeOptionsContext)

	return (
		<div
			css={`
				margin: 0 auto;
				border-radius: 1rem;
				> div > a {
				}
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;
				align-items: center;
				min-height: 85vh;
				footer {
					margin-top: auto;
				}
			`}
		>
			<Meta
				title={t('Connaissez-vous votre empreinte climat ?')}
				description={t('meta.publicodes.Landing.description')}
				image="https://nosgestesclimat.fr/images/dessin-nosgestesclimat.png"
			/>
			<div
				css={`
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					flex-wrap: wrap;
					margin-top: 4rem;
					padding: 0.6rem;
					h1 {
						margin-top: 0.3rem;
						font-size: 220%;
						line-height: 1.1em;
						font-weight: bold;

						color: var(--darkColor);
					}
					p {
						font-size: 110%;
					}
					@media (max-width: ${fluidLayoutMinWidth}) {
						margin-top: 2rem;
						text-align: center;
						h1 {
							font-size: 180%;
						}
					}
				`}
			>
				<div
					css={`
						display: flex;
						flex-direction: column;
						max-width: 35rem;
					`}
				>
					<h1>
						<Trans i18nKey={'publicodes.Landing.question'}>
							Connaissez-vous votre empreinte sur le climat ?
						</Trans>
					</h1>
					{mobile && <Illustration small aira-hidden="true" />}
					<p>
						<Trans i18nKey={'sites.publicodes.Landing.description'}>
							En 10 minutes, obtenez une estimation de votre empreinte carbone
							de consommation.
						</Trans>
					</p>
					<div>
						<div
							css={`
								margin-top: 1rem;
								> a {
									margin: 0.6rem 1rem 0.6rem 0 !important;
									display: inline-flex !important;
									align-items: center !important;
									> svg,
									img {
										margin-right: 0.4rem;
									}
								}
							`}
						>
							<Link
								to="/simulateur/bilan"
								className="ui__ plain button cta"
								css={``}
								onClick={() =>
									tracker.push([
										'trackEvent',
										'NGC',
										'Clic CTA accueil',
										'Faire le test',
									])
								}
							>
								<CircleSVG progress={0} white />
								<span>
									<Trans>Faire le test</Trans>
								</span>
							</Link>
							<Link
								to="/groupe"
								className="ui__ button cta"
								onClick={() =>
									tracker.push([
										'trackEvent',
										'NGC',
										'Clic CTA accueil',
										'Faire le test à plusieurs',
									])
								}
							>
								<img
									src="/images/silhouettes.svg"
									width="100"
									height="100"
									css="width: 2rem; height: auto"
								/>
								<span>
									<Trans>En groupe</Trans>
								</span>
							</Link>
							<ProfileLink />
						</div>
						<NewsBanner />
					</div>
				</div>
				{!mobile && <Illustration aira-hidden="true" />}
			</div>

			<div
				css={`
					display: flex;
					justify-content: center;
					align-items: center;
					flex-wrap: wrap;
					max-width: 70%;
					margin-top: 1rem;
					> img,
					> a {
						margin: 1rem 0.4rem;
						display: flex;
						align-items: center;
					}
					> a {
						height: 100%;
					}
				`}
			>
				<img
					src="/images/marianne.svg"
					alt="République Française"
					css="width: 6rem; height: auto; margin-right: .6rem"
					width="96"
					height="86"
				/>
				<a href="https://ademe.fr" css="svg {width: 4rem !important}">
					<LogoADEME />
				</a>
				<a href="https://datagir.ademe.fr">
					<img
						css="height: 3.4rem; width: auto;"
						src="https://datagir.ademe.fr/logo.jpg"
					/>
				</a>
				<a href="https://abc-transitionbascarbone.fr">
					<img
						css="width: 6rem; height: auto;margin-left: 1rem !important"
						src="https://abc-transitionbascarbone.fr/wp-content/uploads/2022/02/logo-ABC-web.png"
						alt="Logo de l'Association pour la transition Bas Carbone"
						width="86"
						height="29"
					/>
				</a>
			</div>

			{!isIframe && <LandingExplanations />}

			<LandingContent background footer>
				<footer>
					{!isIframe && ( // would be a repetition with header logos
						<div
							css={`
								background: var(--lightestColor);
								display: flex;
								align-items: center;
								justify-content: center;
								flex-wrap: wrap;
								margin: 1rem;
								img {
									margin: 0 0.6rem;
								}
							`}
						>
							<img
								src="/images/logo-france-relance.svg"
								alt="Logo de France Relance"
								css="width: 5rem; height: auto; margin-right: .6rem"
								width="96"
								height="86"
							/>

							<div
								css={`
									display: flex;
									align-items: center;
									flex-direction: column;
									font-size: 90%;
									font-weight: bold;
								`}
							>
								<img
									src="/images/union-européenne.svg"
									alt="Logo de l'Union Européenne"
									css="width: 5rem; height: auto; margin-right: .6rem;"
									width="96"
									height="86"
								/>
								<span>NextGenerationEU</span>
							</div>
						</div>
					)}
					<div
						css={`
							display: flex;
							justify-content: center;
							align-items: center;
							flex-wrap: wrap;
							> * {
								margin: 0 0.6rem;
							}
							img {
								font-size: 120%;
							}
						`}
					>
						<Link to="/à-propos">
							<Trans>À propos</Trans>
						</Link>
						<DocumentationButton />
						<Link to="/diffuser">
							<Trans>Diffuser</Trans>
						</Link>
						<Link to="/nouveautés">
							<Trans>Nouveautés</Trans>
						</Link>
						<div>
							<LangSwitcher className="simple small" from="landing" />
						</div>
					</div>
					<div
						css={`
							display: flex;
							justify-content: center;
							align-items: center;
							> * {
								margin: 0 0.6rem;
								font-size: 80%;
							}
						`}
					>
						<Link to="/accessibilite" style={{ textDecoration: 'none' }}>
							<Trans>Accessibilité : partiellement conforme</Trans>
						</Link>
					</div>
				</footer>
			</LandingContent>
		</div>
	)
}

const ProfileLink = () => {
	const { hasData } = useProfileData()
	const { t } = useTranslation()

	if (!hasData) {
		return null
	}

	return (
		<animate.appear delay="1">
			<div
				css={`
					display: flex;
					justify-content: center;
					margin-top: 1rem;
				`}
			>
				<Link
					to="/profil"
					title={t('Page profil')}
					css={`
						width: 18rem !important;
						border-radius: 2rem !important;
						display: flex !important;
						align-items: center !important;
					`}
				>
					<img
						aria-hidden="true"
						src={openmojiURL('profile')}
						css="width: 1.5rem"
					/>
					<span
						css={`
							margin-left: 0.5rem;
						`}
					>
						<Trans>Retrouver ma simulation</Trans>
					</span>
				</Link>
			</div>
		</animate.appear>
	)
}
