import {
	HeaderContent,
	HeaderCTAs,
	LandingHeaderWrapper,
	LandingLayout,
} from 'Components/LandingLayout'
import Meta from 'Components/utils/Meta'
import LogoADEME from 'Images/logoADEME.svg'
import React, { Suspense } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useMediaQuery } from 'usehooks-ts'
import { fluidLayoutMinWidth } from '../../../components/LandingLayout'

const LazyIllustration = React.lazy(
	() => import('Components/AnimatedIllustration')
)

const Illustration = () => (
	<Suspense fallback={null}>
		<LazyIllustration />
	</Suspense>
)

export default () => {
	const { t } = useTranslation()
	const mobile = useMediaQuery(`(max-width: ${fluidLayoutMinWidth})`)
	const title = t('International')
	return (
		<LandingLayout>
			<Meta
				title={title}
				description={t('meta.publicodes.Landing.description')}
				image="https://nosgestesclimat.fr/images/dessin-nosgestesclimat.png"
			/>

			<LandingHeaderWrapper>
				<HeaderContent>
					<h1>{title}</h1>
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
						</HeaderCTAs>
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
		</LandingLayout>
	)
}
