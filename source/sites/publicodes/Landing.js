import Illustration from 'Components/AnimatedIllustration'
import animate from 'Components/ui/animate'
import LogoADEME from 'Images/logoADEME.svg'
import React, { Suspense, useContext, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import NewsBanner from '../../components/NewsBanner'
import { openmojiURL } from '../../components/SessionBar'
import { IframeOptionsContext } from '../../components/utils/IframeOptionsProvider'
import Meta from '../../components/utils/Meta'
import useMediaQuery from '../../components/utils/useMediaQuery'
import { TrackerContext } from '../../components/utils/withTracker'
import DocumentationButton from './DocumentationButton'
import LandingContent from './LandingContent'
import LandingExplanations from './LandingExplanations'
import { useProfileData } from './Profil'

const SurveyModal = React.lazy(() => import('./SurveyModal'))

const fluidLayoutMinWidth = '1200px'

export default () => {
	const tracker = useContext(TrackerContext)
	const [showSurveyModal, setShowSurveyModal] = useState(false)
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
				title="Connaissez-vous votre empreinte climat ?"
				description="Testez votre empreinte carbone, tout seul ou en groupe. Découvrez la répartition de votre empreinte. Suivez le parcours de passage à l'action pour la réduire."
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
						max-width: 30rem;
					`}
				>
					<h1>Connaissez-vous votre empreinte sur le climat&nbsp;?</h1>
					{mobile && <Illustration small aira-hidden="true" />}
					<p>
						En 10 minutes, obtenez une estimation de votre empreinte carbone de
						consommation.
					</p>
					<div css="margin: 1rem 0">
						<button
							className="ui__ link-button"
							onClick={() => setShowSurveyModal(true)}
						>
							Participez à notre enquête utilisateurs !
						</button>
						{showSurveyModal && (
							<Suspense fallback={''}>
								<SurveyModal
									showSurveyModal={showSurveyModal}
									setShowSurveyModal={setShowSurveyModal}
								/>
							</Suspense>
						)}
						<div
							css={`
								margin-top: 1rem;
								> a {
									margin: 0.6rem 1rem 0.6rem 0 !important;
								}
							`}
						>
							<Link
								to="/simulateur/bilan"
								className="ui__ plain button cta"
								onClick={() =>
									tracker.push([
										'trackEvent',
										'NGC',
										'Clic CTA accueil',
										'Faire le test',
									])
								}
							>
								{emoji('▶️')} Faire le test
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
								{emoji('👥')} En groupe
							</Link>
						</div>
						<NewsBanner />
					</div>
				</div>
				{!mobile && <Illustration aira-hidden="true" />}
			</div>
			<ProfileLink />
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
								margin-bottom: 1rem;
								img {
									margin: 0 0.6rem;
								}
							`}
						>
							<img
								src="/images/marianne.svg"
								alt="République Française"
								css="width: 7.5rem; height: auto; margin-right: .6rem"
								width="96"
								height="86"
							/>
							<a href="https://ademe.fr">
								<LogoADEME />
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
						<Link to="/à-propos">À propos</Link>
						<DocumentationButton />
						<Link to="/diffuser">Diffuser</Link>
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
							Accessibilité : partiellement conforme
						</Link>
					</div>
				</footer>
			</LandingContent>
		</div>
	)
}

const ProfileLink = () => {
	const { hasData } = useProfileData()
	if (!hasData) return null
	return (
		<animate.fromTop delay="1">
			<div
				css={`
					button {
						padding: 0 0.2rem !important;
						border-radius: 1rem !important;
					}
				`}
			>
				<Link
					to="/profil"
					title="Page profil"
					className="ui__ button plain small"
					css="border-radius: 2rem !important"
				>
					<img
						aria-hidden="true"
						src={openmojiURL('profile')}
						css="width: 2rem"
					/>
				</Link>
			</div>
		</animate.fromTop>
	)
}
