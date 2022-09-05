import animate from 'Components/ui/animate'
import LogoADEME from 'Images/logoADEME.svg'
import { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import NewsBanner from '../../components/NewsBanner'
import { openmojiURL } from '../../components/SessionBar'
import Meta from '../../components/utils/Meta'
import { TrackerContext } from '../../components/utils/withTracker'
import DocumentationButton from './DocumentationButton'
import Illustration from 'Images/ecolab-climat-dessin.svg'
import { useProfileData } from './Profil'

export default () => {
	const tracker = useContext(TrackerContext)
	return (
		<div
			css={`
				max-width: 850px;
				margin: 0 auto;
				border-radius: 1rem;
				padding: 0.4rem;
				h1 {
					margin-top: 0.3rem;
					font-size: 140%;
					line-height: 1.2em;
				}
				> div > a {
				}
				text-align: center;
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
			<h1>Connaissez-vous votre empreinte sur le climat ?</h1>
			<Illustration
				aira-hidden="true"
				css={`
					width: 60%;
					height: auto;
					border-radius: 0.8rem;
					@media (max-width: 800px) {
						width: 95%;
					}
				`}
			/>
			<div css="margin: 1rem 0">
				<div>
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
						Faire le test
					</Link>
				</div>
				<div>
					<Link
						to="/groupe"
						className="ui__ button small"
						onClick={() =>
							tracker.push([
								'trackEvent',
								'NGC',
								'Clic CTA accueil',
								'Faire le test à plusieurs',
							])
						}
					>
						{emoji('👥')} Faire le test à plusieurs
					</Link>
				</div>
				<NewsBanner />
			</div>

			<footer>
				<div
					css={`
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
						css="height: 6rem; margin-right: .6rem"
						width="96"
						height="86"
					/>
					<a href="https://ademe.fr">
						<LogoADEME />
					</a>
					<a href="https://abc-transitionbascarbone.fr">
						<img
							css="height: 2rem; margin-left: 1rem !important"
							src="https://abc-transitionbascarbone.fr/wp-content/uploads/2022/02/logo-ABC-web.png"
							alt="Logo de l'Association pour la transition Bas Carbone"
							width="86"
							height="29"
						/>
					</a>
				</div>
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
					<ProfileLink />
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
						css="width: 2rem; filter: invert(1)"
					/>
				</Link>
			</div>
		</animate.fromTop>
	)
}
