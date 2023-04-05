import {
	HeaderContent,
	HeaderCTAs,
	LandingHeaderWrapper,
	LandingLayout,
} from 'Components/LandingLayout'
import Meta from 'Components/utils/Meta'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useMediaQuery } from 'usehooks-ts'
import { fluidLayoutMinWidth } from '../../../components/LandingLayout'
import RegionGrid from '../../../components/localisation/RegionGrid'
import LandingContent from '../LandingContent'

const Illustration = () => (
	<img
		src="/images/international-illustration.jpeg"
		css="max-height: 50vh; padding: 2rem"
	/>
)

export default () => {
	const { t } = useTranslation()
	const mobile = useMediaQuery(`(max-width: ${fluidLayoutMinWidth})`)
	const title = t("Le calculateur d'empreinte climat international"),
		description = t(
			'Où que vous vivez, calculez votre empreinte carbone personnelle avec les particularités de votre pays.'
		)
	return (
		<LandingLayout>
			<Meta
				title={title}
				description={description}
				image="https://nosgestesclimat.fr/images/international-illustration.jpeg"
			/>

			<LandingHeaderWrapper>
				<HeaderContent>
					<h1>{title}</h1>
					{mobile && <Illustration aira-hidden="true" />}
					<p>{description}</p>
					<div>
						<HeaderCTAs>
							<Link to="/simulateur/bilan" className="ui__ plain button cta">
								<span>
									<Trans>Faire le test</Trans>
								</span>
							</Link>
						</HeaderCTAs>
					</div>
				</HeaderContent>
				{!mobile && <Illustration aira-hidden="true" />}
			</LandingHeaderWrapper>
			<LandingContent background>
				<h2>
					<Trans i18nKey="international.pourquoi.titre">
						Adapté à votre pays
					</Trans>
				</h2>
				<p>
					<Trans i18nKey="international.pourquoi.1">
						Les modes de vies ne sont pas les mêmes en fonction du pays dans
						lequel on vit. Certains pays ont un réseau ferré très développé,
						d'autres sont insulaires et donc reposent davantage sur le ferry et
						l'avion.
					</Trans>
				</p>
				<p>
					<Trans i18nKey="international.pourquoi.2">
						Au fur et à mesure que l'électricité prend une place très importante
						grâce à la transition énergétique, l'empreinte carbone du mix
						électrique influence fortement le calcul d'empreinte climat.
					</Trans>
				</p>
			</LandingContent>
			<LandingContent>
				<h2>
					<Trans i18nKey="international.comment.titre">
						Comment ça marche ?
					</Trans>
				</h2>
				<p>
					<Trans i18nKey="international.comment.1">
						Pour proposer un modèle pour chaque pays, il nous faut forcément une
						base. Nos Gestes Climat s'est construit sur le cas de la France. À
						partir de là, chaque pays décrit ses différences par rapport à la
						base.
					</Trans>
					<p>
						<Trans is18nKey="international.comment.2">
							Explorez en détail les spécificités de chaque pays.
						</Trans>
						<span
							css={`
								background: var(--lighterColor);
								border-radius: 0.4rem;
								padding: 0.1rem 0.4rem;
								margin-left: 1rem;
								white-space: nowrap;
							`}
						>
							⏳️ <Trans>À venir !</Trans>
						</span>
					</p>
				</p>
			</LandingContent>
			<LandingContent background>
				<div css=" margin: 0 auto">
					<RegionGrid open={true} />
				</div>
			</LandingContent>
			<LandingContent>
				<h2>
					<Trans i18nKey="international.ensuite.titre">
						Vous ne trouvez pas votre pays ?
					</Trans>
				</h2>
				<p>
					<Trans i18nKey="international.ensuite.1">
						Nous avons lancé une première version de l'internationalisation qui
						comprend une douzaine de pays. Nous le faisons pas à pas, pour
						consolider les particularités de chaque pays. Le votre n'y est pas ?{' '}
						<Link to="/à-propos">Écrivez-nous !</Link>
					</Trans>
				</p>
			</LandingContent>
		</LandingLayout>
	)
}
