import animate from 'Components/ui/animate'
import LogoADEME from 'Images/logoADEME.svg'
import React, { Suspense, useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
	fluidLayoutMinWidth,
	HeaderContent,
	HeaderCTAs,
	LandingHeaderWrapper,
	LandingLayout,
} from '../../components/LandingLayout'
import NewsBanner from '../../components/NewsBanner'
import PartnerBanner from '../../components/PartnerBanner'
import { CircleSVG } from '../../components/ProgressCircle'
import { openmojiURL } from '../../components/SessionBar'
import { IframeOptionsContext } from '../../components/utils/IframeOptionsProvider'
import Meta from '../../components/utils/Meta'
import useMediaQuery from '../../components/utils/useMediaQuery'
import { TrackerContext } from '../../components/utils/withTracker'
import LandingExplanations from './LandingExplanations'
import { useProfileData } from './Profil'

const LazyIllustration = React.lazy(
	() => import('Components/AnimatedIllustration')
)

const Illustration = () => (
	<Suspense fallback={null}>
		<LazyIllustration />
	</Suspense>
)

export default () => {
	const tracker = useContext(TrackerContext)
	const { t } = useTranslation()
	const mobile = useMediaQuery(`(max-width: ${fluidLayoutMinWidth})`)
	const { isIframe } = useContext(IframeOptionsContext)

	return (
		<LandingLayout>
			<Meta
				title={t('Connaissez-vous votre empreinte climat ?')}
				description={t('meta.publicodes.Landing.description')}
				image="https://nosgestesclimat.fr/images/dessin-nosgestesclimat.png"
			/>

			<LandingHeaderWrapper>
				<HeaderContent>
					<h1>
						<Trans i18nKey={'publicodes.Landing.question'}>
							Connaissez-vous votre empreinte sur le climat ?
						</Trans>
					</h1>
					{mobile && <Illustration aira-hidden="true" />}
					<p>
						<Trans i18nKey={'sites.publicodes.Landing.description'}>
							En 10 minutes, obtenez une estimation de votre empreinte carbone
							de consommation.
						</Trans>
					</p>
					<div>
						<HeaderCTAs>
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
						</HeaderCTAs>
						<div
							css={`
								display: flex;
								align-items: center;
								justify-content: center;
								flex-wrap: wrap;
							`}
						>
							<PartnerBanner />
							<NewsBanner />
						</div>
					</div>
				</HeaderContent>
				{!mobile && <Illustration aira-hidden="true" />}
			</LandingHeaderWrapper>

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
						width="120"
						height="60"
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
		</LandingLayout>
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
